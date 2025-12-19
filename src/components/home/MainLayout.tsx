import { Outlet } from "react-router-dom";
import { HomePageNavBar } from "./HomePageNavBar";
import { Footer } from "./Footer";

export const MainLayout = () => {
    return (
        <div style={{
            fontFamily: "Okra"
        }}>
            <HomePageNavBar />
            <Outlet />
            <Footer />
        </div>
    );
};