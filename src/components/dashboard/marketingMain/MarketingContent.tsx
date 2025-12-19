import { Frame, Mailbox, Smartphone } from "lucide-react";
import { Button } from "../../ui/button";
import { Link } from "react-router-dom";
import { AllBannersTable } from "./AllBannersTable";
import { AllBlogsTable } from "./AllBlogsTable";

export const MarketingContent = () => {

    return (
        <div className="font-[quicksand]  p-0 scrollbar-thin scrollbar-thumb-yellow-300 justify-center items-center scrollbar-thumb-rounded-full scrollbar-track-transparent m-4 relative w-[full] overflow-y-scroll gap-4 h-[calc(100%-96px)] grid grid-rows-8 grid-cols-2">
            {/* <EmailPage /> */}
            {/* <Link className="col-span-1 h-full row-span-4" to={"lucky-points"}>
                <Button variant={"ghost"} className="bg-yellow-100 px-2 hover:bg-yellow-300 text-yellow-300 hover:text-white flex justify-center text-xl items-center gap-4 w-full h-full col-span-1 row-span-4">Lucky points<Crown className="w-8 h-8" /></Button>
            </Link> */}
            <div className="flex justify-center bg-gray-100 items-center flex-col gap-8 col-span-1 col-start-2 h-full w-full  row-span-4 rounded-lg" style={{
                // backgroundImage: "url("+"https://png.pngtree.com/thumb_back/fh260/background/20210915/pngtree-noise-abstract-texture-dark-gray-noise-background-image_879896.jpg"+")"
            }}>
                <div className="flex justify-center items-center gap-4 text-yellow-500">
                    <b>Blogs</b><Smartphone className="w-8 h-8" />
                </div>
                <AllBlogsTable />
            </div>
            {/* <Link className="col-span-1 h-full row-span-4" to={"banners"}> */}
            <div className="rounded-lg bg-gray-100 w-full h-full gap-8 flex-col flex col-start-1 row-start-1 justify-center items-center col-span-1 row-span-8">
                <div className="flex justify-center items-center gap-4 text-yellow-500">
                    <b>Banners</b><Frame className="w-8 h-8" />
                </div>
                <AllBannersTable />
            </div>
                {/* <Button variant={"ghost"} className="bg-yellow-100 px-2 hover:bg-yellow-300 text-yellow-300 hover:text-white flex justify-center text-xl items-center gap-4 w-full h-full col-span-1 row-span-4">Banners<Frame className="w-8 h-8" /></Button> */}
            {/* </Link> */}
            <Link className="col-span-1 h-full row-span-4" to={"emails"}>
                <Button variant={"ghost"} className="bg-yellow-100 px-2 hover:bg-yellow-300 text-yellow-300 hover:text-white flex justify-center text-xl items-center gap-4 w-full h-full">Emails <Mailbox className=" w-8 h-8" /></Button>
            </Link>
        </div>
    );
};