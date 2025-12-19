import { AnalyticsOverview } from "./AnalyticsOverview";
// import { CustomerVisitsLineChart } from "./dashboardMain/CustomerVisitsLineChart";
import { DeliveryOverview } from "./DeliveryOverview";
import { RecentOrders } from "./RecentOrders";
import { SalesChart } from "./SalesChart";
import { TopProducts } from "./TopProducts"
export const DashboardFront = () => {
    return (
        <div className="m-4 w-[full] gap-4 h-[calc(100%-96px)] grid grid-rows-8 grid-cols-3">
                <AnalyticsOverview />
                <TopProducts />
                <RecentOrders />
                {/* <CustomerVisitsLineChart /> */}
                <DeliveryOverview />
                <SalesChart />
        </div>
    );
};