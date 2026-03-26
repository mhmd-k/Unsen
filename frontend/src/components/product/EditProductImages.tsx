import { StarIcon, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import UploadImagesDialog from "./UploadImagesDialog";

interface EditProductImagesProps {
  productId: number;
  images: { public_id: string; url: string }[];
  primaryIndex: number;
}

const EditProductImages = ({
  productId,
  images,
  primaryIndex,
}: EditProductImagesProps) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const handleDelete = async (imageIndex: number) => {
    try {
      await axiosPrivate.delete(`/products/${productId}/images/${imageIndex}`);

      queryClient.invalidateQueries({
        queryKey: ["product-by-id", productId.toString()],
      });

      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
      console.error(error);
    }
  };

  const handleSetPrimary = async (imageIndex: number) => {
    try {
      await axiosPrivate.patch(`/products/${productId}/images/primary`, {
        newPrimaryIndex: imageIndex,
      });

      queryClient.invalidateQueries({
        queryKey: ["product-by-id", productId.toString()],
      });

      toast.success("Primary image updated successfully");
    } catch (error) {
      toast.error("Failed to update primary image");
      console.error(error);
    }
  };

  return (
    <Card className="h-fit">
      <CardContent>
        <h2 className="text-xl mb-4">Product Images</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="relative">
                <img
                  src={img.url}
                  alt={`Product Image ${index + 1}`}
                  className={`w-full h-48 object-cover rounded-md ${index === primaryIndex ? "border-2 border-main" : "border-2 border-gray-300"}`}
                />
                {index === primaryIndex && (
                  <span className="absolute top-2 left-2 bg-main text-white text-xs px-2 py-1 rounded">
                    Primary
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleSetPrimary(index)}>
                  <StarIcon />
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-400"
                  onClick={() => handleDelete(index)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}

          {/* this should open a dialog to upload new images */}
          {images.length < 5 && (
            <UploadImagesDialog maxFiles={5 - images.length} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EditProductImages;
