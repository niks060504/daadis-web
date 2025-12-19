"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { Button } from "../../ui/button"
import { cn } from "../../../lib/utils"
import { Calendar } from "../../ui/calendar"


export const DatePicker = ({ field, className, defaultValue } : { field : any, className: string, defaultValue?: Date }) => {
  const currentDate = new Date;
  const [ date, setDate ] = React.useState<Date>(defaultValue ? defaultValue : currentDate);
  const [ isPopoverOpen, setPopoverOpen ] = React.useState(false);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal gap-4 focus-visible:ring-yellow-500",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="stroke-yellow-500"/>
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar className={className+" focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"}
          mode="single"
          selected={date}
          onSelect={(date) => {
            setDate(date!);
            field.onChange(date);
            console.log(date);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
