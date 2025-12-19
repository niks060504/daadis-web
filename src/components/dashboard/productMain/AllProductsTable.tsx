import { ICategory, IProduct } from "../../../utils/constants.ts";
import * as React from "react";
import { mergeRefs } from "react-merge-refs";
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
import { ArrowUpDown, ChevronDown, CircleAlert, CircleCheck, CircleX, Loader2, LoaderCircle, MoreHorizontal, PackagePlus, PencilIcon, Plus, PlusCircle, Save, Trash2, UploadIcon } from "lucide-react"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../ui/button.tsx";
import { Checkbox } from "../../ui/checkbox.tsx";
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
import { Form, FormControl, FormField, FormItem, FormMessage } from "../../ui/form.tsx";
import { toast } from "sonner";
import { cn } from "../../../lib/utils.ts";

export const ToastSuccess = () => {
  return <CircleCheck className="w-4 h-4 text-green-500" />;
};

export const ToastFaliure = () => {
  return <CircleX className="w-4 h-4 text-red-500" />;
};

export const ToastWarning = () => {
  return <CircleAlert className="w-4 h-4 text-yellow-500" />;
};

/* Todo: re-render on product delete and edit, categories error, add delete multiple button and update filter feature */

const getProducts = async () => {
  try {
    // @ts-ignore
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}products/get-all-products`, {
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
    toast.error("Error while fetching product list, refresh!", { description: error, className: "bg-red-300 font-[quicksand]", icon: <ToastFaliure /> }, );
    return error;
  }
};

export const productFormSchema = z.object({
  productId: z.string(),
  productName: z.string().min(1, { message: "Product name should be at least 1 character long!" }).max(30, { message: "Product name cannot be more than 30 characters!"}),
  productDescription: z.string(),
  productCategory: z.string(),
  imageUrl: z.array(z.object({
    url: z.string(),
    publicId: z.string(),
  })).min(1, "Select at least one image!").optional(),
  price: z.string().min(0, { message: "The price cannot be negative!"}),
  stock: z.string().min(0, { message: "Stock cannot be less than zero!" }),
  dimensions: z.object({
    l: z.string().min(0, { message: "This field cannot be less than zero!" }),
    b: z.string().min(0, { message: "This field cannot be less than zero!" }),
    h: z.string().min(0, { message: "This field cannot be less than zero!" }),
  }),
  vegetarian: z.boolean(),
  // weight: z.number().min(0, { message: "This field cannot be less than zero!" })
  weight: z.string(),
  // email: z.string().email("Invalid email, enter a valid email address!"),
  // password: z.string().min(8, { message: "Password must be 8 characters long"}).refine((password) => /[a-z]/.test(password), { message: "Password must contain at least one lower case character!"}).refine((password) => /[A-Z]/.test(password), { message: "Password must contain at least one upper case character!"}).refine((password) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(password), { message: "Password must contain at least one special character!"}).refine((password) => /[0-9]/.test(password), { message: "Password must contain at least one numberic value!"})
});

export const getCategories = async () => {
  try {
    // @ts-ignore
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}categories/get-all-categories`);

    const data = await response.json();

    if ( !response.ok )
      throw new Error("Error : "+ response);

    console.log(data.data);

    // toast.success("Categories fetched successfully!", { className: "font-[quicksand]", icon: <ToastSuccess />})
    return data.data;

  } catch (error) {
    console.log(error);
    toast.error("Failed to fetch categories!", { className: "font-[quicksand]", icon: <ToastWarning /> });
  }
};

