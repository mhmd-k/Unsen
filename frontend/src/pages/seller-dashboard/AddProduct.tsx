// pages/AddProduct.tsx
import { useState } from "react";
import { toast } from "sonner";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useAuth } from "@/hooks/useAuth";
import ProductForm from "@/components/product/ProductForm";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (
    data: Record<string, unknown>,
    files: File[],
    primaryIndex: number,
  ) => {
    try {
      setLoading(true);

      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, String(value)),
      );

      formData.append("primaryImageIndex", String(primaryIndex));
      formData.append("sellerId", String(user?.id));

      files.forEach((file) => formData.append("images[]", file));

      await axiosPrivate.post("/products/create", formData);

      toast.success("Product created successfully");
      navigate("/seller-dashboard/products");
    } catch (error: unknown) {
      toast.error(
        error instanceof AxiosError ? error?.response?.data?.message : "Failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl mb-2 text-center">Sell a Product</h1>
      <p className="text-center mb-8">
        Enter the product info that you want to sell
      </p>

      <ProductForm onSubmit={handleSubmit} loading={loading} />
    </>
  );
};

export default AddProduct;
