import PackageIcon from "../../../iconcomponents/package-stroke-rounded";
import SaleTag02Icon from "../../../iconcomponents/sale-tag-02-stroke-rounded";
import UserIcon from "../../../iconcomponents/user-stroke-rounded";
import { SAMPLE_ORDERS_INCREASE, SAMPLE_SALES_INCREASE, SAMPLE_TOTAL_ORDERS, SAMPLE_TOTAL_SALES, SAMPLE_TOTAL_USERS, SAMPLE_USERS_INCREASE } from "../../../utils/constants";

export const AnalyticsOverview = () => {
    return (
        <div className="row-span-3 col-span-2 rounded-lg shadow-lg font-[Quicksand] bg-gray-100 p-4">
            <p className="font-bold text-xl mb-2">
                Overview
            </p>
            {/* Figure out the reason for it being in the active state on click */}
            <div className="flex gap-4 w-full h-[calc(100%-37px)] justify-between">
                <button className="bg-red-200 flex-1 hover:scale-[110%] focus:outline-dashed focus:scale-[110%] transition-all duration-150 rounded-lg p-4 h-full flex flex-col justify-evenly">
                    <div className="bg-red-500 flex justify-center items-center rounded-full w-[50px] h-[50px]">
                        <SaleTag02Icon />
                    </div>
                    <p className="text-lg font-bold">
                        ₹{SAMPLE_TOTAL_SALES}
                    </p>
                    <p className="text-sm font-semibold">
                        Total sales
                    </p>
                    <p className="text-blue-500 font-semibold text-wrap text-xs">
                        {SAMPLE_SALES_INCREASE} ⬆ since yesterday
                    </p>
                </button>
                <button className="bg-yellow-200 flex-1 hover:scale-[110%] focus:outline-dashed focus:scale-[110%] transition-all duration-150 rounded-lg p-4 flex flex-col justify-evenly">
                    <div className="bg-yellow-500 flex justify-center items-center rounded-full w-[50px] h-[50px]">
                        <PackageIcon />
                    </div>
                    <p className="text-lg font-bold">
                        {SAMPLE_TOTAL_ORDERS}
                    </p>
                    <p className="text-sm font-semibold">
                        Total orders
                    </p>
                    <p className="text-blue-500 font-semibold  text-xs">
                        {SAMPLE_ORDERS_INCREASE} ⬆ from yesterday
                    </p>
                </button>
                <button className="bg-green-200 rounded-lg flex-1 hover:scale-[110%] focus:outline-dashed focus:scale-[110%] transition-all p-4 flex flex-col justify-evenly">
                    <div className="bg-green-500 flex justify-center items-center rounded-full w-[50px] h-[50px]">
                        <SaleTag02Icon />
                    </div>
                    <p className="text-lg font-bold">
                        ₹{SAMPLE_TOTAL_SALES}
                    </p>
                    <p className="text-sm font-semibold">
                        Total sales
                    </p>
                    <p className="text-blue-500 font-semibold  text-xs">
                        {SAMPLE_SALES_INCREASE} ⬆ from yesterday
                    </p>
                </button>
                <button className="bg-purple-200 hover:scale-[110%] focus:scale-[110%] focus:outline-dashed flex-1 transition-all rounded-lg p-4 flex flex-col justify-evenly">
                    <div className="bg-purple-500 flex justify-center items-center rounded-full w-[50px] h-[50px]">
                        <UserIcon />
                    </div>
                    <p className="text-lg font-bold">
                        {SAMPLE_TOTAL_USERS}
                    </p>
                    <p className="text-sm font-semibold">
                        Total customers
                    </p>
                    <p className="text-blue-500 font-semibold text-xs">
                        {SAMPLE_USERS_INCREASE} ⬆ from yesterday
                    </p>
                </button>
            </div>
        </div>
    );
};