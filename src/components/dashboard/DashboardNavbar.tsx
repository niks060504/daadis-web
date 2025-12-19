import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { LoaderCircle, LogOut, Settings } from "lucide-react";
import { useState } from "react";

export const DashboardNavbar = () => {

    const navigate = useNavigate();

    const [ isLogoutButtonLoading, setIsLogoutButtonLoading ] = useState(false);

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
        <div className="w-full px-4 items-center justify-between h-16 flex bg-gray-100">
            <span className="font-bold text-xl">
                Dashboard
            </span>
            <Popover>
                <PopoverTrigger asChild>
                    <Button className="w-10 h-10 rounded-full">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[220px] p-4">
                    <Button variant={"ghost"} className="w-full flex justify-start gap-4">
                        <span>
                            <Settings className="w-[20px]"/>
                        </span>
                        <p className="font-[Quicksand]">Account settings</p>
                    </Button>
                    <Button disabled={isLogoutButtonLoading} onClick={handleLogOut} variant={"ghost"} className="w-full flex justify-start gap-4">
                        <span>
                        {!isLogoutButtonLoading ? <LogOut className="w-[20px]" /> : <LoaderCircle className="animate-spin"/>}
                        </span>
                        <p className="font-[Quicksand]">Log out</p>
                    </Button>
                </PopoverContent>
            </Popover>
        </div>
    );
};