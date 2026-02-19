import { sequelize } from "../../config/db.js";
import { Payment, Order, Invoice } from "../../models/associations.js";

class PaymentController {
  pay = async (req, res) => {
    const t = await sequelize.transaction();

    try {
      const { orderId, cardNumber } = req.body;

      const userId = req.user.userId;

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

      // Count previous attempts
      const attemptCount = await Payment.count({
        where: { orderId },
        transaction: t,
      });

      // 🔒 Simulate payment processing
      // In real world: call Stripe here
      const payment = await Payment.create(
        {
          orderId,
          attemptNumber: attemptCount + 1,
          amount: order.totalPrice,
          paymentMethod: "CREDIT_CARD",
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

      const invoice = await Invoice.create(
        {
          orderId: order.id,
          invoiceNumber,
          totalAmount: order.totalPrice,
          status: "ISSUED",
          issuedAt: new Date(),
        },
        { transaction: t },
      );

      await t.commit();

      return res.status(200).json({
        message: "Payment successful",
        paymentId: payment.id,
        invoiceId: invoice.id,
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
