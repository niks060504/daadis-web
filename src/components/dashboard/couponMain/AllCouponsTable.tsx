import { ICoupon, MONTHS, WEEKDAYS } from "../../../utils/constants.ts";
import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Infinity, Loader2, MoreHorizontal, PencilIcon, Plus, SaveIcon, TicketPlus, Trash2 } from "lucide-react"
import { Button } from "../../ui/button.tsx"
import { Checkbox } from "../../ui/checkbox.tsx"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu.tsx"
import { Input } from "../../ui/input.tsx"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table.tsx"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog.tsx";
import { Label } from "../../ui/label.tsx";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../ui/select.tsx";
import { DatePicker } from "./DatePicker.tsx";
import { z } from "zod";
import { Form } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, FormItem, FormMessage } from "../../ui/form.tsx";
import { FormControl } from "@mui/material";
import { cn } from "../../../lib/utils.ts";
import { toast } from "sonner";
import { ToastFaliure, ToastSuccess } from "../productMain/AllProductsTable.tsx";
// import { CustomDatePicker } from "./CustomDatePicker.tsx";

/* Todo: finish coupon delete and edit, add delete multiple button */

const getCouponData = async () => {
  try {
    // @ts-ignore
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}coupons/get-all-coupons`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
    });

    const data = await response.json();
    if ( !response.ok ){
      throw new Error("error" + response);
    }
    console.log(data.data);
    return data.data;
  } catch (error: any) {
    console.log(error);
    toast.error("Error while fetching coupon list, refresh!", { description: error, className: "bg-red-300 font-[quicksand]", icon: <ToastFaliure /> }, );
    return error;
  }
}; 

export const couponFormSchema = z.object({
  couponName: z.string().min(1, { message: "Coupon name should be at least 1 character long!" }).max(30, { message: "Coupon name cannot be more than 30 characters!"}),
  couponCode: z.string().min(1, { message: "Coupon name should be at least 1 character long!" }).max(30, { message: "Coupon code cannot be more than 30 characters!"}).transform(val => val.toUpperCase()),
  type: z.string(),
  discount: z.object({
    amount: z.coerce.number().positive("This field cannot be negative or zero!"),
    upperLimit: z.coerce.number().refine((upperLimit) => upperLimit >= 0, { message : "This field cannot be negative!" }),
  }),
  customerLogin: z.boolean(),
  // products: z.array(),
  // categories: z.array(),
  dateStart: z.date(),
  dateEnd: z.date().optional(),
  // usedBy: z.array(),
  usesPerCustomer: z.coerce.number(),
  totalUses: z.coerce.number(),
  status: z.boolean(),
});

// z.setErrorMap((issue, _ctx) => {
//   switch (issue.code) {
//     case z.ZodIssueCode.invalid_type:
//       return { message: `Expected type ${issue.expected}, but got ${issue.received}` };
//     case z.ZodIssueCode.too_small:
//       return { message: `Value is too small. Minimum allowed is ${issue.minimum}` };
//     case z.ZodIssueCode.too_big:
//       return { message: `Value is too large. Maximum allowed is ${issue.maximum}` };
//     default:
//       return { message: "Invalid input." };
//   }
// });

export const columns: ColumnDef<ICoupon>[] = [
  {
    accessorKey: "couponName",
    id: "couponName",
    header: ({ table }) => {
        return (
            <div className="flex items-center gap-2">
                <Checkbox
                    className="border-yellow-300 data-[state=checked]:bg-yellow-300"
                    checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
                Coupon Name
            </div>
        );
    },
    cell: ({ row }) => {
        
        // console.log(row.getValue("couponName"));
        // console.log(row);
        
        
        return <div className="flex items-center gap-2">
            <Checkbox
                className="border-yellow-300 data-[state=checked]:bg-yellow-300"
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
            {row.getValue("couponName")}
        </div>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "couponCode",
    header: "Coupon code",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("couponCode")}</div>
    ),
  },
  {
    accessorKey: "discount",
    header: ({ column }) => {
      return (
        <Button
          className=""
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Discount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
          
        console.log(row.original.discount);

        return (
                <div className="lowercase">
                    {row.original.discount.amount!}
                    {row.original.type == "percentage" ? "%" : "₹"}
                </div>
            );
        },
    },
    {
      accessorKey: "customerLogin",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Customer login
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("customerLogin") ? "required" : "not required"}</div>,
    },
    {
      accessorKey: "dateStart",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date start
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const dateStart = row.original.dateStart;
        const frontEndDate = new Date(dateStart);
        console.log(dateStart);
        let date;
        if (dateStart) date = { month: frontEndDate.getMonth(), day: frontEndDate.getDate(), year: frontEndDate.getFullYear() }; 
        return <div className="" onClick={() => {
          console.log(row?.original?.dateStart?.getMonth());
        }}>{`${WEEKDAYS[frontEndDate.getUTCDay() - 1]}, ${date?.day} ${MONTHS[date?.month!].substring(0,3)} ${date?.year!}`}</div>
      },
    },
  {
    accessorKey: "dateEnd",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date end
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dateEnd = row.original.dateEnd;
      const frontEndDate = new Date(dateEnd);
      const { day, month, year } = { month: frontEndDate?.getMonth(), day: frontEndDate?.getDate(), year: frontEndDate?.getFullYear() }; 
      return <div className="" onClick={() => {
        console.log(row?.original?.dateEnd?.getMonth());
      }}>{ dateEnd ? `${WEEKDAYS[frontEndDate.getUTCDay() - 1]}, ${day} ${MONTHS[month].substring(0,3)} ${year}` : <Infinity />}</div>
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        return <div className="lowercase">{row.getValue("status") ? "enabled" : "disabled"}</div>
    }
  },
//   {
//     accessorKey: "price",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Price in ₹
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       )
//     },
//     cell: ({ row }) => <div className="lowercase">{"₹"+row.getValue("price")}</div>,
//   },
//   {
//     accessorKey: "weight",
//     header: () => <div className="text-right">Weight</div>,
//     cell: ({ row }) => {
//         return <div className="text-right font-medium">
//             {row.getValue("weight")}
//         </div>
//     },
//   },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const coupon: ICoupon = row.original

      const [ isEditButtonLoading, setIsEditButtonLoading ] = React.useState(false);
      const [ isDialogOpen, setIsDialogOpen ] = React.useState(false);
      const [ discountType, setDiscountType ] = React.useState<"fixed" | "percentage">(coupon?.type);

      const handleCouponEdit = async (values: z.infer<typeof couponFormSchema>) => {
        setIsEditButtonLoading(true);
        console.log(values);
        if ( values?.dateStart < new Date() ) {
          return couponEditForm.setError("dateStart", { type: "manual", message: "Start date cannot be in the past!" }); 
        }
        if ( values?.dateEnd ) {
          if ( values?.dateEnd < new Date() ) {
            return couponEditForm.setError("dateEnd", { type: "manual", message: "End date cannot be in the past!" }); 
          }
          if ( values?.dateStart > values?.dateEnd ) {
            couponEditForm.setError("dateStart", { type: "manual", message: "Start date cannot be after end date"});
            return couponEditForm.setError("dateEnd", { type: "manual", message: "End date cannot be before start date"});
          }
        }
        try {
          // @ts-ignore
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}coupons/update-a-coupon/${coupon._id}`, {
              method: "PATCH",
              headers: {
                  "Content-Type": "application/json",
              },
              credentials: 'include',
              body: JSON.stringify({ updatedCouponFromReq : {...values}})
          });
    
          const data = await response.json();
    
          if ( !response.ok ){
            if ( data.type )
              couponEditForm.setError(data.type, { type: "manual", message: data?.errorMessage });
            console.log(data);
            throw new Error("error" + response);
          }
          // setProductData(await getProducts());
          setIsDialogOpen(false);
          toast.success("Coupon updated successfully!", { description: `${data?.data?.couponName} : ${data?.data?.couponCode}` || "", className: "font-[quicksand]", icon: <ToastSuccess /> });
          window.location.reload();
        } catch (error: any) {
          console.log(error);
          // if ( error?.kind === "ObjectId") productForm.setError(error.type, {type: "manual", message: error.errorMessage});
          // if ( error?.type ) productForm.setError(error.type, { type: "manual", message: error.errorMessage });
          toast.error("Failed to update Coupon!", { description: error.errorMessage || "", className: "font-[quicksand]", icon: <ToastFaliure /> });
        } finally {
          setIsEditButtonLoading(false);
        }
      };

      const [ isTrashButtonLoading, setIsTrashButtonLoading ] = React.useState<boolean>(false);

      const handleCouponDelete = async () => {
        setIsTrashButtonLoading(true);
        try {
          // @ts-ignore
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}coupons/delete-a-coupon/${coupon._id!}`, {
              method: "DELETE",
              headers: {
                  "Content-Type": "application/json",
              },
              credentials: 'include',
          });
      
          const data = await response.json();
      
          if ( !response.ok ){
            if ( data.type )
            console.log(data);
            throw new Error("error" + response);
          }
      
          toast.success("Coupon deleted successfully!", { description: coupon.couponName!, className: "font-[quicksand]", icon: <ToastSuccess /> });
          
          console.log(data.data);
          
          window.location.reload();
        } catch (error: any) {
          console.log(error);
          toast.error("Product deletion failed!", { description: coupon.couponName!, className: "font-[quicksand]", icon: <ToastFaliure /> })
        } finally {
          setIsTrashButtonLoading(false);
        }
      };

      const couponEditForm = useForm<z.infer<typeof couponFormSchema>>({
        resolver: zodResolver(couponFormSchema),
        defaultValues: {
          couponName: coupon?.couponName,
          couponCode: coupon?.couponCode,
          type: coupon?.type,
          discount: coupon?.discount,
          customerLogin: coupon?.customerLogin,
          dateStart: new Date(coupon?.dateStart),
          dateEnd: coupon.dateEnd ? new Date(coupon?.dateEnd) : undefined,
          usesPerCustomer: coupon?.usesPerCustomer,
          totalUses: coupon?.totalUses,
          status: coupon?.status,
        },
      });


      // console.log(coupon);
      // const [ isOpen, setIsOpen ] = React.useState(false);
      return (
        <div className="flex justify-end font-[Quicksand]">
            <DropdownMenu >
                <DropdownMenuTrigger asChild>
                    <Button onClick={(e) => {e.stopPropagation()}} variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[10px]" align="center">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
                      <DialogTrigger asChild>
                        <Button className="hover:text-yellow-500 w-full grid-cols-3 gap-2 items-center justify-start h-12" variant={"ghost"}>
                          <PencilIcon className="w-4 h-4 col-start-1 col-span-1" />
                          <span className="col-start-2 col-span-2">Edit</span>
                        </Button>
                        {/* <Button variant={"ghost"} className="bg-yellow-300 hover:bg-yellow-500 text-white hover:text-white" type="submit">Save changes</Button> */}
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                          <DialogTitle>Enter product details</DialogTitle>
                          <DialogDescription>
                            Enter product details to create a product . Click create when you're done.
                          </DialogDescription>
                          </DialogHeader>
                          <FormProvider {...couponEditForm} >
                            <Form {...couponEditForm} onSubmit={couponEditForm.handleSubmit(handleCouponEdit)} >
                              <form className="grid pb-10 gap-4 py-4" onSubmit={couponEditForm.handleSubmit(handleCouponEdit)}>
                              {/* <form onSubmit={(e) => {
                                e.preventDefault();
                                console.log(productForm.formState.errors)
                              }} className="grid pb-10 gap-4 py-4"> */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="name" className="col-span-1">
                                    Coupon name
                                  </Label>
                                  <FormField
                                    control={couponEditForm.control}
                                    name="couponName"
                                    render={({ field }) => (
                                      <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                                        <FormControl className="col-span-3 w-full">
                                          <Input {...field} placeholder="" className="col-span-3 w-full focus-visible:ring-yellow-500" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="name" className="col-span-1">
                                    Coupon code
                                  </Label>
                                  <FormField
                                    control={couponEditForm.control}
                                    name="couponCode"
                                    render={({ field }) => (
                                      <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                                        <FormControl className="col-span-3 w-full">
                                          <Input {...field} placeholder="" className="col-span-3 w-full uppercase focus-visible:ring-yellow-500" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="name" className="col-span-1">
                                    Discount
                                  </Label>
                                  <FormField
                                    control={couponEditForm.control}
                                    name="type"
                                    render={({ field }) => (
                                      <FormItem className={cn("focus-visible:ring-yellow-500", discountType == "percentage" ? "col-span-1" : "col-span-2")}>
                                        <FormControl className={cn("w-full", discountType == "percentage" ? "col-span-1" : "col-span-2")}>
                                        <Select onValueChange={(value : "fixed" | "percentage") => {
                                          setDiscountType(value);
                                          field.onChange(value);
                                          if ( discountType == "percentage" ) 
                                            couponEditForm.resetField("discount.upperLimit"); 
                                          else
                                            couponEditForm.setValue("discount.upperLimit", 0);
                                        }} {...field} defaultValue={discountType}  >
                                          <SelectTrigger className={cn("focus:ring-yellow-500 focus-visible:ring-yellow-500", discountType == "percentage" ? "col-span-1" : "col-span-2")}>
                                            <SelectValue placeholder="Select discount type" />
                                          </SelectTrigger>
                                          <SelectContent className="focus:ring-yellow-500 focus-visible:ring-yellow-500 active-visible:ring-yellow-500 ">
                                            <SelectGroup {...field}>
                                              <SelectLabel>Types</SelectLabel>
                                              <SelectItem value={`fixed`}>{`Fixed amount(₹)`}</SelectItem>
                                              <SelectItem value={`percentage`}>{`Percentage(%)`}</SelectItem>
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={couponEditForm.control}
                                    name="discount.amount"
                                    render={({ field }) => (
                                      <FormItem className={cn("focus-visible:ring-yellow-500", discountType == "percentage" ? "col-span-1" : "col-span-[1.5]")}>
                                        <FormControl className={cn("w-full", discountType == "percentage" ? "col-span-1" : "col-span-[1.5]")}>
                                          <Input {...field} type="number" placeholder="Amount" className={cn("w-full focus-visible:ring-yellow-500", discountType == "percentage" ? "col-span-1" : "col-span-[1.5]")} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  {discountType == "percentage" && <FormField
                                    control={couponEditForm.control}
                                    name="discount.upperLimit"
                                    render={({ field }) => (
                                      <FormItem className="col-span-1 focus-visible:ring-yellow-500">
                                        <FormControl className="col-span-1 w-full">
                                          <Input {...field} type="number" placeholder="Upper limit" className="col-span-1 w-full focus-visible:ring-yellow-500" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />}
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="name" className="col-span-1">
                                    Uses per customer
                                  </Label>
                                  <FormField
                                    control={couponEditForm.control}
                                    name="usesPerCustomer"
                                    render={({ field }) => (
                                      <FormItem className="col-span-1 focus-visible:ring-yellow-500">
                                        <FormControl className="col-span-1 w-full">
                                          <Input {...field} placeholder="" className="col-span-1 w-full focus-visible:ring-yellow-500" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <Label htmlFor="name" className="col-span-1">
                                    Total uses
                                  </Label>
                                  <FormField
                                    control={couponEditForm.control}
                                    name="totalUses"
                                    render={({ field }) => (
                                      <FormItem className="col-span-1 focus-visible:ring-yellow-500">
                                        <FormControl className="col-span-1 w-full">
                                          <Input {...field} placeholder="" className="col-span-1 w-full focus-visible:ring-yellow-500" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="name" className="col-span-1">
                                    Date Start
                                  </Label>
                                  <FormField
                                    control={couponEditForm.control}
                                    name="dateStart"
                                    render={({ field }) => (
                                      <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                                        <FormControl className="col-span-1 w-full">
                                          {/* <Input {...field} placeholder="" className="col-span-1 w-full focus-visible:ring-yellow-500" /> */}
                                          <DatePicker defaultValue={coupon?.dateStart} className={""} field={field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <Label htmlFor="name" className="col-span-1">
                                    Date End
                                  </Label>
                                  <FormField
                                    control={couponEditForm.control}
                                    name="dateEnd"
                                    render={({ field }) => (
                                      <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                                        <FormControl className="col-span-3 w-full">
                                          {/* <Input {...field} placeholder="" className="col-span-1 w-full focus-visible:ring-yellow-500" /> */}
                                          {/* <CustomDatePicker field={field}/> */}
                                          <DatePicker defaultValue={coupon?.dateEnd} className="" field={field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <div className="flex justify-start items-center gap-2 w-full col-span-2">
                                      <Label htmlFor="customer-login">Customer login</Label>
                                      <FormField
                                        control={couponEditForm.control}
                                        name="customerLogin"
                                        render={({ field }) => (
                                          <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                                            <FormControl className="col-span-3 w-full">
                                              {/* <Input {...field} placeholder="" className="col-span-1 w-full focus-visible:ring-yellow-500" /> */}
                                              {/* <CustomDatePicker field={field}/> */}
                                              <Checkbox className="border-yellow-300 focus-visible:ring-yellow-500 data-[state=checked]:bg-yellow-300" checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  <div className="flex justify-end items-center gap-2 w-full col-span-2">
                                      <Label htmlFor="status">Status</Label>
                                      <FormField
                                        control={couponEditForm.control}
                                        name="status"
                                        render={({ field }) => (
                                          <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                                            <FormControl className="col-span-3 w-full">
                                              {/* <Input {...field} placeholder="" className="col-span-1 w-full focus-visible:ring-yellow-500" /> */}
                                              {/* <CustomDatePicker field={field}/> */}
                                              <Checkbox className="border-yellow-300 focus-visible:ring-yellow-500 selection:border-yellow-600 data-[state=checked]:bg-yellow-300" checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                  </div>
                                </div>
                              </form>
                              <Button disabled={isEditButtonLoading} variant={"ghost"} className="absolute bottom-5 right-5 flex justify-center items-center gap-2 bg-yellow-300 hover:bg-yellow-500 text-white hover:text-white" type="submit">{isEditButtonLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <>Save changes <SaveIcon className="w-4 h-4"/></>}</Button>
                            </Form>
                          </FormProvider>
                          <DialogFooter>
                          </DialogFooter>
                      </DialogContent>
                  </Dialog>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-0"><Button onClick={handleCouponDelete} className="hover:text-red-500 w-full flex justify-start items-center gap-2" variant={"ghost"}>{isTrashButtonLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete</Button></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      )
    },
  },
];
 
export function DataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
 
  const [ couponData, setCouponData ] = React.useState<Array<ICoupon>>([]);

  React.useEffect(() => {
    (async function () {
      setCouponData(await getCouponData());
    })();
  }, []);

  const table = useReactTable({
    data: couponData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
 
  const [ isCreateButtonLoading, setIsCreateButtonLoading ] = React.useState(false);
  const [ isDialogOpen, setIsDialogOpen ] = React.useState(false);

  const couponCreateForm = useForm<z.infer<typeof couponFormSchema>>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      customerLogin: true,
      status: true,
      type: "fixed",
      discount: {
        upperLimit: 0
      }
    },
  });

  const handleCouponCreate = async (values: z.infer<typeof couponFormSchema>) => {
    console.log(values);
    try {
      setIsCreateButtonLoading(true);
      if ( values?.dateStart < new Date() ) {
        return couponCreateForm.setError("dateStart", { type: "manual", message: "Start date cannot be in the past!" }); 
      }
      if ( values?.dateEnd ) {
        if ( values?.dateEnd < new Date() ) {
          return couponCreateForm.setError("dateEnd", { type: "manual", message: "End date cannot be in the past!" }); 
        }
        if ( values?.dateStart > values?.dateEnd ) {
          couponCreateForm.setError("dateStart", { type: "manual", message: "Start date cannot be after end date"});
          return couponCreateForm.setError("dateEnd", { type: "manual", message: "End date cannot be before start date"});
        }
      }
      couponCreateForm.clearErrors();
      // @ts-ignore
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}coupons/create-a-coupon`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        method: "POST",
        body: JSON.stringify({ couponData: values }),
      });
      
      const data = await response.json();

      console.log(data);
      
      if ( !response.ok )
        throw new Error("Error : "+ response);
      
      console.log(data.data);

      setCouponData(await getCouponData());

      toast.success(`Coupon created successfully!`, { description: `${data.data.couponName} : ${data.data.couponCode}` || "", className: "bg-red-300 font-[quicksand]", icon: <ToastSuccess /> }, );
      couponCreateForm.reset();
      setIsDialogOpen(false);
    } catch (error: any) {
      console.log(error);
      toast.error("Error while creating coupon!", { description: error?.error || "", className: "bg-red-300 font-[quicksand]", icon: <ToastFaliure /> }, );
    } finally {
      // console.log(values);
      setIsCreateButtonLoading(false);
    }
  };

  const [ isMultipleTrashButtonLoading, setIsMultipleTrashButtonLoading ] = React.useState(false);

  const handleDeleteMultipleCoupons = async (couponIds: string[]) => {
    try {
      setIsMultipleTrashButtonLoading(true);
      // @ts-ignore
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}coupons/delete-multiple-coupons`, {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify({ ids: couponIds }),
      });
  
      const data = await response.json();
  
      if ( !response.ok ){
        if ( data.type )
        console.log(data);
        throw new Error("error" + response);
      }
  
      const coupons = await getCouponData();
  
      console.log(data, coupons);
      setCouponData(coupons!);
      
      toast.success(data.message, { description: `${data?.data?.deletedCount!} coupon(s) deleted.`, className: "font-[quicksand]", icon: <ToastSuccess /> });
      // toast.success("Product deleted successfully!", { className: "font-[quicksand]", icon: <ToastSuccess /> });
      // window.location.reload();
    } catch (error: any) {
      console.log(error);
      // toast.error("Product deletion failed!", { description: productData.productName!, className: "font-[quicksand]", icon: <ToastFaliure /> })
      toast.error("Coupon deletion failed!", { className: "font-[quicksand]", icon: <ToastFaliure /> })
    } finally {
      setIsMultipleTrashButtonLoading(false);
    }
  };

  const [ discountType, setDiscountType ] = React.useState<"fixed" | "percentage">("fixed");

  return (
    <div className="font-[Quicksand] px-2">
      <div className="flex items-center py-4">
        <div className="flex justify-end gap-4 items-center w-full mr-4">
          <Button onClick={ async (e) => {
            e.preventDefault();
            await handleDeleteMultipleCoupons(table.getSelectedRowModel().rows?.map(row => row?.original?._id!));
          }} variant={"ghost"} disabled={isMultipleTrashButtonLoading || table.getSelectedRowModel().rows.length <= 0} className="bg-red-100 py-2 px-3 hover:bg-red-500 text-red-500 hover:text-white justify-self-end">{isMultipleTrashButtonLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Trash2 className="w-5 h-5" />}</Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
              <DialogTrigger asChild>
                <Button variant={"ghost"} className="bg-yellow-100 px-2 hover:bg-yellow-300 text-yellow-300 hover:text-white"><Plus /></Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                  <DialogTitle>Enter product details</DialogTitle>
                  <DialogDescription>
                    Enter product details to create a product . Click create when you're done.
                  </DialogDescription>
                  </DialogHeader>
                  <FormProvider {...couponCreateForm} >
                    <Form {...couponCreateForm} onSubmit={couponCreateForm.handleSubmit(handleCouponCreate)} >
                      <form className="grid pb-10 gap-4 py-4" onSubmit={couponCreateForm.handleSubmit(handleCouponCreate)}>
                      {/* <form onSubmit={(e) => {
                        e.preventDefault();
                        console.log(productForm.formState.errors)
                      }} className="grid pb-10 gap-4 py-4"> */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="col-span-1">
                            Coupon name
                          </Label>
                          <FormField
                            control={couponCreateForm.control}
                            name="couponName"
                            render={({ field }) => (
                              <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                                <FormControl className="col-span-3 w-full">
                                  <Input {...field} placeholder="" className="col-span-3 w-full focus-visible:ring-yellow-500" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="col-span-1">
                            Coupon code
                          </Label>
                          <FormField
                            control={couponCreateForm.control}
                            name="couponCode"
                            render={({ field }) => (
                              <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                                <FormControl className="col-span-3 w-full">
                                  <Input {...field} placeholder="" className="col-span-3 w-full uppercase focus-visible:ring-yellow-500" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="col-span-1">
                            Discount
                          </Label>
                          <FormField
                            control={couponCreateForm.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem className={cn("focus-visible:ring-yellow-500", discountType == "percentage" ? "col-span-1" : "col-span-2")}>
                                <FormControl className={cn("w-full", discountType == "percentage" ? "col-span-1" : "col-span-2")}>
                                <Select onValueChange={(value : "fixed" | "percentage") => {
                                  setDiscountType(value);
                                  field.onChange(value);
                                  if ( discountType == "percentage" ) 
                                    couponCreateForm.resetField("discount.upperLimit"); 
                                  else
                                    couponCreateForm.setValue("discount.upperLimit", 0);
                                }} {...field} defaultValue={discountType}  >
                                  <SelectTrigger className={cn("focus:ring-yellow-500 focus-visible:ring-yellow-500", discountType == "percentage" ? "col-span-1" : "col-span-2")}>
                                    <SelectValue placeholder="Select discount type" />
                                  </SelectTrigger>
                                  <SelectContent className="focus:ring-yellow-500 focus-visible:ring-yellow-500 active-visible:ring-yellow-500 ">
                                    <SelectGroup {...field}>
                                      <SelectLabel>Types</SelectLabel>
                                      <SelectItem value={`fixed`}>{`Fixed amount(₹)`}</SelectItem>
                                      <SelectItem value={`percentage`}>{`Percentage(%)`}</SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={couponCreateForm.control}
                            name="discount.amount"
                            render={({ field }) => (
                              <FormItem className={cn("focus-visible:ring-yellow-500", discountType == "percentage" ? "col-span-1" : "col-span-[1.5]")}>
                                <FormControl className={cn("w-full", discountType == "percentage" ? "col-span-1" : "col-span-[1.5]")}>
                                  <Input {...field} type="number" placeholder="Amount" className={cn("w-full focus-visible:ring-yellow-500", discountType == "percentage" ? "col-span-1" : "col-span-[1.5]")} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {discountType == "percentage" && <FormField
                            control={couponCreateForm.control}
                            name="discount.upperLimit"
                            render={({ field }) => (
                              <FormItem className="col-span-1 focus-visible:ring-yellow-500">
                                <FormControl className="col-span-1 w-full">
                                  <Input {...field} type="number" placeholder="Upper limit" className="col-span-1 w-full focus-visible:ring-yellow-500" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="col-span-1">
                            Uses per customer
                          </Label>
                          <FormField
                            control={couponCreateForm.control}
                            name="usesPerCustomer"
                            render={({ field }) => (
                              <FormItem className="col-span-1 focus-visible:ring-yellow-500">
                                <FormControl className="col-span-1 w-full">
                                  <Input {...field} placeholder="" className="col-span-1 w-full focus-visible:ring-yellow-500" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Label htmlFor="name" className="col-span-1">
                            Total uses
                          </Label>
                          <FormField
                            control={couponCreateForm.control}
                            name="totalUses"
                            render={({ field }) => (
                              <FormItem className="col-span-1 focus-visible:ring-yellow-500">
                                <FormControl className="col-span-1 w-full">
                                  <Input {...field} placeholder="" className="col-span-1 w-full focus-visible:ring-yellow-500" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="col-span-1">
                            Date Start
                          </Label>
                          <FormField
                            control={couponCreateForm.control}
                            name="dateStart"
                            render={({ field }) => (
                              <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                                <FormControl className="col-span-1 w-full">
                                  {/* <Input {...field} placeholder="" className="col-span-1 w-full focus-visible:ring-yellow-500" /> */}
                                  <DatePicker className={""} field={field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Label htmlFor="name" className="col-span-1">
                            Date End
                          </Label>
                          <FormField
                            control={couponCreateForm.control}
                            name="dateEnd"
                            render={({ field }) => (
                              <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                                <FormControl className="col-span-3 w-full">
                                  {/* <Input {...field} placeholder="" className="col-span-1 w-full focus-visible:ring-yellow-500" /> */}
                                  {/* <CustomDatePicker field={field}/> */}
                                  <DatePicker className="" field={field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <div className="flex justify-start items-center gap-2 w-full col-span-2">
                              <Label htmlFor="customer-login">Customer login</Label>
                              <FormField
                                control={couponCreateForm.control}
                                name="customerLogin"
                                render={({ field }) => (
                                  <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                                    <FormControl className="col-span-3 w-full">
                                      {/* <Input {...field} placeholder="" className="col-span-1 w-full focus-visible:ring-yellow-500" /> */}
                                      {/* <CustomDatePicker field={field}/> */}
                                      <Checkbox className="border-yellow-300 focus-visible:ring-yellow-500 data-[state=checked]:bg-yellow-300" checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          <div className="flex justify-end items-center gap-2 w-full col-span-2">
                              <Label htmlFor="status">Status</Label>
                              <FormField
                                control={couponCreateForm.control}
                                name="status"
                                render={({ field }) => (
                                  <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                                    <FormControl className="col-span-3 w-full">
                                      {/* <Input {...field} placeholder="" className="col-span-1 w-full focus-visible:ring-yellow-500" /> */}
                                      {/* <CustomDatePicker field={field}/> */}
                                      <Checkbox className="border-yellow-300 focus-visible:ring-yellow-500 selection:border-yellow-600 data-[state=checked]:bg-yellow-300" checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                          </div>
                        </div>
                      </form>
                      <Button disabled={isCreateButtonLoading} variant={"ghost"} className="absolute bottom-5 right-5 flex justify-center items-center gap-2 bg-yellow-300 hover:bg-yellow-500 text-white hover:text-white" type="submit">{isCreateButtonLoading ? <Loader2 className="animate-spin" /> : <>Create <TicketPlus className="w-4 h-4"/></>}</Button>
                    </Form>
                  </FormProvider>
                  <DialogFooter>
                  </DialogFooter>
              </DialogContent>
          </Dialog>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md w-full border">
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
};

export const AllCouponsTable = () => {
    
    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 h-full">
            <DataTable />
        </div>
    );
};