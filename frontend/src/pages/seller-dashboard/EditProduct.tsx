import LoadingSpinnerInfinity from "@/components/LoadingSpinnerInfinity";
import EditProductForm from "@/components/product/EditProductForm";
import EditProductImages from "@/components/product/EditProductImages";
import useGetProductById from "@/hooks/useGetProductById";
import { useParams } from "react-router-dom";

const EditProduct = () => {
  const id = useParams().id || "";

  const { data, isLoading } = useGetProductById(id);

  if (isLoading) return <LoadingSpinnerInfinity />;

  return (
    <>
      {data && (
        <>
          <h1 className="text-3xl mb-4 text-center">Edit Product</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditProductForm initialData={data.product} />

            <EditProductImages
              productId={data.product.id}
              images={data.product.images}
              primaryIndex={data.product.primaryImageIndex}
            />
          </div>
        </>
      )}
    </>
  );
};

export default EditProduct;