export const columns: ColumnDef<IProduct>[] = [
  {
    accessorKey: "productId",
    id: "productId",
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
        return <div className="flex items-center gap-2">
            <Checkbox
              className="border-yellow-300 data-[state=checked]:bg-yellow-300"
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
            {row.getValue("productId")}
        </div>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "",
    accessorKey: "imageUrl",
    cell: ({ row }) => {

      console.log(row.original?.imageUrl?.[0]?.url);
      
      
        return <div className="capitalize">
            <img className="w-10 h-10 rounded-md object-cover" src={row?.original?.imageUrl?.[0]?.url} alt=""/>
        </div>
    },
  },
  {
    accessorKey: "productName",
    header: "Product name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("productName")}</div>
    ),
  },
  {
    accessorKey: "productCategory",
    header: ({ column }) => {
      return (
        <Button
          className=""
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.original.productCategory.categoryName}</div>,
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("stock")}</div>,
  },
  {
    accessorKey: "qunatitySold",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity sold
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (<div className="lowercase">{row?.original?.quantitySold}</div>)
    }
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price in ₹
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{"₹"+row.getValue("price")}</div>,
  },
  {
    accessorKey: "weight",
    header: () => <div className="text-right">Weight</div>,
    cell: ({ row }) => {
      const weight: {number: number, unit: string} = row.getValue("weight");

        return <div className="text-right font-medium">
            {`${weight?.number!}${weight?.unit!}`}
        </div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {

      const [ productData, setProductData ] = React.useState(row.original);

      const [ categories, setCategories ] = React.useState<ICategory[]>([]);

      React.useEffect(() => {
        (async function () {
          setCategories(await getCategories()); 
        })();
      }, [productData]);    

      // console.log("inside the return: "+ categories);
      

      //console.log(product);

      const [ isButtonLoading, setIsButtonLoading ] = React.useState(false);
        
      const productForm = useForm<z.infer<typeof productFormSchema>>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            productId: productData?.productId,
            productName: productData?.productName,
            productDescription: productData?.productDescription,
            productCategory: productData?.productCategory?.categoryName,
            // imageUrl: [],
            price: productData?.price+"",
            stock: productData?.stock+"",
            vegetarian: productData?.vegetarian,
            dimensions: {
              l: productData?.dimensions?.l+"",
              b: productData?.dimensions?.b+"",
              h: productData?.dimensions?.h+""
            },
            // @ts-ignore
            weight: (productData?.weight?.number!+""),
        }
      });

      const onProductEditFormSubmit = async (values: z.infer<typeof productFormSchema>) => {
        setIsButtonLoading(true);
        console.log("form submitted");
        console.log(values);
        try {
          // @ts-ignore
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}products/edit-product/${productData._id}`, {
              method: "PATCH",
              headers: {
                  "Content-Type": "application/json",
              },
              credentials: 'include',
              body: JSON.stringify({ updatedProductFromReq : {...values, weight: { number: Number(values.weight), unit: "g" }, price: Number(values.price), stock: Number(values.stock), dimensions: { l : Number(values.dimensions.l), b : Number(values.dimensions.b), h : Number(values.dimensions.h)}}})
          });
    
          const data = await response.json();
    
          if ( !response.ok ){
            if ( data.type )
              productForm.setError(data.type, { type: "manual", message: data?.errorMessage });
            console.log(data);
            throw new Error("error" + response);
          }
          setProductData(await getProducts());
          setIsDialogOpen(false);
          toast.success("Product updated successfully!", { description: data?.data?.productName, className: "font-[quicksand]", icon: <ToastSuccess /> });
          window.location.reload();
        } catch (error: any) {
          console.log(error);
          if ( error?.kind === "ObjectId") productForm.setError(error.type, {type: "manual", message: error.errorMessage});
          if ( error?.type ) productForm.setError(error.type, { type: "manual", message: error.errorMessage });
          toast.error("Failed to update product!", { description: error.errorMessage, className: "font-[quicksand]", icon: <ToastWarning /> });
        }
        setIsButtonLoading(false);
      };

      const handleProductDelete = async () => {
        setIsTrashButtonLoading(true);
        try {
          // @ts-ignore
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}products/delete-a-product/${productData._id!}`, {
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
      
          const products = await getProducts();
      
          console.log(data, products);
          setProductData(products);
          
          toast.success("Product deleted successfully!", { description: productData.productName!, className: "font-[quicksand]", icon: <ToastSuccess /> });
          window.location.reload();
        } catch (error: any) {
          console.log(error);
          toast.error("Product deletion failed!", { description: productData.productName!, className: "font-[quicksand]", icon: <ToastFaliure /> })
        }
        setIsTrashButtonLoading(false);
      };

      const [ isDialogOpen, setIsDialogOpen ] = React.useState(false);

      const [ isTrashButtonLoading, setIsTrashButtonLoading ] = React.useState(false);

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
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="hover:text-yellow-500 w-full grid-cols-3 gap-2 items-center justify-start h-12" variant={"ghost"}>
                              <PencilIcon className="w-4 h-4 col-start-1 col-span-1" />
                              <span className="col-start-2 col-span-2">Edit</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="min-w-[800px] flex justify-end gap-4 px-4 flex-col">
                              <DialogHeader>
                              <DialogTitle>Update product details</DialogTitle>
                              <DialogDescription>
                                  Make changes to your the product details here. Click save changes when you're done.
                              </DialogDescription>
                              </DialogHeader>
                              <Form {...productForm}>
                                <form onSubmit={productForm.handleSubmit(onProductEditFormSubmit)} className="grid pb-10 grid-cols-2 gap-8 py-4">
                                {/* <form onSubmit={(e) => {
                                  e.preventDefault();
                                  console.log(productForm.formState.errors)
                                }} className="grid pb-10 gap-4 py-4"> */}
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name">
                                    Product ID
                                    </Label>
                                    <FormField
                                      control={productForm.control}
                                      name="productId"
                                      render={({ field }) => (
                                        <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                                          <FormControl>
                                            <Input {...field} placeholder={productData?.productId} className="col-span-3 focus-visible:ring-yellow-500" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="name">
                                      Product name
                                      </Label>
                                      <FormField
                                      control={productForm.control}
                                      name="productName"
                                      render={({ field }) => (
                                        <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                                          <FormControl>
                                            <Input placeholder={productData?.productName} className="col-span-3 focus-visible:ring-yellow-500"  {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4 ">
                                      <Label htmlFor="name">
                                      Product description
                                      </Label>
                                      <FormField
                                        control={productForm.control}
                                        name="productDescription"
                                        render={({ field }) => (
                                          <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                                            <FormControl>
                                              <Input placeholder={productData?.productDescription} className="col-span-3 focus-visible:ring-yellow-500" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="name">
                                      Product Category
                                      </Label>
                                      <FormField
                                        control={productForm.control}
                                        name="productCategory"
                                        render={({ field }) => (
                                          <FormItem className="col-span-3 focus:ring-yellow-500 focus-visible:ring-yellow-500">
                                            <FormControl>
                                            {/* Todo: find out the reason for the default value not being set */}
                                            <Select onValueChange={field.onChange} {...field} defaultValue={categories[0]?._id} >
                                              <SelectTrigger className="col-span-3 focus:ring-yellow-500 focus-visible:ring-yellow-500">
                                                <SelectValue placeholder="Select a category" />
                                              </SelectTrigger>
                                              <SelectContent {...field} className="focus:ring-yellow-500 focus-visible:ring-yellow-500 active-visible:ring-yellow-500 ">
                                                <SelectGroup {...field}>
                                                  <SelectLabel>Select category</SelectLabel>
                                                  {categories?.map((category: any) => <SelectItem key={category?.categoryName} value={category?._id}>{category?.categoryName}</SelectItem>)}
                                                </SelectGroup>
                                              </SelectContent>
                                            </Select>
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="username">
                                      Images
                                      </Label>
                                      <div className="flex h-full items-center gap-4 flex-wrap justify-between col-span-3">
                                        {productData?.imageUrl?.map(image => <div className="h-14 w-14">
                                          <img src={image?.url} className="rounded-md object-cover w-full h-full" alt="" />
                                        </div>)}
                                      </div>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="username">
                                        Product price
                                      </Label>
                                      <div className="col-span-3 flex gap-2">
                                        <div className="w-[50px] bg-gray-200 flex justify-center text-gray-500 items-center font-semibold rounded-md">
                                          ₹
                                        </div>
                                        <FormField
                                          control={productForm.control}
                                          name="price"
                                          render={({ field }) => (
                                            <FormItem className="w-full">
                                              <FormControl>
                                                <Input placeholder={productData?.price+""} {...field} className="col-span-3 focus-visible:ring-yellow-500" />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                  </div>
                                  <div className="grid grid-cols-4 justify-between items-center gap-4">
                                      <Label htmlFor="stock" className="col-span-1">
                                        Stock
                                      </Label>
                                      <FormField
                                        control={productForm.control}
                                        name="stock"
                                        render={({ field }) => (
                                          <FormItem className="col-span-2 focus-visible:ring-yellow-500">
                                            <FormControl>
                                              <Input placeholder={productData?.stock+""} {...field} className="col-span-3 focus-visible:ring-yellow-500" />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <div className="flex justify-center items-center gap-2 w-full col-span-1">
                                          <Label htmlFor="vegetarian">Vegetarian</Label>
                                          <FormField
                                            control={productForm.control}
                                            name="vegetarian"
                                            render={({ field }) => (
                                              <FormItem className="border-yellow-300 col-span-1 data-[state=checked]:bg-yellow-300 self-end">
                                                <FormControl>
                                                  <Checkbox defaultChecked={productData?.vegetarian} className="border-yellow-300 data-[state=checked]:bg-yellow-300 self-end justify-self-end" checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                      </div>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="weight">
                                        Weight
                                      </Label>
                                      <div className="col-span-3 flex gap-2">
                                        <div className="w-[50px] text-xs bg-gray-200 flex justify-center text-gray-500 items-center font-semibold rounded-md">
                                          gms.
                                        </div>
                                        <FormField
                                          control={productForm.control}
                                          name="weight"
                                          render={({ field }) => (
                                            <FormItem className="w-full">
                                              <FormControl>
                                                <Input placeholder={productData?.weight+""} {...field} className="col-span-3 focus-visible:ring-yellow-500" />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="username">
                                        Dimesions
                                      </Label>
                                      <div className="flex gap-4 col-span-3">
                                          <FormField
                                            control={productForm.control}
                                            name="dimensions.l"
                                            render={({ field }) => (
                                              <FormItem className="w-full focus:ring-yellow-500 focus-visible:ring-yellow-500">
                                                <FormControl>
                                                  <Input placeholder={productData?.dimensions?.l+""} {...field} className="w-full focus:ring-yellow-500 focus-visible:ring-yellow-500" {...field} />
                                                </FormControl>
                                              </FormItem>
                                            )}
                                          />
                                          <div className="flex justify-center text-gray-500 items-center font-semibold rounded-md">x</div>
                                          <FormField
                                            control={productForm.control}
                                            name="dimensions.b"
                                            render={({ field }) => (
                                              <FormItem className="w-full focus:ring-yellow-500 focus-visible:ring-yellow-500">
                                                <FormControl>
                                                  <Input placeholder={productData?.dimensions?.b+""} {...field} className="w-full focus:ring-yellow-500 focus-visible:ring-yellow-500" {...field} />
                                                </FormControl>
                                              </FormItem>
                                            )}
                                          />
                                          <div className="flex justify-center text-gray-500 items-center font-semibold rounded-md">x</div>
                                            <FormField
                                              control={productForm.control}
                                              name="dimensions.h"
                                              render={({ field }) => (
                                                <FormItem className="w-full focus:ring-yellow-500 focus-visible:ring-yellow-500">
                                                  <FormControl>
                                                    <Input placeholder={productData?.dimensions?.h+""} {...field} className="w-full focus:ring-yellow-500 focus-visible:ring-yellow-500"  />
                                                  </FormControl>
                                                </FormItem>
                                              )}
                                            />
                                      </div>
                                  </div>
                                  <Button disabled={isButtonLoading} variant={"ghost"} className="absolute bottom-5 right-5 flex justify-center items-center gap-2 bg-yellow-300 hover:bg-yellow-500 text-white hover:text-white" type="submit">{isButtonLoading ? <Loader2 className="animate-spin" /> : <>Save changes <Save className="w-4 h-4"/></>}</Button>
                                </form>
                                </Form>
                              <DialogFooter>
                              </DialogFooter>
                          </DialogContent>
                      </Dialog>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-0"><Button disabled={isButtonLoading} onClick={async () => {
                      await handleProductDelete();
                    }} className="hover:text-red-500 w-full flex justify-start items-center gap-2" variant={"ghost"}>{!isTrashButtonLoading ? <Trash2 className="w-4 h-4" /> : <LoaderCircle className="w-4 h-4 animate-spin"/>} Delete</Button></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      )
    },
  },
];
 

export function DataTable() {
  const [ sorting, setSorting ] = React.useState<SortingState>([])
  const [ columnFilters, setColumnFilters ] = React.useState<ColumnFiltersState>([]);
  const [ columnVisibility, setColumnVisibility ] = React.useState<VisibilityState>({});
  const [ rowSelection, setRowSelection ] = React.useState({});
  
  const [ productData, setProductData ] = React.useState<IProduct[]>([]);
  const [ categories, setCategories ] = React.useState<ICategory[]>([]);
  
  // const previewRef = React.useRef<HTMLDivElement[]>();

  const [ isButtonLoading, setIsButtonLoading ] = React.useState<boolean>(false);

  React.useEffect(() => {
    (async function () {
      setCategories(await getCategories());
      const data = await getProducts();
      setProductData(data);
      // setProductData(data?.map((data: any) => { 
      //   return {...data, productCategory: (() => {
      //     console.log(categories.length);
      //     if (categories.length === 0) return { categoryName: "error" };
      //     const result: ICategory = categories.filter((category: ICategory) => category?._id! === data.productCategory )[0];
      //     console.log("inside mapCategory: ");
      //     console.log(result);
      //     return result;
      //   })().categoryName!}
      // }));
    })();
  }, []);

  React.useEffect(() => {
    console.log("Categories re-rendered");
  }, [ categories ]);

  const table = useReactTable({
    data: productData,
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
 
  const productCreateForm = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
        // productId: "",
        // productName: "",
        // productDescription: "",
        // productCategory: "",
        // imageUrl: [],
        // price: "0",
        // stock: "0",
        vegetarian: true,
        // dimensions: {
          // l: "0",
          // b: '0',
          // h: "0"
        // },
        // weight: "0",
    }
  });

  const [images, setImages] = React.useState<File[]>([]);
  const [previews, setPreviews] = React.useState<{ blobUrl: string, file: File }[]>([]);
  const [progress, setProgress] = React.useState<number[]>([]);
  const [ isUploadButtonLoading, setIsUploadButtonLoading ] = React.useState<boolean>(false);
  const fileInputRef = React.useRef();
  // const watchImages = productCreateForm.watch("imageUrl");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    productCreateForm.clearErrors("imageUrl");
    if (e?.target?.files) {
      if ( e?.target?.files?.length > 6 ) productCreateForm?.setError("imageUrl", { type: "manual", message: "Please select no more than 6 image(s)!"});
      const selectedFiles = Array.from(e?.target?.files);
      setImages((prev) => [...prev, ...selectedFiles]);

      // Generate previews for the new files
      const newPreviews = selectedFiles.map((file) => { return { blobUrl: URL.createObjectURL(file), file} });
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleImageUpload = async (e: any) => {

    e.preventDefault();
    
    if (images?.length == 0 ) return productCreateForm.setError("imageUrl", { type: "manual", message: "Please select at least one image(s)!"})
    
    console.log(productCreateForm?.getValues()?.imageUrl, previews);
    
    const progressArray = new Array(images?.length).fill(0);
    setProgress(progressArray);
    
    const uploadedImages: { url: string; publicId: string }[] = [];
    
    setIsUploadButtonLoading(true);

    await Promise.all(
      images?.map((image, index) => {
        const formData = new FormData();
        formData?.append("productImages", image);
        // @ts-ignore
        return fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}media/upload`, {
          headers: {
            "filetype": "productImages"
          },
          credentials: 'include',
          method: "POST",
          body: formData,
        }).then((response) => {
          if (!response.ok) throw new Error("Failed to upload image");
          return response.json();
        }).then((data) => {
          uploadedImages.push({ url: data.data.secure_url, publicId: data.data.public_id?.trim() });
          setProgress((prev) => {
            const updatedProgress = [...prev];
            updatedProgress[index] = 100;
            console.log(updatedProgress, productCreateForm.getValues("imageUrl"), data.data.secure_url, data.data.url, data.data.public_id.trim(), data.data);
            return updatedProgress;
          });
          productCreateForm.setValue("imageUrl", uploadedImages);
          productCreateForm.clearErrors("imageUrl");
        }).catch((error) => {
          console.error(`Error uploading image ${index + 1}:`, error);
        }).finally(() => {
          setIsUploadButtonLoading(false);
        });
      })
    );

    console.log(images, previews);
  };

  const renderPreviews = () =>
    previews?.map((preview: { blobUrl: string, file: File }, index: number) => (
      <div key={index} className="rounded-md relative bg-yellow-300/50">
        <img
          src={preview?.blobUrl}
          alt={`Preview ${index}`}
          // style={{ width: "100px", height: "100px", objectFit: "cover" }}
          className="rounded-md object-cover w-14 h-14"
        />
        <button className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2" onClick={(event) => {
          event.preventDefault();
          setPreviews(previews?.filter((item) => item != preview));
          // console.log(previews, fileInputRef.current?.files[0]);
          if ( fileInputRef?.current ) {
            const dataTransfer = new DataTransfer();
            // Add each file to the DataTransfer object
            // @ts-ignore
            const fileList: File[] = fileInputRef?.current?.files!;
            const newFileArray = [...fileList]?.filter( (file: File) => preview.file.name != file.name ); 
            newFileArray.forEach(file => dataTransfer.items.add(file));
            const newFileList = dataTransfer.files; 
            // @ts-ignore
            fileInputRef.current.files = newFileList;
            setImages(newFileArray);
            // @ts-ignore
            console.log(newFileArray, newFileList, fileInputRef.current.files, previews, images);
            
          } 
            
          // productCreateForm.setValue("imageUrl", previews);
        }}>
          <PlusCircle className="w-4 h-4 rotate-45 fill-red-500 stroke-white"/>
        </button>
        {/* <div className={`w-full h-2 bottom-[10%] left-1/2 -translate-x-1/2 absolute bg-purple-600`}
          // style={{
          //   width: "100%",
          //   height: "10px",
          //   backgroundColor: "#f3f3f3",
          //   position: "relative",
          // }}
        >
          <div className={`w-[${progress[index]-10}%] h-full bg-yellow-500`} />
        </div> */}
        <div key={index} className="rounded-full absolute bottom-[10%] left-1/2 w-[80%] -translate-x-1/2" >
          {/* <div>{`${index + 1}`}</div> */}
          <div className="rounded-full bg-gray-300 flex justify-center items-center"
            style={{
              width: "100%",
              height: "8px",
              position: "relative",
            }}
          >
            <div className="bg-yellow-500 rounded-full"
              style={{
                width: `${progress[0]-3}%`,
                height: "80%",
              }}
            />
          </div>
        </div>
      </div>
    ));

  const onProductCreateFormSubmit = async (values: z.infer<typeof productFormSchema>) => {
    // console.log(values);
    values?.imageUrl == undefined && productCreateForm.setError("imageUrl", { type: "manual", message: "Please uplaod the images!"});
    setIsButtonLoading(true);
    try {
      // @ts-ignore
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}products/add-product`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify({ product : {...values, weight: { number: Number(values.weight), unit: "g" }, price: Number(values.price), stock: Number(values.stock), dimensions: { l : Number(values.dimensions.l), b : Number(values.dimensions.b), h : Number(values.dimensions.h)}}})
      });

      const data = await response.json();

      if ( !response.ok ){
        productCreateForm.setError(data.type, { type: "manual", message: data?.errorMessage || "Error while uploading image(s)!" });
        throw new Error("error" + response);
      }

      const products = await getProducts();

      setProductData(products);

      console.log(data);
      setIsDialogOpen(false);
      toast.success(data.message, { description: `${data.data.productId}: ${data.data.productName}`, className: "bg-green-300 font-[quicksand]", icon: <ToastSuccess />});
      productCreateForm.reset();
      setImages([]);
      setPreviews([]);
      setProgress([]);
    } catch (error: any) {
      console.log(error);
      if ( error?.type ) {
        console.log(error);
        productCreateForm.setError(error.type, { type: "manual", message: error.errorMessage });
      }
      toast.error("Error while creating product!", { className: "bg-blue-500 font-[quicksand] font-bold", icon: <ToastFaliure />}, )
    }
    setIsButtonLoading(false);
  };

  const [ isDialogOpen, setIsDialogOpen ] = React.useState(false);
  const [ isMultipleTrashButtonLoading, setIsMultipleTrashButtonLoading ] = React.useState(false);

  const handleDeleteMultipleProducts = async (productIds: string[]) => {
    setIsMultipleTrashButtonLoading(true);
    try {
      // @ts-ignore
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}products/delete-multiple-products`, {
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
  
      const products = await getProducts();
  
      console.log(data, products);
      setProductData(products);
      
      toast.success(data.message, { description: `${data?.data?.deletedCount!} product(s) deleted.`, className: "font-[quicksand]", icon: <ToastSuccess /> });
      // toast.success("Product deleted successfully!", { className: "font-[quicksand]", icon: <ToastSuccess /> });
      // window.location.reload();
    } catch (error: any) {
      console.log(error);
      // toast.error("Product deletion failed!", { description: productData.productName!, className: "font-[quicksand]", icon: <ToastFaliure /> })
      toast.error("Product deletion failed!", { className: "font-[quicksand]", icon: <ToastFaliure /> })
    } finally {
      setIsMultipleTrashButtonLoading(false);
    }
    // setIsTrashButtonLoading(false);
  }

  return (
    <div className="font-[Quicksand] px-2">
      <div className="flex items-center py-4">
        {/* <Input 
          placeholder="Filter through product name..."
          value={(table.getColumn("productName")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("productName")?.setFilterValue(event.target.value);
            // console.log("");
          }}
          className="max-w-sm focus-visible:ring-yellow-500"
        /> */}
        <div className="w-full flex justify-end gap-4 px-4 h-full">
          <Button disabled={isMultipleTrashButtonLoading  || table.getSelectedRowModel().rows.length <= 0} variant={"ghost"} className="bg-red-100 py-2 px-3 hover:bg-red-500 text-red-500 hover:text-white justify-self-end" onClick={ async (event) => {
            event.preventDefault();
            console.log(table.getSelectedRowModel().rows?.map(row => row?.original?._id));
            await handleDeleteMultipleProducts(table.getSelectedRowModel().rows?.map(row => row?.original?._id!));
          }}>{isMultipleTrashButtonLoading ? <LoaderCircle className="animate-spin w-5 h-5" /> : <Trash2 className="w-5 h-5" />}</Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
              <DialogTrigger asChild>
                <Button variant={"ghost"} className="bg-yellow-100 px-2 hover:bg-yellow-300 text-yellow-300 hover:text-white"><Plus /></Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                  <DialogHeader>
                  <DialogTitle>Enter product details</DialogTitle>
                  <DialogDescription>
                    Enter product details to create a product . Click create when you're done.
                  </DialogDescription>
                  </DialogHeader>
                  <Form {...productCreateForm}>
                  <form onSubmit={productCreateForm.handleSubmit(onProductCreateFormSubmit)} className="grid pb-10 grid-cols-2 gap-4 py-4">
                  {/* <form onSubmit={(e) => {
                    e.preventDefault();
                    console.log(productForm.formState.errors)
                  }} className="grid pb-10 gap-4 py-4"> */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name">
                      Product ID
                      </Label>
                      <FormField
                        control={productCreateForm.control}
                        name="productId"
                        render={({ field }) => (
                          <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                            <FormControl>
                              <Input {...field} placeholder="" className="col-span-3 focus-visible:ring-yellow-500" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name">
                        Product name
                        </Label>
                        <FormField
                        control={productCreateForm.control}
                        name="productName"
                        render={({ field }) => (
                          <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                            <FormControl>
                              <Input placeholder="" className="col-span-3 focus-visible:ring-yellow-500"  {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name">
                        Product description
                        </Label>
                        <FormField
                          control={productCreateForm.control}
                          name="productDescription"
                          render={({ field }) => (
                            <FormItem className="col-span-3 focus-visible:ring-yellow-500">
                              <FormControl>
                                <Input className="col-span-3 focus-visible:ring-yellow-500" placeholder=""  {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name">
                        Product Category
                        </Label>
                        <FormField
                          control={productCreateForm.control}
                          name="productCategory"
                          render={({ field }) => (
                            <FormItem className="col-span-3 focus:ring-yellow-500 focus-visible:ring-yellow-500">
                              <FormControl>
                              <Select onValueChange={field.onChange} {...field} defaultValue={""}  >
                                <SelectTrigger className="col-span-3 focus:ring-yellow-500 focus-visible:ring-yellow-500">
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent className="focus:ring-yellow-500 focus-visible:ring-yellow-500 active-visible:ring-yellow-500 ">
                                  <SelectGroup {...field}>
                                    <SelectLabel>Select category</SelectLabel>
                                    {categories?.map((category: any) => <SelectItem key={category._id} value={category._id}>{category.categoryName}</SelectItem>)}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username">
                        Images
                        </Label>
                        <FormField  
                        control={productCreateForm.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem className="col-span-3">
                            <FormControl className="col-span-3 gap-4 w-full">
                              
                              <div className="grid w-full grid-cols-3 gap-4">
                                {previews && previews?.length > 0 && <div className="mt-4 flex col-span-3 gap-4 flex-wrap">
                                  {/* {previews.map((preview, index) => (
                                    <img
                                      src={preview}
                                      alt={`Preview ${index + 1}`}
                                      className="object-cover h-14 aspect-square rounded"
                                    />
                                  ))} */}
                                  {renderPreviews()}
                                </div>}
                                  {/* <div className="mt-5">{renderProgressBars()}</div> */}
                                <div className="flex justify-center items-center gap-4 w-full col-span-3">
                                  <Input placeholder="" type="file" multiple accept="image/*" className={cn("focus-visible:ring-yellow-500 col-span-1")} ref={mergeRefs([field.ref, fileInputRef])} name={field.name} onChange={(event) => {
                                    handleFileChange(event);
                                    console.log(productCreateForm.getValues("imageUrl"));
                                    const files = event.target.files ? Array.from(event.target.files) : [];
                                    const urls = files.map((file) => ({ url: URL.createObjectURL(file) }));
                                    field.onChange([...(field.value || []), ...urls]);
                                  }} />
                                  <Button disabled={isUploadButtonLoading} variant={"ghost"} onClick={handleImageUpload} className="flex justify-center items-center gap-2 col-span-2" >{isUploadButtonLoading ? <><LoaderCircle className="animate-spin" /></> : <>Upload <UploadIcon /></>}</Button>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username">
                          Product price
                        </Label>
                        <div className="col-span-3 flex gap-2">
                          <div className="w-[50px] bg-gray-200 flex justify-center text-gray-500 items-center font-semibold rounded-md">
                            ₹
                          </div>
                          <FormField
                            control={productCreateForm.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormControl>
                                  <Input {...field} className="col-span-3 focus-visible:ring-yellow-500" placeholder=""  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 justify-between items-center gap-4">
                        <Label htmlFor="stock" className="col-span-1">
                          Stock
                        </Label>
                        <FormField
                          control={productCreateForm.control}
                          name="stock"
                          render={({ field }) => (
                            <FormItem className="col-span-2 focus-visible:ring-yellow-500">
                              <FormControl>
                                <Input {...field} className="col-span-3 focus-visible:ring-yellow-500" placeholder=""  />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-center items-center gap-2 w-full col-span-1">
                            <Label htmlFor="vegetarian">Vegetarian</Label>
                            <FormField
                              control={productCreateForm.control}
                              name="vegetarian"
                              render={({ field }) => (
                                <FormItem className="border-yellow-300 col-span-1 data-[state=checked]:bg-yellow-300 self-end">
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
                        <Label htmlFor="weight">
                          Weight
                        </Label>
                        <div className="col-span-3 flex gap-2">
                          <div className="w-[50px] text-xs bg-gray-200 flex justify-center text-gray-500 items-center font-semibold rounded-md">
                            gms.
                          </div>
                          <FormField
                            control={productCreateForm.control}
                            name="weight"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormControl>
                                  <Input pattern="\d*" {...field} className="col-span-3 focus-visible:ring-yellow-500" placeholder=""  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username">
                          Dimesions
                        </Label>
                        <div className="flex gap-4 col-span-3">
                            <FormField
                              control={productCreateForm.control}
                              name="dimensions.l"
                              render={({ field }) => (
                                <FormItem className="w-full focus:ring-yellow-500 focus-visible:ring-yellow-500">
                                  <FormControl>
                                    <Input {...field} className="w-full focus:ring-yellow-500 focus-visible:ring-yellow-500" placeholder="" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex justify-center text-gray-500 items-center font-semibold rounded-md">x</div>
                            <FormField
                              control={productCreateForm.control}
                              name="dimensions.b"
                              render={({ field }) => (
                                <FormItem className="w-full focus:ring-yellow-500 focus-visible:ring-yellow-500">
                                  <FormControl>
                                    <Input {...field} className="w-full focus:ring-yellow-500 focus-visible:ring-yellow-500" {...field} placeholder=""  />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex justify-center text-gray-500 items-center font-semibold rounded-md">x</div>
                              <FormField
                                control={productCreateForm.control}
                                name="dimensions.h"
                                render={({ field }) => (
                                  <FormItem className="w-full focus:ring-yellow-500 focus-visible:ring-yellow-500">
                                    <FormControl>
                                      <Input {...field} className="w-full focus:ring-yellow-500 focus-visible:ring-yellow-500" {...field} placeholder=""  />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                        </div>
                    </div>
                    <Button disabled={isButtonLoading} variant={"ghost"} className="absolute bottom-5 right-5 flex justify-center items-center gap-2 bg-yellow-300 hover:bg-yellow-500 text-white hover:text-white" type="submit">{isButtonLoading ? <Loader2 className="animate-spin" /> : <>Create <PackagePlus className="w-4 h-4"/></>}</Button>
                  </form>
                  </Form>
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
}

export const AllProductsTable = () => {
    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 h-full">
            <DataTable />
        </div>
    );
};