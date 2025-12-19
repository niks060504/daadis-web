import { ICustomer, IOrder, 
  // IProduct,
   MONTHS,
    // SAMPLE_CATEGORIES,
     SAMPLE_ORDERS
    // , SAMPLE_PRODUCTS
    , WEEKDAYS } from "../../../utils/constants.ts";
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
import { ArrowUpDown, ChevronDown, LoaderCircle, 
  // MoreHorizontal ,
  PencilIcon, Trash2 } from "lucide-react"
 
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
import { Label } from "../../ui/label.tsx";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../ui/select.tsx";
import { ProductsOrderedTable } from "./ProductsOrderedTable.tsx";
// import { toast } from "sonner";
// import { ToastFaliure } from "../productMain/AllProductsTable.tsx";

/* Todo: finish product delete and edit, add delete multiple button and update filter feature */

const handleProductEdit = () => {

};

const handleProductDelete = () => {

};

// const getAllOrders = async () => {
//   try {
//     // @ts-ignore
//     const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}orders/get-all-orders`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: 'include',
//     });

//     const data = await response.json();
//     console.log(data);

//     if ( !response.ok ){
//       throw new Error("error" + response);
//     }
//     return data.data;
//   } catch (error: any) {
//     console.log(error);
//     toast.error("Error while fetching product list, refresh!", { description: error, className: "bg-red-300 font-[quicksand]", icon: <ToastFaliure /> }, );
//     return null;
//   }
// };

export const columns: ColumnDef<IOrder>[] = [
  {
    accessorKey: "orderId",
    id: "orderId",
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
        Id
    </div>
      
    ),
    cell: ({ row }) => {
        
        console.log(row.getValue("orderId"));
        
        return <div className="flex items-center gap-2">
            <Checkbox
              className="border-yellow-300 data-[state=checked]:bg-yellow-300"
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
            {row.getValue("orderId")}
        </div>
    },
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   header: "",
  //   accessorKey: "imageUrl",
  //   cell: ({ row }) => {
  //       const url: string[] = row.getValue("imageUrl");
      
  //       return <div className="capitalize">
  //           <img className="w-10 h-10" src={url[0]} alt=""/>
  //       </div>
  //   },
  // },
  {
    accessorKey: "customerId",
    header: "Customer Id",
    cell: ({ row }) => {
      const customer: ICustomer = row.getValue("customerId");
      return <div className="capitalize">{`${customer.firstName} ${customer.lastName}`}</div>
    },
  },
  {
    accessorKey: "total",
    header: "Order total",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("total")+" ₹"}</div>
    ),
  },
  {
    accessorKey: "orderStatus",
    header: "status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("orderStatus")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
          return (
            <Button
              className=""
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Date created
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
        const frontEndDate = new Date(createdAt!);
        console.log(row.original);
        const date = { month: frontEndDate.getMonth(), day: frontEndDate.getDate(), year: frontEndDate.getFullYear() }; 
        // return <></>
        return <div className="" onClick={() => {
          // console.log(row?.original?.dateStart?.getMonth());
        }}>{`${WEEKDAYS[frontEndDate.getUTCDay() - 1]}, ${date?.day} ${MONTHS[date?.month!].substring(0,3)} ${date?.year!}`}</div>
      },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const order = row.original

      console.log(order);
      
      return (  
        <div className="flex justify-end font-[Quicksand]">
            <DropdownMenu >
                <DropdownMenuTrigger asChild>
                    {/* <Button onClick={(e) => {e.stopPropagation()}} variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button> */}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[10px]" align="center">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Dialog>
                          <DialogTrigger asChild>
                            <Button className="hover:text-yellow-500 w-full grid-cols-3 gap-2 items-center justify-start h-12" variant={"ghost"}>
                              <PencilIcon className="w-4 h-4 col-start-1 col-span-1" />
                              <span className="col-start-2 col-span-2">Edit</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[800px]">
                              <DialogHeader>
                              <DialogTitle>Update order details</DialogTitle>
                              <DialogDescription>
                                  Make changes to your the order details here. Click save changes when you're done.
                              </DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-4 py-4">
                                <div className="grid col-span-1 grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name">
                                    Product ID
                                    </Label>
                                    <Input required disabled
                                    id="name"
                                    defaultValue={order.orderId}
                                    className="col-span-3 focus-visible:ring-yellow-500"
                                    />
                                </div>
                                <div className="grid col-span-1 grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name">
                                    Customer name
                                    </Label>
                                    <Input required disabled
                                    id="name"
                                    defaultValue={order.customerId.firstName}
                                    className="col-span-3 focus-visible:ring-yellow-500"
                                    />
                                </div>
                                <div className="grid col-span-1 grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name">
                                    Address
                                    </Label>
                                    <Input required
                                      placeholder="Address line 2"
                                      id="name"
                                      defaultValue={order.deliveryAddress.line1}
                                      className="col-span-3 focus-visible:ring-yellow-500"
                                    />
                                    <Input required
                                      placeholder="Address line 2"
                                      id="name"
                                      defaultValue={order.deliveryAddress.line2}
                                      className="col-span-3 col-start-2 focus-visible:ring-yellow-500"
                                    />
                                    <Input required
                                      id="name"
                                      placeholder="company name"
                                      defaultValue={order.deliveryAddress.company}
                                      className="col-span-3 col-start-2 focus-visible:ring-yellow-500"
                                    />
                                    <Input required
                                      id="name"
                                      placeholder="City"
                                      defaultValue={order.deliveryAddress.city}
                                      className="col-span-3 col-start-2 focus-visible:ring-yellow-500"
                                    />
                                    <Input required
                                      id="name"
                                      placeholder="State"
                                      defaultValue={order.deliveryAddress.state}
                                      className="col-span-3 col-start-2 focus-visible:ring-yellow-500"
                                    />
                                    <Input required
                                      id="name"
                                      placeholder="Postal code"
                                      defaultValue={order.deliveryAddress.postalCode}
                                      className="col-span-3 col-start-2 focus-visible:ring-yellow-500"
                                    />
                                </div>
                                <div className="grid col-span-1 grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name">
                                    Order status
                                    </Label>
                                    <Select defaultValue={order?.orderStatus}>
                                      <SelectTrigger className="col-span-3 focus:ring-yellow-500 focus-visible:ring-yellow-500">
                                        <SelectValue placeholder="Select a category" />
                                      </SelectTrigger>
                                      <SelectContent className="focus:ring-yellow-500 focus-visible:ring-yellow-500 active-visible:ring-yellow-500 ">
                                        <SelectGroup defaultValue={order?.orderStatus}>
                                          <SelectLabel>Select category</SelectLabel>
                                          <SelectItem value={"completed"}>{"Completed"}</SelectItem>
                                          <SelectItem value={"processing"}>{"In-transit"}</SelectItem>
                                          <SelectItem value={"ordered"}>{"Ordered"}</SelectItem>
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid row-start-2 col-start-2 h-full bg-red-300 col-span-1 grid-cols-4 items-center gap-4">
                                  <Label htmlFor="product-list">
                                    Products
                                  </Label>
                                  <div className="h-[350px] col-span-4">
                                    <ProductsOrderedTable />
                                  </div>
                                </div>
                                <div className="grid col-span-1 grid-cols-4 items-center gap-4">
                                    <Label htmlFor="username">
                                      Order total
                                    </Label>
                                    <div className="col-span-3 flex gap-2">
                                      <div className="w-[50px] bg-gray-200 flex justify-center text-gray-500 items-center font-semibold rounded-md">
                                        ₹
                                      </div>
                                      <Input required disabled
                                        id="total"
                                        defaultValue={order?.total}
                                        className="col-span-3 focus:ring-yellow-500 focus-visible:ring-yellow-500"
                                      />
                                    </div>
                                </div>
                              </div>
                              <DialogFooter>
                              <Button variant={"ghost"} onClick={handleProductEdit} className="bg-yellow-300 hover:bg-yellow-500 text-white hover:text-white" type="submit">Save changes</Button>
                              </DialogFooter>
                          </DialogContent>
                      </Dialog>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-0"><Button onClick={handleProductDelete} className="hover:text-red-500 w-full flex justify-start items-center gap-2" variant={"ghost"}><Trash2 className="w-4 h-4" /> Delete</Button></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      )
    },
  },
]
 
