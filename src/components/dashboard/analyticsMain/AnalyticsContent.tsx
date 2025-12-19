import { ImpressionsChart } from "./ImpressionsChart.tsx";
// import { Component } from "./LineChart.tsx";
import { OrdersChart } from "./OrdersChart.tsx";
import { SalesChart } from "./SalesChart.tsx";

export const AnalyticsContent = () => {
    return (
        <div className="m-4 w-[full] font-[quicksand] grid gap-4 grid-cols-4 grid-rows-4 h-[calc(100%-96px)]">
            <div className="shadow-lg rounded-lg col-span-3 row-span-2">
                <SalesChart />
            </div>
            <div className="shadow-lg rounded-lg col-span-1 row-span-2">
                <ImpressionsChart />
            </div>
            {/* <div className="shadow-lg rounded-lg col-span-1 row-span-2">
                <ImpressionsChart />
            </div> */}
            <div className="rounded-lg col-span-1 row-span-2">
                <OrdersChart />
            </div>
        </div>
    );
};