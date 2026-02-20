import { sequelize } from "../config/db.js";
import { Order, OrderItem, Product } from "../models/associations.js";

class OrderController {
  placeOrder = async (req, res) => {
    const { items, userId, contact, address, apartment, city, state, zipCode } =
      req.body;

    const t = await sequelize.transaction();

    try {
      let totalPrice = 0;
      const validatedItems = [];

      for (const item of items) {
        const product = await Product.findByPk(item.productId, {
          transaction: t,
        });
        if (!product) {
          return res.status(404).json({
            message: `Product with ID ${item.productId} not found`,
          });
        }

        if (product.stock === 0) {
          return res.status(409).json({
            message: `Product "${product.name}" is out of stock or doesn't have enough quantity.`,
          });
        }

        const discountedPrice =
          product.price - (product.discount * product.price) / 100;
        const lineTotal = discountedPrice * item.quantity;
        totalPrice += lineTotal;

        validatedItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: discountedPrice,
        });

        // Reduce stock
        let newStock = product.stock - item.quantity;
        if (newStock < 0) {
          return res.status(409).json({
            message: `Product "${product.name}" is out of stock or doesn't have enough quantity.`,
          });
        }

        product.stock = newStock;

        await product.save({ transaction: t });
      }

      const order = await Order.create(
        {
          userId,
          totalPrice,
          status: "WAITING_FOR_PAYMENT",
          contact,
          address,
          apartment,
          city,
          state,
          zipCode,
        },
        { transaction: t },
      );

      await Promise.all(
        validatedItems.map((item) =>
          OrderItem.create(
            {
              orderId: order.id,
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            },
            { transaction: t },
          ),
        ),
      );

      await t.commit();

      return res.status(201).json({
        message: "Order placed successfully",
        orderId: order.id,
        amount: order.totalPrice,
      });
    } catch (error) {
      await t.rollback();
      console.error(error);
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Failed to place order" });
    }
  };

  getUserOrders = async (req, res) => {
    const userId = req.user.userId;

    try {
      const userOrders = await Order.findAll({
        where: {
          userId,
        },
      });

      const orders = await Promise.all(
        userOrders.map(async (order) => {
          const items = await OrderItem.findAll({
            where: { orderId: order.id },
          });

          const products = await Promise.all(
            items.map(async (item) => {
              return await Product.findByPk(item.productId);
            }),
          );

          return {
            ...order.toJSON(),
            products,
          };
        }),
      );

      return res
        .status(200)
        .json({ message: "Orders retrived successfully", orders });
    } catch (error) {
      console.error(error);
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Failed to place order" });
    }
  };

  cancelOrder = async (req, res) => {
    const { orderId } = req.params;

    const t = await sequelize.transaction();

    try {
      const order = await Order.findByPk(orderId, { transaction: t });
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.status === "CANCELED" || order.status === "PAID") {
        return res.status(400).json({
          message: `Order cannot be canceled — order is already "${order.status}"`,
        });
      }

      const orderItems = await OrderItem.findAll({
        where: { orderId },
        transaction: t,
      });

      // Revert stock for each product
      await Promise.all(
        orderItems.map(async (item) => {
          const product = await Product.findByPk(item.productId, {
            transaction: t,
          });
          if (product) {
            product.stock += item.quantity;
            await product.save({ transaction: t });
          }
        }),
      );

      // Update order status and cancellation timestamp
      order.status = "CANCELLED";
      order.canceledAt = new Date();
      await order.save({ transaction: t });

      await t.commit();
      return res
        .status(200)
        .json({ message: "Order canceled successfully", order });
    } catch (error) {
      await t.rollback();
      console.error(error);
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Failed to cancel order" });
    }
  };

  getOrderById = async (req, res) => {
    const { orderId } = req.params;

    try {
      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const orderItems = await OrderItem.findAll({
        where: { orderId },
      });

      const products = await Promise.all(
        orderItems.map(async (item) => {
          const product = await Product.findByPk(item.productId);
          return product;
        }),
      );

      return res.status(200).json({
        message: "Order fetched successfully",
        order: {
          ...order.toJSON(),
          products: products.map((p) => ({
            ...p.dataValues,
            images: JSON.parse(p.images),
          })),
        },
      });
    } catch (error) {
      console.error(error);
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Failed to fetch order" });
    }
  };
}

export default new OrderController();