export function DataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
 
  // const [ orders, setOrders ] = React.useState<IOrder[]>();

  React.useEffect(() => {
    (async function () {
      // const orders = await getAllOrders();
      // console.log(orders);
    })();
  }, []);

  const table = useReactTable({
    data: SAMPLE_ORDERS,
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

  const [ isMultipleTrashButtonLoading, setIsMultipleTrashButtonLoading ] = React.useState(false);
  // const [ isDialogOpen, setIsDialogOpen ] = React.useState(false);

  return (

    <div className="font-[Quicksand] px-2">
      
      <div className="flex items-center py-4">
        <div>
          <Button disabled={isMultipleTrashButtonLoading  || table.getSelectedRowModel().rows.length <= 0} variant={"ghost"} className="bg-red-100 py-2 px-3 hover:bg-red-500 text-red-500 hover:text-white justify-self-end" onClick={ async (event) => {
            event.preventDefault();
            setIsMultipleTrashButtonLoading(!isMultipleTrashButtonLoading);
            console.log(table.getSelectedRowModel().rows?.map(row => row?.original?._id));
            // await handleDeleteMultipleProducts(table.getSelectedRowModel().rows?.map(row => row?.original?._id!));
          }}>{isMultipleTrashButtonLoading ? <LoaderCircle className="animate-spin w-5 h-5" /> : <Trash2 className="w-5 h-5" />}</Button>
          
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
}

export const AllOrdersTable = () => {
    
    return (
        <div className="absolute top-0 left-0 h-[calc(100%-96px)] right-0 bottom-0">
            <DataTable />
        </div>
    );
};