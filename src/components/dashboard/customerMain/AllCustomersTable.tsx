import { ICustomer } from "../../../utils/constants.ts";
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
import { ArrowUpDown, ChevronDown, Eye, EyeOff, Loader2, MoreHorizontal, PackagePlus, PencilIcon, Plus, Save, Trash2 } from "lucide-react"
 
import { Button } from "../../ui/button.tsx"
import { Checkbox } from "../../ui/checkbox.tsx"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  // DropdownMenuSeparator,
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../../ui/form.tsx";
import { Label } from "../../ui/label.tsx";
import { IconButton } from "@mui/material";
import { toast } from "sonner";
import { ToastFaliure, ToastSuccess, ToastWarning } from "../productMain/AllProductsTable.tsx";
// @ts-ignore
import { ApiError } from "../../../utils/ApiError.js";

/* Todo: add delete multiple button and update filter feature, customer group, etc. */

export const customerFormSchema = z.object({
  firstName: z.string().min(0, { message: "The field cannot be empty!"}),
  lastName: z.string().min(0, { message: "The field cannot be empty!"}),
  phoneNumber: z.coerce.number(),
  phoneNumberVerified: z.boolean().default(false),
  email: z.string().email(),
  emailVerified: z.boolean().default(false),
  address: z.object({
    line1: z.string(),
    line2: z.string(),
    company: z.string(),
    city: z.string(),
    postalCode: z.coerce.number(),
    state: z.string(),
  }),
  totalOrderAmount: z.coerce.number(),
  luckyPoints: z.coerce.number(),
  password: z.string().min(8, { message: "Password must be 8 characters long"}).refine((password) => /[a-z]/.test(password), { message: "Password must contain at least one lower case character!"}).refine((password) => /[A-Z]/.test(password), { message: "Password must contain at least one upper case character!"}).refine((password) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(password), { message: "Password must contain at least one special character!"}).refine((password) => /[0-9]/.test(password), { message: "Password must contain at least one numberic value!"})
});

