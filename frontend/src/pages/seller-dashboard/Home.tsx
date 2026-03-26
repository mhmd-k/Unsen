import LoadingSpinnerInfinity from "@/components/LoadingSpinnerInfinity";
import useGetSellerAnalytics from "@/hooks/useGetSellerAnalytics";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { MdOutlineSell } from "react-icons/md";
import { BsBox2 } from "react-icons/bs";
import { PiShoppingCartDuotone } from "react-icons/pi";
import { formatCurrency } from "@/lib/utils";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import RevenueOverTime from "@/components/charts/RevenueOverTime";
import Top3Products from "@/components/charts/Top3Products";
import OrderStatusBreakdown from "@/components/charts/OrderStatusBreakdown";
import OrdersOverTime from "@/components/charts/OrdersOverTime";

const Home = () => {
  const { data, isLoading, error } = useGetSellerAnalytics();

  if (isLoading) return <LoadingSpinnerInfinity />;

  if (!data || error)
    return <div className="text-red-500">Failed to load analytics data.</div>;

  return (
    <>
      <h1 className="text-lg md:text-2xl mb-4">Dashboard</h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <CardTitle className="text-sm text-gray-500">
              Total Revenue
            </CardTitle>
            <div className="flex gap-4 justify-between items-center mt-2">
              <div className="font-semibold text-2xl">
                {formatCurrency(data.totalRevenue)}
              </div>{" "}
              <RiMoneyDollarCircleLine className="w-8 h-8 text-main" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <CardTitle className="text-sm text-gray-500">Orders</CardTitle>
            <div className="flex gap-4 justify-between items-center mt-2">
              <div className="font-semibold text-2xl">{data.totalOrders}</div>{" "}
              <PiShoppingCartDuotone className="w-8 h-8 text-main" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <CardTitle className="text-sm text-gray-500">Products</CardTitle>
            <div className="flex gap-4 justify-between items-center mt-2">
              <div className="font-semibold text-2xl">{data.totalProducts}</div>{" "}
              <BsBox2 className="w-8 h-8 text-main" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <CardTitle className="text-sm text-gray-500">Items Sold</CardTitle>
            <div className="flex gap-4 justify-between items-center mt-2">
              <div className="font-semibold text-2xl">
                {data.totalItemsSold}
              </div>{" "}
              <MdOutlineSell className="w-8 h-8 text-main" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-5 gap-4 mt-4">
        <div className="lg:col-span-3">
          <RevenueOverTime data={data.revenueOverTime} />
        </div>

        <div className="lg:col-span-2">
          <Top3Products data={data.top3Products} />
        </div>

        <div className="lg:col-span-2">
          <OrderStatusBreakdown data={data.orderStatusBreakdown} />
        </div>

        <div className="lg:col-span-3">
          <OrdersOverTime data={data.ordersOverTime} />
        </div>
      </div>
    </>
  );
};

export default Home;
