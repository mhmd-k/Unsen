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
import ProductImageUpload from "./ProductImageUpload";
import { categories } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "../ui/card";

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

  images: z
    .array(z.instanceof(File))
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images allowed"),

  primaryIndex: z.number(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  onSubmit: (data: FormData, files: File[], primaryIndex: number) => void;
  loading: boolean;
};

const ProductForm = ({ onSubmit, loading }: Props) => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      images: [],
      primaryIndex: 0,
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data, data.images, data.primaryIndex);
  };

  return (
    <Form {...form}>
      <Card className="mx-auto max-w-4xl">
        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid md:grid-cols-2 gap-x-4 md:gap-x-8"
          >
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
            </div>

            <div className="flex flex-col gap-4">
              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange}>
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

              {/* Image Upload */}
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Product Images</FormLabel>
                    <FormControl>
                      <ProductImageUpload
                        files={field.value || []}
                        setFiles={(files) => {
                          field.onChange(files);
                        }}
                        primaryIndex={form.watch("primaryIndex") || 0}
                        setPrimaryIndex={(index) =>
                          form.setValue("primaryIndex", index)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-full flex justify-end">
              <Button disabled={loading} className="ms-auto">
                {loading ? "Adding..." : "Add Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
};

export default ProductForm;
