import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Loader2, X, Star } from "lucide-react";
import toast from "react-hot-toast";
import { categories } from "@/lib/constants";
import image from "../assets/images/add-product-image.jpg";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useAuth } from "@/contexts/AuthContext";

// Define the form data type using Zod schema
const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Price must be a positive number",
    }),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  stock: z.coerce.number().gte(1),
  images: z.array(z.string()).min(1, { message: "Upload at least 1 image" }),
  primaryImageIndex: z.number(),
});

type ProductFormData = z.infer<typeof productSchema>;

const AddProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number>(0);

  const axiosPrivate = useAxiosPrivate();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  // Watch form data
  const watchedForm = watch();

  // Restore form data from session storage on mount
  useEffect(() => {
    const savedForm = sessionStorage.getItem("addProductForm");
    const savedPreviews = sessionStorage.getItem("addProductImagePreviews");
    const savedPrimaryIndex = sessionStorage.getItem(
      "addProductPrimaryImageIndex"
    );
    if (savedForm) {
      try {
        const parsed = JSON.parse(savedForm);
        reset(parsed);
      } catch {
        // ignore
      }
    }
    if (savedPreviews) {
      try {
        setImagePreviews(JSON.parse(savedPreviews));
      } catch {
        /* ignore */
      }
    }
    if (savedPrimaryIndex) {
      setPrimaryImageIndex(Number(savedPrimaryIndex));
    }
    // Note: File objects can't be restored from sessionStorage, so user will need to re-upload images after refresh
  }, [reset]);

  // Save form data to session storage on change
  useEffect(() => {
    sessionStorage.setItem("addProductForm", JSON.stringify(watchedForm));
    sessionStorage.setItem(
      "addProductImagePreviews",
      JSON.stringify(imagePreviews)
    );
    sessionStorage.setItem(
      "addProductPrimaryImageIndex",
      String(primaryImageIndex)
    );
    // Note: File objects can't be saved, so we skip imageFiles
  }, [watchedForm, imagePreviews, primaryImageIndex]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (imageFiles.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    const newImageFiles = [...imageFiles, ...files];
    setImageFiles(newImageFiles);

    // Create preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);

    // Update form value
    setValue(
      "images",
      newImageFiles.map((file) => file.name)
    );

    // If this is the first image, set it as primary
    if (imageFiles.length === 0) {
      setPrimaryImageIndex(0);
      setValue("primaryImageIndex", 0);
    }
    // Save previews and primary index to sessionStorage
    sessionStorage.setItem(
      "addProductImagePreviews",
      JSON.stringify([...imagePreviews, ...newPreviews])
    );
    sessionStorage.setItem(
      "addProductPrimaryImageIndex",
      String(primaryImageIndex)
    );
  };

  const removeImage = (index: number) => {
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(newImageFiles);

    // Revoke the preview URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);

    // Update form value
    setValue(
      "images",
      newImageFiles.map((file) => file.name)
    );

    // Handle primary image index when removing images
    if (index === primaryImageIndex) {
      // If we're removing the primary image, set the first remaining image as primary
      const newPrimaryIndex = Math.min(index, newImageFiles.length - 1);
      setPrimaryImageIndex(newPrimaryIndex);
      setValue("primaryImageIndex", newPrimaryIndex);
    } else if (index < primaryImageIndex) {
      // If we're removing an image before the primary, adjust the primary index
      setPrimaryImageIndex(primaryImageIndex - 1);
      setValue("primaryImageIndex", primaryImageIndex - 1);
    }
    // Save previews and primary index to sessionStorage
    sessionStorage.setItem(
      "addProductImagePreviews",
      JSON.stringify(newPreviews)
    );
    sessionStorage.setItem(
      "addProductPrimaryImageIndex",
      String(primaryImageIndex)
    );
  };

  const setPrimaryImage = (index: number) => {
    setPrimaryImageIndex(index);
    setValue("primaryImageIndex", index);
    toast.success("Primary image updated");
    // Save primary index to sessionStorage
    sessionStorage.setItem("addProductPrimaryImageIndex", String(index));
  };

  const onSubmit = async (data: ProductFormData) => {
    console.log("Product data:", data);
    console.log("Image files:", imageFiles);
    console.log("Primary image index:", primaryImageIndex);

    // Build FormData for multipart/form-data
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", String(data.price));
    formData.append("category", data.category);
    formData.append("brand", data.brand);
    formData.append("stock", String(data.stock));
    formData.append("primaryImageIndex", String(primaryImageIndex));
    if (user?.id) formData.append("sellerId", `${user.id}`);
    imageFiles.forEach((file) => {
      formData.append("images[]", file);
    });

    console.log("form data:", formData);

    try {
      setIsLoading(true);

      const res = await axiosPrivate.post("/products/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Create Product Response:", res);

      toast.success("Product added successfully!");
      // Clear session storage after successful submit
      sessionStorage.removeItem("addProductForm");
      sessionStorage.removeItem("addProductImagePreviews");
      sessionStorage.removeItem("addProductPrimaryImageIndex");
    } catch (error: unknown) {
      console.error(error);

      const errorMessage =
        error instanceof Error ? error.message : "Failed to add product";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <h1 className="text-3xl mb-6">Add New Product</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter product description"
                className="min-h-30"
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price")}
                placeholder="Enter price"
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => setValue("category", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                {...register("brand")}
                placeholder="Enter brand name"
              />
              {errors.brand && (
                <p className="text-sm text-red-500">{errors.brand.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                {...register("stock")}
                placeholder="Enter stock quantity"
              />
              {errors.stock && (
                <p className="text-sm text-red-500">{errors.stock.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Product Image(s)</Label>
              <Input
                id="images"
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              {errors.images && (
                <p className="text-sm text-red-500">{errors.images.message}</p>
              )}

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className={`w-26 h-26 object-cover rounded-lg ${
                          index === primaryImageIndex
                            ? "ring-3 ring-yellow-400"
                            : ""
                        }`}
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        {index !== primaryImageIndex && (
                          <Button
                            type="button"
                            size="icon"
                            onClick={() => setPrimaryImage(index)}
                            className="p-1 bg-yellow-500 text-white rounded-full w-6 h-6"
                            title="Set as primary image"
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="icon"
                          onClick={() => removeImage(index)}
                          className="p-1 bg-red-500 text-white rounded-full w-6 h-6"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-main"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Product...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </form>
        </div>

        {/* Image Section */}
        <div className="hidden md:block">
          <div className="h-full rounded-lg overflow-hidden">
            <img
              src={image}
              alt="Electronics"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
