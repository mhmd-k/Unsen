import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Loader2, Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { categories } from "@/lib/constants";
import image from "../assets/images/add-product-image.jpg";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useAuth } from "@/contexts/AuthContext";
import {
  Form,
  FormLabel,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { cn, formatBytes } from "@/lib/utils";
import { AxiosError } from "axios";

const fileSizeLimit = 5 * 1024 * 1024; // 5MB

const productSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),
  price: z.coerce.number({
    required_error: "Price is required",
    invalid_type_error: "Price must be a number",
  }),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  stock: z.coerce.number().gte(1),
  primaryImageIndex: z.number(),
  images: z.array(z.instanceof(File, { message: "required" })),
});

type ProductFormData = z.infer<typeof productSchema>;

const savedForm = sessionStorage.getItem("addProductForm");

const AddProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number>(0);

  const axiosPrivate = useAxiosPrivate();
  const { user } = useAuth();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: savedForm ? JSON.parse(savedForm) : {},
  });

  const watchedForm = form.watch();

  // Save form data to session storage on change
  useEffect(() => {
    sessionStorage.setItem("addProductForm", JSON.stringify(watchedForm));
  }, [watchedForm]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const newImageFiles = [...imageFiles, ...selectedFiles];

    form.setValue("images", newImageFiles);
    setImageFiles(newImageFiles);

    // Create preview URLs
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    if (newPreviews) setImagePreviews([...imagePreviews, ...newPreviews]);

    // If this is the first image, set it as primary
    if (imageFiles.length === 0) {
      setPrimaryImageIndex(0);
      form.setValue("primaryImageIndex", 0);
    }
  };

  const removeImage = (index: number) => {
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    form.setValue("images", newImageFiles);
    setImageFiles(newImageFiles);

    // Revoke the preview URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);

    // Handle primary image index when removing images
    if (index === primaryImageIndex) {
      // If we're removing the primary image, set the first remaining image as primary
      const newPrimaryIndex = Math.min(index, newImageFiles.length - 1);
      setPrimaryImageIndex(newPrimaryIndex);
      form.setValue("primaryImageIndex", newPrimaryIndex);
    } else if (index < primaryImageIndex) {
      // If we're removing an image before the primary, adjust the primary index
      setPrimaryImageIndex(primaryImageIndex - 1);
      form.setValue("primaryImageIndex", primaryImageIndex - 1);
    }
  };

  const setPrimaryImage = (index: number) => {
    setPrimaryImageIndex(index);
    form.setValue("primaryImageIndex", index);
    toast.success("Primary image updated");
  };

  const onSubmit = async (data: ProductFormData) => {
    if (imageFiles.length === 0) {
      form.setError("images", { message: "Upload at least one image" });
      return;
    }

    if (imageFiles.length > 5) {
      form.setError("images", { message: "Upload at most 5 images" });
      return;
    }

    let excededSizeLimit = false;

    imageFiles.forEach((image) => {
      if (image.size > fileSizeLimit) {
        form.setError("images", {
          message: "Each image should be 5MB at most",
        });
        excededSizeLimit = true;
      }
    });

    if (excededSizeLimit) {
      return;
    }

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

    try {
      setIsLoading(true);

      await axiosPrivate.post("/products/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product added successfully!");
      // Clear form and session storage after successful submit
      sessionStorage.removeItem("addProductForm");
      form.reset({
        name: "",
        description: "",
        price: 0,
        category: "",
        brand: "",
        stock: 0,
        primaryImageIndex: 0,
        images: [],
      });
      setImageFiles([]);
      setImagePreviews([]);
    } catch (error: unknown) {
      console.error(error);

      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data.message
          : "Failed to add product";
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter product description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter price" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter brand name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter stock quantity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={() => (
                  <FormItem>
                    <FormLabel>Picture(s)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Picture(s)"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                      />
                    </FormControl>
                    <FormMessage />

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="my-4 space-y-2">
                        {imagePreviews.map((image, index) => (
                          <div
                            key={index}
                            className="flex justify-between gap-4 border-2 border-gray-200 p-4 rounded-sm"
                          >
                            <div className="flex gap-4">
                              <img
                                src={image}
                                alt={`Preview ${index + 1}`}
                                className={`w-22 h-22 object-cover rounded-sm ${
                                  index === primaryImageIndex
                                    ? "ring-4 ring-main"
                                    : ""
                                }`}
                              />
                              <div>
                                <h4
                                  className={cn(
                                    "mb-2",
                                    index === primaryImageIndex &&
                                      "text-main font-medium"
                                  )}
                                >
                                  {imageFiles[index].name}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  size: {formatBytes(imageFiles[index].size)}
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-1">
                              {index !== primaryImageIndex && (
                                <Button
                                  type="button"
                                  size="icon"
                                  onClick={() => setPrimaryImage(index)}
                                  className="p-1 bg-yellow-500 text-white"
                                  title="Set as primary image"
                                >
                                  <Star className="size-5" />
                                </Button>
                              )}
                              <Button
                                type="button"
                                size="icon"
                                onClick={() => removeImage(index)}
                                className="p-1 bg-red-500 text-white"
                              >
                                <Trash2 className="size-5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </FormItem>
                )}
              />

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
          </Form>
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