export const columns: ColumnDef<ICustomer>[] = [
  {
    accessorKey: "firstName",
    id: "firstName",
    header: ({ table }) => (<div className="flex items-center gap-2">
        <Checkbox
          className="border-yellow-300 data-[state=checked]:bg-yellow-300"
          checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
        Name
    </div>),

    cell: ({ row }) => {
        // console.log(row);
        return <div className="flex items-center gap-2">
            <Checkbox
              className="border-yellow-300 data-[state=checked]:bg-yellow-300"
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
            {row.getValue("firstName")} {row.original.lastName}
        </div>
    },  
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "totalOrderAmount",
    header: ({ column }) => {
      return (
        <Button
          className=""
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total order amount(₹)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("totalOrderAmount")}</div>,
  },
  {
    accessorKey: "luckyPoints",
    header: ({ column }) => {
      return (
        <Button
          className=""
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Lucky points
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("luckyPoints")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const customer = row.original;
      
      console.log("Customer: ");
      console.log(customer);
      
      const [ isDialogOpen, setIsDialogOpen ] = React.useState(false);
      
      const [ isButtonLoading, setIsButtonLoading ] = React.useState(false);    
      
      const customerForm = useForm<z.infer<typeof customerFormSchema>>({
        resolver: zodResolver(customerFormSchema), defaultValues: {
          firstName: customer?.firstName,
          lastName: customer?.lastName,
          phoneNumber: customer?.phoneNumber,
          email: customer?.email,
          phoneNumberVerified: customer?.phoneNumberVerified,
          emailVerified: customer?.emailVerified,
          password: "",
          address: {
            line1: customer?.address?.line1,
            line2: customer?.address?.line2,
            company: customer?.address?.company,
            city: customer?.address?.city,
            postalCode: customer?.address?.postalCode,
            state: customer?.address?.state,
          },
          totalOrderAmount: customer?.totalOrderAmount,
          luckyPoints: customer?.luckyPoints,
          // role: "Customer",
      }});

      const [ isTrashButtonLoading, setIsTrashButtonLoading ] = React.useState<boolean>(false);

      const handleCustomerDelete = async () => {
        setIsTrashButtonLoading(true);
        try {
          // @ts-ignore
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/delete-a-customer/${customer?._id!}`, {
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
      
          console.log(data);
          
          toast.success("Customer deleted successfully!", { description: `${customer.firstName!} ${customer?.lastName!}`, className: "font-[quicksand]", icon: <ToastSuccess /> });
          window.location.reload();
        } catch (error: any) {
          console.log(error);
          toast.error("Customer deletion failed!", { description: `${customer.firstName!} ${customer?.lastName!}`, className: "font-[quicksand]", icon: <ToastFaliure /> })
        } finally {
          setIsTrashButtonLoading(false);
        }
      };

      const onCustomerEditFormSubmit: any = async (values: z.infer<typeof customerFormSchema>) => {
        console.log("Form sumbitted")
        setIsButtonLoading(true);
        console.log(values);
        try {
          // @ts-ignore
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/update-user-details/`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "update-type": "other"
            },
            credentials: 'include',
            body: JSON.stringify( { user: { ...values, role: "Customer", _id: customer?._id, address: customer?.address, orders: customer?.orders, cart: customer?.cart, wishList: customer?.wishList } } ),
          });

          const data = await response.json();
          if ( !response.ok ){
            throw new Error("error" + response);
          }
          console.log(data.data);
          toast.success("Customer updated successfully!", { description: `${values?.firstName} ${values?.lastName}`,  className: "font-[quicksand]", icon: <ToastSuccess />})
          window.location.reload();
          return data.data;
        } catch (error) {
          toast.error("Error while updating customer, please try again!", { description: `${values?.firstName} ${values?.lastName}`,  className: "font-[quicksand]", icon: <ToastFaliure />})
          console.log(error);
        } finally {
          setIsButtonLoading(false);
          setIsDialogOpen(false);
        }
      };


      const [ showPassword, setShowPassword ] = React.useState<boolean>(false);

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
                    {/* <div className="flex w-full justify-end mx-4 items-center gap-4 "> */}
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
                          <DialogTrigger asChild>
                            <Button className="hover:text-yellow-500 w-full grid-cols-3 gap-2 items-center justify-start h-10" variant={"ghost"}>
                              <PencilIcon className="w-4 h-4 col-start-1 col-span-1" />
                              <span className="col-start-2 col-span-2">Edit</span>
                            </Button>
                          </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                <DialogTitle>Enter customer details</DialogTitle>
                                <DialogDescription>
                                    Enter customer details to update the customer. Click save changes when you're done.
                                </DialogDescription>
                                </DialogHeader>
                                  <Form {...customerForm}>
                                  {/* <form onSubmit={customerForm.handleSubmit(onCustomerEditFormSubmit)} className="grid pb-10 gap-4 py-4"> */}
                                  <form onSubmit={(event) => {
                                    event.preventDefault();
                                    customerForm.handleSubmit(onCustomerEditFormSubmit);
                                    onCustomerEditFormSubmit(customerForm.getValues());
                                  }} className="grid pb-10 gap-4 py-4">
                                  {/* <form onSubmit={(e) => {
                                    // e.preventDefault();
                                    console.log("form submitted")
                                    console.log(customerForm.formState.errors)
                                    // Object.keys(customerForm.formState).length > 0 && console.log(customerForm.formState)
                                  }} className="grid pb-10 gap-4 py-4"> */}
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="name">
                                      First name
                                      </Label>
                                      <FormField
                                        control={customerForm.control}
                                        name="firstName"
                                        render={({ field }) => (
                                          <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                                            <FormControl defaultValue={customer.firstName}>
                                              <Input {...field} required placeholder="Jonh" className="col-span-3 focus-visible:ring-yellow-500" />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="name">
                                        Last name
                                      </Label>
                                      <FormField
                                        control={customerForm.control}
                                        name="lastName"
                                        render={({ field }) => (
                                          <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                                            <FormControl>
                                              <Input {...field} required placeholder="Smith" className="col-span-3 focus-visible:ring-yellow-500" />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="name">
                                        Phone number
                                      </Label>
                                      <FormField
                                        control={customerForm.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                          <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                                            <FormControl>
                                              <Input {...field} required type="number" defaultValue={customer.phoneNumber} placeholder="0123456789" className="col-span-3 focus-visible:ring-yellow-500" />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="name">
                                        Email
                                      </Label>
                                      <FormField
                                        control={customerForm.control}
                                        name="email"
                                        render={({ field }) => (
                                          <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                                            <FormControl>
                                              <Input {...field} required defaultValue={customer.email} type="email" placeholder={"someone@mail.com"} className="col-span-3 focus-visible:ring-yellow-500" />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="name">
                                        Password
                                      </Label>
                                      <FormField
                                        control={customerForm.control}
                                        name="password"
                                        render={({ field }) => (
                                          <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                                            <FormControl>
                                              <div className="relative transition-all duration-150">
                                                <IconButton style={{
                                                  position: "absolute",
                                                  right: "5px",
                                                  transform: "translateY(-50%)",
                                                  top: "50%"
                                                }} onClick={(e) => {
                                                    e.preventDefault();
                                                    setShowPassword(!showPassword);
                                                    console.log(customerForm.formState.errors);
                                                    console.log(table.getRowModel().rows[0].getIsSelected());
                                                  }}>{showPassword ? <Eye className="w-4 h-4"/> : <EyeOff  className="w-4 h-4"/>}</IconButton>
                                                <Input {...field} required defaultValue={""} type={showPassword ? "text" : "password"} placeholder={"********"} className="col-span-3 focus-visible:ring-yellow-500" />
                                              </div>
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 justify-between items-center gap-4">
                                      <div className="col-span-2 flex items-center justify-start gap-4">
                                        <Label htmlFor="stock" className="col-span-1">
                                          Phone no. verified
                                        </Label>
                                        <FormField
                                          control={customerForm.control}
                                          name="phoneNumberVerified"
                                          render={({ field }) => (
                                            <FormItem className="focus-visible:ring-yellow-500">
                                              <FormControl>
                                                <Checkbox className="border-yellow-300 data-[state=checked]:bg-yellow-300 self-end justify-self-end" checked={field.value} onCheckedChange={field.onChange} />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                      <div className="col-span-2 flex items-center gap-4 justify-end">
                                        <Label htmlFor="stock" className="col-span-1">
                                          Email verified
                                        </Label>
                                        <FormField
                                          control={customerForm.control}
                                          name="emailVerified"
                                          render={({ field }) => (
                                            <FormItem className="focus-visible:ring-yellow-500">
                                              <FormControl>
                                                <Checkbox className="border-yellow-300 data-[state=checked]:bg-yellow-300 self-end justify-self-end" checked={field.value} onCheckedChange={field.onChange} />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="name">
                                        Lucky points
                                      </Label>
                                      <FormField
                                        control={customerForm.control}
                                        name="luckyPoints"
                                        render={({ field }) => (
                                          <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                                            <FormControl>
                                              <Input {...field} type={"number"} placeholder={field.value+""} className="col-span-3 focus-visible:ring-yellow-500" />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    <Button disabled={isButtonLoading} variant={"ghost"} className="absolute bottom-5 right-5 flex justify-center items-center gap-2 bg-yellow-300 hover:bg-yellow-500 text-white hover:text-white" type="submit">{isButtonLoading ? <Loader2 className="animate-spin" /> : <>Save changes <Save className="w-4 h-4"/></>}</Button>
                                  </form>
                                  </Form>
                                  <DialogFooter>
                                  </DialogFooter>
                              </DialogContent>
                          </Dialog>
                          {/* <Button variant={"ghost"} className="bg-yellow-100 px-2 hover:bg-yellow-300 text-yellow-300 hover:text-white"><Plus /></Button> */}
                          {/* <Button variant={"ghost"} className="bg-red-100 hover:bg-red-500 text-red-500 hover:text-white"><Trash2 /></Button> */}
                      {/* </div> */}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-0"><Button onClick={handleCustomerDelete} className="hover:text-red-500 w-full flex justify-start items-center gap-2" variant={"ghost"}>{isTrashButtonLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete</Button></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      )
    },
  },
];

 
export function DataTable() {
  const [ sorting, setSorting ] = React.useState<SortingState>([]);
  const [ columnFilters, setColumnFilters ] = React.useState<ColumnFiltersState>([]);
  const [ columnVisibility, setColumnVisibility ] = React.useState<VisibilityState>({});
  const [ rowSelection, setRowSelection ] = React.useState({});

  const [ customerList, setCustomerList ] = React.useState<Array<ICustomer>>([]);

  const getCustomers = async () => {
    try {
      // @ts-ignore
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/get-all-customers/`);
  
      const data = await response.json();
      
      if ( !response.ok )
      {
        console.log(response);
        throw new Error("Error : "+ response);
      }
  
      console.log(data.data);
      return data.data;
  
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch customers!", { className: "font-[quicksand]", icon: <ToastWarning /> });
    }
    return [];
  };

  React.useEffect(() => {
    (async function () {
      setCustomerList(await getCustomers());
    })();
  }, []);

  const customerForm = useForm<z.infer<typeof customerFormSchema>>({
    resolver: zodResolver(customerFormSchema), defaultValues: {
      firstName: "",
      lastName: "",
      // phoneNumber: 0,
      // email: "someone@gmail.com",
      phoneNumberVerified: false,
      emailVerified: false,
      password: "",
      // address: {
      //   line1: "",
      //   line2: "",
      //   company: "",
      //   city: "",
      //   postalCode: 123456,
      //   state: "",
      // },
      totalOrderAmount: 0,
      luckyPoints: 0,
    }});

  const table = useReactTable({
    data: customerList,
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
  })
 
  const [ isDialogOpen, setIsDialogOpen ] = React.useState(false);

  const [ isButtonLoading, setIsButtonLoading ] = React.useState(false);


  const onCustomerCreateFormSubmit = async (values: z.infer<typeof customerFormSchema>) => {
    setIsButtonLoading(true);
    console.log(values);
    try {
      // @ts-ignore
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({...values, role: "Customer"})
      });

      const data = await response.json();
      console.log(data.errors);

      if ( !response.ok ){
        // productCreateForm.setError(data.type, { type: "manual", message: data?.errorMessage });
        if ( data?.errors[0]?.type !== undefined )
          data.errors.map((err: any) => {
            customerForm.setError(err.type, { type: "manual", message: err.message });
          });
        throw new ApiError(data.statusCode, data);
      }
      setCustomerList(await getCustomers());
      setIsDialogOpen(false);
      toast.success("Customer create successfully!", { icon: <ToastSuccess />});
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to create user!", { description: (error?.errors[0]?.message || ""), icon: <ToastFaliure /> });
    }
    setIsButtonLoading(false);
  };

  const [ showPassword, setShowPassword ] = React.useState<boolean>(false);

  const [ isMultipleTrashButtonLoading, setIsMultipleTrashButtonLoading ] = React.useState<boolean>(false);


  const handleDeleteMultipleCustomers = async (productIds: string[]) => {
    setIsMultipleTrashButtonLoading(true);
    try {
      // @ts-ignore
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/delete-multiple-customers`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify({ ids: productIds }),
      });
  
      const data = await response.json();
  
      if ( !response.ok ){
        if ( data.type )
        console.log(data);
        throw new Error("error" + response);
      }
  
      const customers = await getCustomers();
  
      console.log(data, customers);
      setCustomerList(customers);
      
      toast.success(data.message, { description: `${data?.data?.deletedCount!} customer(s) deleted.`, className: "font-[quicksand]", icon: <ToastSuccess /> });
      // toast.success("Product deleted successfully!", { className: "font-[quicksand]", icon: <ToastSuccess /> });
      // window.location.reload();
    } catch (error: any) {
      console.log(error);
      // toast.error("Product deletion failed!", { description: productData.productName!, className: "font-[quicksand]", icon: <ToastFaliure /> })
      toast.error("Customer deletion failed!", { className: "font-[quicksand]", icon: <ToastFaliure /> })
    } finally {
      setIsMultipleTrashButtonLoading(false);
    }
    // setIsTrashButtonLoading(false);
  }

  return (
    <div className="font-[Quicksand] px-2">
      <div className="flex items-center py-4">
        <Input required
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
          className="max-w-sm focus-visible:ring-yellow-500"
        />

        <div className="flex w-full justify-end mx-4 items-center gap-4">
        <Button disabled={ isMultipleTrashButtonLoading || table.getSelectedRowModel().rows.length <= 0 } variant={"ghost"} className="bg-red-100 hover:bg-red-500 text-red-500 py-2 px-3 hover:text-white justify-self-end" onClick={ async (e) => {
          e.preventDefault();
          await handleDeleteMultipleCustomers(table.getSelectedRowModel().rows?.map(row => row?.original?._id!));
        }}>{isMultipleTrashButtonLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Trash2 className="w-5 h-5" />}</Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
              <DialogTrigger asChild>
                <Button variant={"ghost"} className="bg-yellow-100 px-2 hover:bg-yellow-300 text-yellow-300 hover:text-white"><Plus /></Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                  <DialogTitle>Enter customer details</DialogTitle>
                  <DialogDescription>
                      Enter customer details to create a customer . Click create when you're done.
                  </DialogDescription>
                  </DialogHeader>
                    <Form {...customerForm}>
                    {/* <form onSubmit={customerForm.handleSubmit(onCustomerCreateFormSubmit)} className="grid pb-10 gap-4 py-4"> */}
                    <form onSubmit={ async (e) => {
                      e.preventDefault();
                      console.log(customerForm.formState.errors)
                      await onCustomerCreateFormSubmit(customerForm.getValues());
                    }} className="grid pb-10 gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name">
                        First name
                        </Label>
                        <FormField
                          control={customerForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                              <FormControl>
                                <Input {...field} required placeholder="" className="col-span-3 focus-visible:ring-yellow-500" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name">
                          Last name
                        </Label>
                        <FormField
                          control={customerForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                              <FormControl>
                                <Input {...field} required placeholder="" className="col-span-3 focus-visible:ring-yellow-500" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name">
                          Phone number
                        </Label>
                        <FormField
                          control={customerForm.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                              <FormControl>
                                <Input {...field} required type="number" placeholder="" className="col-span-3 focus-visible:ring-yellow-500" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name">
                          Email
                        </Label>
                        <FormField
                          control={customerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                              <FormControl>
                                <Input {...field} required defaultValue={""} type="email" placeholder={field.value} className="col-span-3 focus-visible:ring-yellow-500" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name">
                          Password
                        </Label>
                        <FormField
                          control={customerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                              <FormControl>
                                <div className="relative transition-all duration-150">
                                  <IconButton style={{
                                    position: "absolute",
                                    right: "5px",
                                    transform: "translateY(-50%)",
                                    top: "50%"
                                  }} onClick={(e) => {
                                      e.preventDefault();
                                      setShowPassword(!showPassword);
                                      console.log(customerForm.formState.errors);
                                    }}>{showPassword ? <Eye className="w-4 h-4"/> : <EyeOff  className="w-4 h-4"/>}</IconButton>
                                  <Input {...field} required defaultValue={""} type={showPassword ? "text" : "password"} placeholder={field.value} className="col-span-3 focus-visible:ring-yellow-500" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-4 justify-between items-center gap-4">
                        <div className="col-span-2 flex items-center justify-start gap-4">
                          <Label htmlFor="stock" className="col-span-1">
                            Phone no. verified
                          </Label>
                          <FormField
                            control={customerForm.control}
                            name="phoneNumberVerified"
                            render={({ field }) => (
                              <FormItem className="focus-visible:ring-yellow-500">
                                <FormControl>
                                  <Checkbox className="border-yellow-300 data-[state=checked]:bg-yellow-300 self-end justify-self-end" checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-2 flex items-center gap-4 justify-end">
                          <Label htmlFor="stock" className="col-span-1">
                            Email verified
                          </Label>
                          <FormField
                            control={customerForm.control}
                            name="emailVerified"
                            render={({ field }) => (
                              <FormItem className="focus-visible:ring-yellow-500">
                                <FormControl>
                                  <Checkbox className="border-yellow-300 data-[state=checked]:bg-yellow-300 self-end justify-self-end" checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name">
                          Lucky points
                        </Label>
                        <FormField
                          control={customerForm.control}
                          name="luckyPoints"
                          render={({ field }) => (
                            <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                              <FormControl>
                                <Input {...field} type={"number"} placeholder={field.value+""} className="col-span-3 focus-visible:ring-yellow-500" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button disabled={isButtonLoading} variant={"ghost"} className="absolute bottom-5 right-5 flex justify-center items-center gap-2 bg-yellow-300 hover:bg-yellow-500 text-white hover:text-white" type="submit">{isButtonLoading ? <Loader2 className="animate-spin" /> : <>Create <PackagePlus className="w-4 h-4"/></>}</Button>
                    </form>
                    </Form>
                    <DialogFooter>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* <Button variant={"ghost"} className="bg-yellow-100 px-2 hover:bg-yellow-300 text-yellow-300 hover:text-white"><Plus /></Button> */}
            {/* <Button variant={"ghost"} className="bg-red-100 hover:bg-red-500 text-red-500 hover:text-white"><Trash2 /></Button> */}
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
  );
}

export const AllCustomersTable = () => {
  return (
      <div className="absolute top-0 left-0 bottom-0 scrollbar-thin scrollbar-thumb-yellow-300 scrollbar-thumb-rounded-full w-full scrollbar-track-transparent overflow-y-scroll h-full">
          <DataTable />
      </div>
  );
};