import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { categories } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "../ui/card";
import type { Product } from "@/types";
import { toast } from "sonner";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  price: z.coerce.number({
    invalid_type_error: "Please enter a valid number!",
  }),
  category: z.string(),
  brand: z.string(),
  stock: z.coerce
    .number({
      invalid_type_error: "Please enter a valid number!",
    })
    .gte(1),
  discount: z.coerce
    .number({
      invalid_type_error: "Please enter a valid number!",
    })
    .gte(0)
    .lte(100),
});

type FormData = z.infer<typeof schema>;

type Props = {
  initialData: Product;
};

const EditProductForm = ({ initialData }: Props) => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: FormData) => {
    try {
      await axiosPrivate.patch(`/products/${initialData.id}`, data);

      queryClient.invalidateQueries({
        queryKey: ["product-by-id", initialData.id.toString()],
      });

      toast.success("Product updated successfully");
    } catch (error) {
      toast.error("Failed to update product");
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <Card>
        <CardContent>
          <h2 className="text-xl mb-4">Product Info</h2>

          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-4">
              {/* Text Fields */}
              {[
                "name",
                "description",
                "price",
                "brand",
                "stock",
                "discount",
              ].map((fieldName) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={
                    fieldName as keyof Omit<FormData, "images" | "primaryIndex">
                  }
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">
                        {fieldName} {fieldName === "discount" && "%"}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

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
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              className="ms-auto mt-4 w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Updating..." : "Update Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
};

export default EditProductForm;
