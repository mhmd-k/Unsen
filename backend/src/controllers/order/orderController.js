import { sequelize } from "../../config/db.js";
import {
  Order,
  OrderItem,
  Product,
  Invoice,
} from "../../models/associations.js";

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

        console.log("product: ", product);

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
        product.stock -= item.quantity;
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
        { transaction: t }
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
            { transaction: t }
          )
        )
      );

      const invoice = await Invoice.create(
        {
          orderId: order.id,
          issuedDate: new Date(),
          amount: totalPrice,
          status: "GENERATED",
        },
        { transaction: t }
      );

      await t.commit();

      return res.status(201).json({
        message: "Order placed successfully",
        order,
        invoice,
      });
    } catch (error) {
      await t.rollback();
      console.error(error);
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Failed to place order" });
    }
  };
}

export default new OrderController();
