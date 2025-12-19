import { DashboardOptions } from "../../utils/constants.js";
import { useState } from "react";
import { cn } from "../../lib/utils.js";
import { CircleGauge, LineChart, LoaderCircle, LogOut, Package2, PersonStanding, Presentation, TicketPercent, Truck } from "lucide-react";
import { Button } from "../ui/button.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { optimizeCloudinaryUrl } from "../../utils/utility-functions.js";


export const SideBar = () => {

    const url = useLocation();

    let option = DashboardOptions.Dashboard;
    
    if (url.pathname.includes("products"))
        option = DashboardOptions.Products
    else if (url.pathname.includes("customers"))
        option = DashboardOptions.Customers
    else if (url.pathname.includes("coupons"))
        option = DashboardOptions.Coupons
    else if (url.pathname.includes("analytics"))
        option = DashboardOptions.Analytics
    else if (url.pathname.includes("delivery"))
        option = DashboardOptions.Delivery
    else if (url.pathname.includes("marketing"))
        option = DashboardOptions.Marketing

    const [ dashboardOption, setDashboardOption ] = useState<String>(option);    

    const [ isLogoutButtonLoading, setIsLogoutButtonLoading ] = useState(false);

    const navigate = useNavigate();

    const handleLogOut = async () => {
        setIsLogoutButtonLoading(true);
        try {
            // @ts-ignore
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
            });

            if (!response.ok) throw new Error("HTTP error! status: "+response.status);

            const data = await response.json();
            
            navigate("/admin/auth");
            
            console.log(data);
        } catch (error) {
            console.error("Error: ", error);
        }
        setIsLogoutButtonLoading(false);
    };

    return (
        <div className="p-4 bg-gray-100 w-[250px] transition-all fixed top-0 bottom-0 left-0">
            <div className="logo object-contain flex justify-center items-center w-full h-[10%]">
                <img src={optimizeCloudinaryUrl("/logo.svg")} className="w-[50px]"/>
            </div>
            <div className="flex flex-col gap-4 justify-evenly w-full h-[70%]">             
                <Link to={"home"}>
                    <button onClick={() => {
                                setDashboardOption(DashboardOptions.Dashboard)
                            }
                        } className={cn("hover:bg-gray-200 pl-4 transition-colors duration-150 items-center h-14 flex w-full rounded-xl", dashboardOption == DashboardOptions.Dashboard && "bg-yellow-300 hover:bg-yellow-300 text-white")}>
                        <CircleGauge />
                        {/* {(dashboardOption === DashboardOptions.Dashboard) ? <RiDashboard3Fill className="text-2xl" /> : <RiDashboard3Line className="text-2xl" />} */}
                        <span className="pl-4">
                            Dashboard
                        </span>
                    </button>
                </Link>
                <Link to={"products"}>
                    <button onClick={() => setDashboardOption(DashboardOptions.Products)} className={cn("hover:bg-gray-200 pl-4 transition-colors duration-150 items-center h-14 flex w-full rounded-xl", dashboardOption == DashboardOptions.Products && "bg-yellow-300 hover:bg-yellow-300 text-white")}>
                        <Package2 />
                        {/* {dashboardOption === DashboardOptions.Dashboard ? <RiDashboard3Fill className="text-2xl" /> : <RiDashboard3Line className="text-2xl" />} */}
                        <span className="pl-4">
                            Products
                        </span>
                    </button>
                </Link>
                <Link to={"customers"}>
                    <button onClick={() => setDashboardOption(DashboardOptions.Customers)} className={cn("hover:bg-gray-200 pl-4 transition-colors duration-150 items-center h-14 flex w-full rounded-xl", dashboardOption == DashboardOptions.Customers && "bg-yellow-300 hover:bg-yellow-300 text-white")}>
                        <PersonStanding />
                        {/* {dashboardOption === DashboardOptions.Dashboard ? <RiDashboard3Fill className="text-2xl" /> : <RiDashboard3Line className="text-2xl" />} */}
                        <span className="pl-4">
                            Customers
                        </span>
                    </button>
                </Link>
                <Link to={"coupons"}>
                    <button onClick={() => setDashboardOption(DashboardOptions.Coupons)} className={cn("hover:bg-gray-200 pl-4 transition-colors duration-150 items-center h-14 flex w-full rounded-xl", dashboardOption == DashboardOptions.Coupons && "bg-yellow-300 hover:bg-yellow-300 text-white")}>
                        <TicketPercent />
                        {/* {dashboardOption === DashboardOptions.Dashboard ? <RiDashboard3Fill className="text-2xl" /> : <RiDashboard3Line className="text-2xl" />} */}
                        <span className="pl-4">
                            Coupons
                        </span>
                    </button>
                </Link>
                <Link to={"analytics"}>
                    <button onClick={() => setDashboardOption(DashboardOptions.Analytics)} className={cn("hover:bg-gray-200 pl-4 transition-colors duration-150 items-center h-14 flex w-full rounded-xl", dashboardOption == DashboardOptions.Analytics && "bg-yellow-300 hover:bg-yellow-300 text-white")}>
                        <LineChart />
                        {/* {dashboardOption === DashboardOptions.Dashboard ? <RiDashboard3Fill className="text-2xl" /> : <RiDashboard3Line className="text-2xl" />} */}
                        <span className="pl-4">
                            Analytics
                        </span>
                    </button>
                </Link>
                <Link to={"delivery"}>
                    <button onClick={() => setDashboardOption(DashboardOptions.Delivery)} className={cn("hover:bg-gray-200 pl-4 transition-colors duration-150 items-center h-14 flex w-full rounded-xl", dashboardOption == DashboardOptions.Delivery && "bg-yellow-300 hover:bg-yellow-300 text-white")}>
                        <Truck />
                        {/* {dashboardOption === DashboardOptions.Dashboard ? <RiDashboard3Fill className="text-2xl" /> : <RiDashboard3Line className="text-2xl" />} */}
                        <span className="pl-4">
                            Delivery
                        </span>
                    </button>
                </Link>
                <Link to={"marketing"}>
                    <button onClick={() => setDashboardOption(DashboardOptions.Marketing)} className={cn("hover:bg-gray-200 pl-4 transition-colors duration-150 items-center h-14 flex w-full rounded-xl", dashboardOption == DashboardOptions.Marketing && "bg-yellow-300 hover:bg-yellow-300 text-white")}>
                        <Presentation />
                        {/* {dashboardOption === DashboardOptions.Dashboard ? <RiDashboard3Fill className="text-2xl" /> : <RiDashboard3Line className="text-2xl" />} */}
                        <span className="pl-4">
                            Marketing
                        </span>
                    </button>
                </Link>
            </div>
            <Button disabled={isLogoutButtonLoading} onClick={handleLogOut} variant={"outline"} className={"pl-4 absolute bottom-4 transition-colors gap-4 duration-150 justify-start h-14 flex w-[calc(100%-32px)] rounded-xl"}>
                <span>
                    {!isLogoutButtonLoading ? <LogOut className="w-[20px]" /> : <LoaderCircle className="w-[20px] animate-spin"/>}
                </span>
                <p className="font-[Quicksand]">Log out</p>
            </Button>
        </div>
    );
};