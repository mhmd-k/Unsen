import { sequelize } from "../config/db.js";
import { Order, OrderItem, Product } from "../models/associations.js";
import { Op } from "sequelize";

// Helper function to generate last 12 months
const getLast12Months = () => {
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    months.push(month);
  }
  return months;
};

class SellerAnalyticsController {
  getSellerAnalytics = async (req, res) => {
    const sellerId = req.user.userId;

    try {
      const [
        totalRevenueResult,
        totalOrdersResult,
        totalProductsResult,
        totalItemsSoldResult,
        revenueOverTime,
        top3Products,
        orderStatusBreakdown,
        ordersOverTime,
      ] = await Promise.all([
        // Total revenue from this seller's products
        OrderItem.findAll({
          attributes: [
            [
              sequelize.fn("SUM", sequelize.col("OrderItem.unitPrice")),
              "totalRevenue",
            ],
          ],
          include: [
            {
              model: Product,
              as: "product",
              where: { sellerId },
              attributes: [],
            },
            {
              model: Order,
              as: "order",
              where: { status: "PAID" },
              attributes: [],
            },
          ],
          raw: true,
        }),

        // Total number of orders containing this seller's products
        Order.count({
          distinct: true,
          col: "id",
          include: [
            {
              model: OrderItem,
              as: "orderItems",
              include: [
                {
                  model: Product,
                  as: "product",
                  where: { sellerId },
                  attributes: [],
                },
              ],
            },
          ],
        }),

        // Total active products
        Product.count({
          where: { sellerId },
        }),

        // Total items sold
        OrderItem.findAll({
          attributes: [
            [
              sequelize.fn("SUM", sequelize.col("OrderItem.quantity")),
              "totalItemsSold",
            ],
          ],
          include: [
            {
              model: Product,
              as: "product",
              where: { sellerId },
              attributes: [],
            },
          ],
          raw: true,
        }),

        // 1. Revenue over time (monthly for the last 12 months)
        OrderItem.findAll({
          attributes: [
            [
              sequelize.fn(
                "DATE_FORMAT",
                sequelize.col("OrderItem.createdAt"),
                "%Y-%m",
              ),
              "month",
            ],
            [
              sequelize.fn("SUM", sequelize.col("OrderItem.unitPrice")),
              "revenue",
            ],
          ],
          include: [
            {
              model: Product,
              as: "product",
              where: { sellerId },
              attributes: [],
            },
            {
              model: Order,
              as: "order",
              where: { status: "PAID" },
              attributes: [],
            },
          ],
          where: {
            createdAt: {
              [Op.gte]: sequelize.literal("DATE_SUB(NOW(), INTERVAL 12 MONTH)"),
            },
          },
          group: [
            sequelize.fn(
              "DATE_FORMAT",
              sequelize.col("OrderItem.createdAt"),
              "%Y-%m",
            ),
          ],
          order: [
            [
              sequelize.fn(
                "DATE_FORMAT",
                sequelize.col("OrderItem.createdAt"),
                "%Y-%m",
              ),
              "ASC",
            ],
          ],
          raw: true,
        }),

        // 2. Top 3 products by revenue
        OrderItem.findAll({
          attributes: [
            "productId",
            [
              sequelize.fn("SUM", sequelize.col("OrderItem.unitPrice")),
              "totalRevenue",
            ],
            [
              sequelize.fn("SUM", sequelize.col("OrderItem.quantity")),
              "totalSold",
            ],
          ],
          include: [
            {
              model: Product,
              as: "product",
              where: { sellerId },
              attributes: ["id", "name"],
            },
          ],
          group: ["OrderItem.productId", "product.id", "product.name"],
          order: [
            [sequelize.fn("SUM", sequelize.col("OrderItem.unitPrice")), "DESC"],
          ],
          limit: 3,
          raw: true,
        }),

        // 3. Order status breakdown
        Order.findAll({
          attributes: [
            "status",
            [sequelize.fn("COUNT", sequelize.col("Order.id")), "count"],
          ],
          include: [
            {
              model: OrderItem,
              as: "orderItems",
              attributes: [],
              include: [
                {
                  model: Product,
                  as: "product",
                  where: { sellerId },
                  attributes: [],
                },
              ],
            },
          ],
          group: ["Order.status"],
          raw: true,
        }),

        // 4. Orders over time (monthly for the last 12 months)
        Order.findAll({
          attributes: [
            [
              sequelize.fn(
                "DATE_FORMAT",
                sequelize.col("Order.createdAt"),
                "%Y-%m",
              ),
              "month",
            ],
            [
              sequelize.fn(
                "COUNT",
                sequelize.fn("DISTINCT", sequelize.col("Order.id")),
              ),
              "totalOrders",
            ],
          ],
          include: [
            {
              model: OrderItem,
              as: "orderItems",
              attributes: [],
              include: [
                {
                  model: Product,
                  as: "product",
                  where: { sellerId },
                  attributes: [],
                },
              ],
            },
          ],
          where: {
            createdAt: {
              [Op.gte]: sequelize.literal("DATE_SUB(NOW(), INTERVAL 12 MONTH)"),
            },
          },
          group: [
            sequelize.fn(
              "DATE_FORMAT",
              sequelize.col("Order.createdAt"),
              "%Y-%m",
            ),
          ],
          order: [
            [
              sequelize.fn(
                "DATE_FORMAT",
                sequelize.col("Order.createdAt"),
                "%Y-%m",
              ),
              "ASC",
            ],
          ],
          raw: true,
        }),
      ]);

      // Fill missing months with 0
      const last12Months = getLast12Months();

      const revenueMap = Object.fromEntries(
        revenueOverTime.map((r) => [r.month, parseFloat(r.revenue)]),
      );
      const ordersMap = Object.fromEntries(
        ordersOverTime.map((o) => [o.month, parseInt(o.totalOrders)]),
      );

      const filledRevenueOverTime = last12Months.map((month) => ({
        month,
        revenue: revenueMap[month] || 0,
      }));

      const filledOrdersOverTime = last12Months.map((month) => ({
        month,
        totalOrders: ordersMap[month] || 0,
      }));

      return res.status(200).json({
        totalRevenue: totalRevenueResult[0]?.totalRevenue || 0,
        totalOrders: totalOrdersResult || 0,
        totalProducts: totalProductsResult || 0,
        totalItemsSold: totalItemsSoldResult[0]?.totalItemsSold || 0,

        revenueOverTime: filledRevenueOverTime, // ✅ always 12 months
        top3Products,
        orderStatusBreakdown,
        ordersOverTime: filledOrdersOverTime, // ✅ always 12 months
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: error.message || "Failed to fetch seller analytics" });
    }
  };
}

export default new SellerAnalyticsController();
