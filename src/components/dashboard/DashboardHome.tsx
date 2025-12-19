import { Outlet, useNavigate } from "react-router-dom";
import { DashboardNavbar } from "./DashboardNavbar";
import { SideBar } from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setUser } from "../../redux/slices/userSlice";
import { toast } from "sonner";
import { ToastFaliure } from "./productMain/AllProductsTable";

export const DashboardHome = () => {

    const userData = useSelector((state: any) => state.users.userData);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // useEffect(() => {
    //     (async function verify() {
    //         try {
    //             // @ts-ignore
    //             const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/current-user`, {
    //                 method: "GET",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 credentials: "include"
    //             });
    //             console.log(response);
    
    //             if (!response.ok) throw new Error("HTTP error! status: "+response.status+", "+response.statusText);
                
    //             const data = await response.json();
    
    //             if (data.data.role !== "Admin") throw new Error(`Error: ${401}, Unauthorised user`);
                

    //             dispatch(setUser(data.data));
    //         } catch (error) {
    //             console.error("Error: ", error);
    //             toast.error("Error while loggin in!", { description: "Please try again!", className: "bg-red-300 font-[quicksand]", icon: <ToastFaliure /> }, );
    //             // console.log(userData);
    //             if (userData === null) {
    //                 console.log(userData === null);
    //                 navigate('/admin/auth');
    //             }
    //         }
    //     })();
    // }, []);
    // }, [userData, navigate]);

    return (
        <div className="selection:bg-yellow-200 ml-[250px] h-[100vh] w-[calc(100%-250px)]">
            <SideBar />
            <DashboardNavbar />
            <Outlet />
        </div>
    );
};