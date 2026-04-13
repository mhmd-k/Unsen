import {
  SellerInvoice,
  OrderItem,
  Product,
  Order,
} from "../models/associations.js";

class InvoiceController {
  getSellerInvoices = async (req, res) => {
    const sellerId = req.user.userId;

    try {
      const sellerInvoices = await SellerInvoice.findAll({
        where: { sellerId },
        include: [
          {
            model: Order,
            as: "order",
            include: [
              {
                model: OrderItem,
                as: "orderItems",
                include: [
                  {
                    model: Product,
                    as: "product",
                  },
                ],
              },
            ],
          },
        ],
      });

      return res.status(200).json({
        message: "Seller invoices fetched successfully",
        invoices: sellerInvoices,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Failed to fetch seller orders" });
    }
  };

  getInvoiceDetails = async (req, res) => {
    const sellerId = req.user.userId;
    const invoiceId = req.params.id;
    try {
      const invoice = await SellerInvoice.findOne({
        where: { id: invoiceId, sellerId },
        include: [
          {
            model: Order,
            as: "order",
            include: [
              {
                model: OrderItem,
                as: "orderItems",
                include: [
                  {
                    model: Product,
                    as: "product",
                    where: { sellerId },
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      return res.status(200).json({
        message: "Invoice details fetched successfully",
        invoice,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Failed to fetch invoice details" });
    }
  };
}

export default new InvoiceController();
