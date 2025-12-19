import { useState } from "react";
import { Input } from "../../ui/input"
import { cn } from "../../../lib/utils";

export const ColourInput = ({ placeholder, className, field} : { placeholder: string, className: string, field: any }) => {

    const [ colour, setColour ] = useState<string | undefined>("");

    return (
        <>
            <div style={{
                backgroundColor: colour == '' ? placeholder : "#"+colour
            }} className={cn(`h-[70%] left-[4%] rounded-md top-1/2 -translate-y-[50%] border absolute w-[20%]`, `bg-[#${colour} text-[#${colour}]]`)} ></div>
            <Input value={colour} {...field} placeholder={ placeholder } className={`focus-visible:ring-yellow-500 ${className} pl-[27%]`} onChange={(e) => {
                // console.log(`e.target.value: ${e.target.value} colour: ${colour}`);
                setColour(e.target.value);
                field.onChange(e.target.value);
            }} />
        </>
    );
};