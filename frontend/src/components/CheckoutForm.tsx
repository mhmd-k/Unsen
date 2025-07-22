import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useCartConext } from "@/contexts/CartContext";
import { type PlaceOrderResponse } from "@/types/order";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const checkoutSchema = z.object({
  contact: z.string().min(3, "Required (email or phone number)"),
  address: z.string().min(3, "Address is required"),
  apartment: z.string().min(3, "Apartment is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().optional(),
  zipCode: z.string().min(5, "Zip code must be 5 digits"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const CheckoutForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });
  const { user } = useAuth();
  const { cart } = useCartConext();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const onSubmit = async (formData: CheckoutFormData) => {
    setIsLoading(true);

    try {
      const res = await axiosPrivate.post<PlaceOrderResponse>("/orders/place", {
        userId: user?.id,
        items: cart.map((e) => ({ productId: e.id, quantity: e.quantity })),
        ...formData,
      });

      toast.success("Order submitted successfully");
      navigate("/pay", {
        replace: true,
        state: {
          invoice: res.data.invoice,
        },
      });
    } catch (error) {
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
    <Card className="flex-1 my-auto">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Email or phone number"
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Email or phone number"
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apartment"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Apartment, suite, etc."
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="City" className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="State (optional)"
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="ZIP Code"
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-main"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" /> Submitting...
                </>
              ) : (
                "Submit order"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;
