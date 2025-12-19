import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { Button } from "../../ui/button";
// import { ChevronLeftCircle } from "lucide-react";

export const CustomDatePicker = ({ field } : { field: any }) => {
  const [selected, setSelected] = useState<Date>(new Date());
  const [ isPickerOpen, setIsPickerOpen ] = useState<boolean>(false);

  return (
    <Button variant={"ghost"} onClick={(e) => {
      e.preventDefault();
      setIsPickerOpen(!isPickerOpen)
    }} className="relative">
      {isPickerOpen ? `Close` : `Open`} picker
      {isPickerOpen && <DayPicker
        captionLayout="dropdown-months"
        {...field}
        className="absolute bottom-[130%] rounded-md shadow-md bg-gray-100 p-4"
        mode="single"
        selected={selected}
        onSelect={(value) => {
          setSelected(value!);
          console.log(value);
          field.onChange(value);
        }}
        footer={
          selected ? `Selected: ${selected.toLocaleDateString()}` : "Pick a day."
        }
      />}
    </Button>
  );
}