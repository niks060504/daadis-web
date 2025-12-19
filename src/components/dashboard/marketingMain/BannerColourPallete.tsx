import { useState } from "react";
import { Button } from "../../ui/button";
import { X } from "lucide-react";

export const BannerColourPallete = ( props: {colourArray: string[], updateArray: Function} ) => {

    const { colourArray, updateArray } = props;
    const [ colours, setColours ] = useState<string[]>(colourArray);

    return (
        <div className="col-start-1 rounded-md row-span-1 grid grid-cols-5 gap-2 col-span-4 bg-yellow-100">
            {colours?.map(colour => <div className="relative col-span-1 h-[45px] rounded-md" style={{backgroundColor: colour}}>
                <Button onClick={() => {
                    setColours(colours!.filter(element => element !== colour));
                    updateArray(colours);
                }} size={"actionIcon"} className="absolute top-[-6px] left-[-6px]" variant={"minus"} ><X className="w-2 h-2" /></Button>
            </div>)}
        </div>
    );
}