import { sequelize } from "../config/db.js";
import {
  Payment,
  Order,
  CustomerInvoice,
  SellerInvoice,
  OrderItem,
  Product,
} from "../models/associations.js";

class PaymentController {
  pay = async (req, res) => {
    const t = await sequelize.transaction();

    const { orderId, cardNumber } = req.body;

    const userId = req.user.userId;

    try {
      const order = await Order.findByPk(orderId, { transaction: t });

      if (!order) {
        await t.rollback();
        return res.status(404).json({ message: "Order not found!" });
      }

      if (order.status !== "WAITING_FOR_PAYMENT") {
        await t.rollback();
        return res.status(409).json({ message: "Order doesn't need payment!" });
      }

      if (order.userId !== userId) {
        await t.rollback();
        return res
          .status(403)
          .json({ message: "Unauthorized to pay this order!" });
      }

      // 🔒 Simulate payment processing
      // In real world: call Stripe here
      const payment = await Payment.create(
        {
          orderId,
          amount: order.totalPrice,
          cardLast4: cardNumber.slice(-4),
          status: "SUCCESS",
          processedAt: new Date(),
        },
        { transaction: t },
      );

      // Update order
      order.status = "PAID";
      order.paidAt = new Date();
      await order.save({ transaction: t });

      // Generate proper invoice number
      const invoiceNumber = `INV-${Date.now()}-${order.id}`;

      const customerInvoice = await CustomerInvoice.create(
        {
          orderId: orderId,
          invoiceNumber,
          totalAmount: order.totalPrice,
          status: "ISSUED",
          issuedAt: new Date(),
        },
        { transaction: t },
      );

      const orderItems = await OrderItem.findAll({
        where: { orderId },
        include: {
          model: Product,
          as: "product",
          attributes: ["sellerId"],
        },
        transaction: t,
      });

      const sellerMap = {};

      for (const item of orderItems) {
        const sellerId = item.product.sellerId;

        if (!sellerMap[sellerId]) {
          sellerMap[sellerId] = 0;
        }

        sellerMap[sellerId] += Number(item.unitPrice) * item.quantity;
      }

      for (const [sellerId, totalAmount] of Object.entries(sellerMap)) {
        await SellerInvoice.create(
          {
            orderId,
            sellerId,
            invoiceNumber: `SELLER-INV-${Date.now()}-${order.id}-${sellerId}`,
            totalAmount,
            status: "ISSUED",
            issuedAt: new Date(),
          },
          { transaction: t },
        );
      }

      await t.commit();

      return res.status(200).json({
        message: "Payment successful",
        paymentId: payment.id,
        invoiceId: customerInvoice.id,
      });
    } catch (error) {
      await t.rollback();

      console.error(error);

      return res.status(error.status || 500).json({
        message: error.message || "Payment failed!",
      });
    }
  };
}

export default new PaymentController();
