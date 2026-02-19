import LoadingSpinnerInfinity from "@/components/LoadingSpinnerInfinity";
import { useGetOrderById } from "@/hooks/useGetOrderById";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import OrderProductsTable from "@/components/OrderProductsTable";
import { toast } from "sonner";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const paymentSchema = z.object({
  cardName: z.string().min(1, "Cardholder name is required"),
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiry: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, "Expiry must be in MM/YY format")
    .refine((val) => {
      const [month, year] = val.split("/").map(Number);
      if (month < 1 || month > 12) return false;

      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;

      if (year < currentYear) return false;
      if (year === currentYear && month < currentMonth) return false;

      return true;
    }, "Card expiry must be in the future"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

type PaymentType = z.infer<typeof paymentSchema>;

const Payment = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    },
  });

  const { orderId } = useParams();

  const { data, isLoading, error } = useGetOrderById(Number(orderId));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <LoadingSpinnerInfinity />
      </div>
    );
  }

  if (error) {
    return <Navigate to="/not-found" />;
  }

  if (data?.status !== "WAITING_FOR_PAYMENT") {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (values: PaymentType) => {
    try {
      axiosPrivate.post("/payment", {
        orderId,
        cardNumber: values.cardNumber,
      });

      toast.success("Payment Successful!");

      navigate(`/orders`);
    } catch (err) {
      console.error(err);
      toast.error("An error occured, please try again later!");
    }
  };

  const fillWithRandomData = () => {
    form.reset({
      cardName: "John Doe",
      cardNumber: "7642349753567486",
      expiry: "08/27",
      cvv: "332",
    });
  };

  return (
    <div className="container mx-auto px-4 grid gap-6 grid-cols-1 md:grid-cols-5 my-12">
      <div className="md:col-span-2 p-4 md:p-6 border rounded-lg shadow mx-auto">
        <h2 className="text-2xl font-semibold text-center">Complete Payment</h2>
        <p className="text-center text-sm mb-6">
          Enter any fake data, or
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            onClick={fillWithRandomData}
          >
            Fill with random data
          </Button>
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cardName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cardholder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input placeholder="1234 1234 1234 1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="expiry"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Expiry</FormLabel>
                    <FormControl>
                      <Input placeholder="MM/YY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input placeholder="123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Processing..." : "Pay Now"}
            </Button>
          </form>
        </Form>
      </div>

      <div className="md:col-span-3 p-4 md:p-6 overflow-x-scroll md:overflow-x-hidden">
        <OrderProductsTable
          products={data.products}
          totalPrice={data.totalPrice}
        />
      </div>
    </div>
  );
};

export default Payment;
