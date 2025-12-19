import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Home } from "lucide-react";

export const PaymentSuccess = () => {
    return(
        <div className="flex w-full h-screen flex-col justify-center items-center p-4 gap-4">
            Your order has been placed, you will recieve an email shortly!
            <Button className="flex justify-center items-center"><Link className="flex justify-center items-center gap-2" to={"/"}><Home />Home</Link></Button>
        </div>
    );
}