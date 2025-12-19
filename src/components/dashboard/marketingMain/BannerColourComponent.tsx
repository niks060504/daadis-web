import { PaintBucket, Plus } from "lucide-react";
import { Button } from "../../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";
import { BannerColourPallete } from "./BannerColourPallete";

export const BannerColourComponent = ({ bannerColours : colArray } : { bannerColours: string[]}) => {

    const [ bannerColours, setBannerColours ] = useState<string[]>(colArray); 

    const [ value, setValue ] = useState<string>("#ffffff");

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button onClick={() => {
                        
                    }} variant={"ghost"} className="col-start-5 col-span-1 row-span-full flex justify-center items-center gap-2">
                        <PaintBucket className="w-4 h-4"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="flex justify-center p-0 bg-transparent border-none shadow-none gap-2 w-fit">
                    <HexColorPicker color={value} onChange={setValue} />
                    <Button onClick={() => {
                        colArray?.push(value);
                        setBannerColours(colArray);
                        dispatchEvent(new Event("mousedown"));
                    }} variant={"ghost"} className="col-start-5 col-span-1 row-span-full flex bg-yellow-100 hover:bg-yellow-300 text-yellow-300 hover:text-white transition-all justify-center items-center gap-2">
                        <Plus className="w-4 h-4"/>
                    </Button>
                </PopoverContent>
            </Popover>
            <BannerColourPallete colourArray={bannerColours!} updateArray={(newArray: string[]) => {
                colArray = newArray;
                setBannerColours(newArray);
                console.log(bannerColours);
            }} />
        </>
    );
}