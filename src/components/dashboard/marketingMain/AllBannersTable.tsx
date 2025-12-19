import { ICategory, ISampleBanners, SAMPLE_BANNER_TYPES } from "../../../utils/constants.ts";
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
import { ChevronDown, Loader2, LoaderCircle, MoreHorizontal, PackagePlus, Plus, Trash2, UploadIcon } from "lucide-react"
 
import { Button } from "../../ui/button.tsx"
// import { Checkbox } from "../../ui/checkbox.tsx"
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
import { toast } from "sonner";
import { getCategories, ToastFaliure, ToastSuccess } from "../productMain/AllProductsTable.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "../../ui/form.tsx";
import { FormControl } from "@mui/material";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../ui/select.tsx";
import { ColourInput } from "./ColourInput.tsx";
import { cn } from "../../../lib/utils.ts";
import { optimizeCloudinaryUrl } from "../../../utils/utility-functions.ts";
// import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../ui/select.tsx";
// import { ProductsOrderedTable } from "../deliveryMain/ProductsOrderedTable.tsx";
// import { BannerColourPallete } from "./BannerColourPallete.tsx";
// import { HexColorPicker } from "react-colorful";
// import { Popover, PopoverTrigger, PopoverContent } from "../../ui/popover.tsx";
// import { BannerColourComponent } from "./BannerColourComponent.tsx";

/* Todo: finish product delete and edit, add delete multiple button and update filter feature */

export const bannerFormSchema = z.object({
  imageUrl: z.object({
    url: z.string().min(1, "Please select a file!!"),
    publicId: z.optional(z.string())
    // .min(1, "Public id is required!!")
  }),
  bannerName: z.string().refine((val) => val.length > 0, { message: "Banner name is required!!" }),
  bannerText: z.optional(z.string().refine((val) => val.length > 1, { message: "Banner text is required!!" })),
  bannerCategory: z.optional(z.string()),
  bannerColours: z.optional(z.array(z.string().refine((val) => val.length === 3 || val.length === 6, {
    message: "Must be 3 or 6 characters long",
  })
  .refine((val) => val.length === 3 || val.length === 6, {
    message: "Must be 3 or 6 characters long",
  })
  .refine((val) => /[0-9a-f]+/i.test(val), {
    message: "Must contain only characters (0-9, A-F).",
  })).min(2, "There should be at least two colours")),
  bannerType: z.string().refine((val) => val.length > 0, { message: "Banner type is required!!" }),
  bannerElementUrl: z.optional(z.object({
    url: z.optional(z.string().min(1, "Please select a file!!")),
    publicId: z.optional(z.string())
    // publicId: z.string().min(1, "Public id is required!!")
  })),  
});

// const handleProductEdit = () => {

// };

const getBanners = async () => {
  try {
    // @ts-ignore
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}banners/get-all-banners`, {
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


export const columns: ColumnDef<ISampleBanners>[] = [
  {
    accessorKey: "imageUrl",
    id: "imageUrl",
    header: ({  }) => (<div className="flex items-center gap-2">
        {/* <Checkbox
            checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
        /> */}
        Image
    </div>
      
    ),
    cell: ({ row }) => {
        
        // console.log(row);
        
        const url: string = row.original.imageUrl?.url;
        // console.log(row.original.imageUrl.url);
        return <div className="flex items-center gap-2">
            {/* <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            /> */}
            <img src={optimizeCloudinaryUrl(url)} className="h-10 w-10 object-cover object-center rounded-md" />
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
//   {
//     accessorKey: "customerId",
//     header: "Customer Id",
//     cell: ({ row }) => (
//       <div className="capitalize">{row.getValue("customerId")}</div>
//     ),
//   },
  {
    accessorKey: "bannerName",
    header: "Banner name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("bannerName")}</div>
    ),
  },
  {
    accessorKey: "bannerType",
    header: "Banner type",
    cell: ({ row }) => (
      <div className="">{row.getValue("bannerType")}</div>
    ),
  },
//   {
//     accessorKey: "orderStatus",
//     header: "status",
//     cell: ({ row }) => (
//       <div className="capitalize">{row.getValue("orderStatus")}</div>
//     ),
//   },
//   {
//     accessorKey: "createdAt",
//     header: ({ column }) => {
//           return (
//             <Button
//               className=""
//               variant="ghost"
//               onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//             >
//               Date created
//               <ArrowUpDown className="ml-2 h-4 w-4" />
//             </Button>
//           )
//         },
//     cell: ({ row }) => (
//       <div className="capitalize">{"24-07-2024"}</div>
//     ),
//   },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const banner = row.original
      // console.log(row.original);
      
      // const [ value, setValue ] = React.useState<string>("#ffffff");
      const [ isTrashButtonLoading, setIsTrashButtonLoading ] = React.useState<boolean>(false);

      const handleBannerDelete = async () => {
        setIsTrashButtonLoading(true);
        try {
          // @ts-ignore
        const deleteImageBannerResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}media/delete`, {
            method: "DELETE",
            headers: {
                "publicId" : row.original.imageUrl!.publicId,
                "Content-Type": "application/json",
            },
            credentials: 'include',
        });
        const bannerDelete = await deleteImageBannerResponse.json();
        if ( !deleteImageBannerResponse.ok ) {
          console.log(bannerDelete);
          throw { errors : [bannerDelete?.errors[0]]  };
          return;
        };
        if ( row.original.bannerType == "hero-section-banner" ) {
          // @ts-ignore
          const deleteBannerElementResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}media/delete`, {
              method: "DELETE",
              headers: {
                  "publicId" : row.original.bannerElementUrl!.publicId,
                  "Content-Type": "application/json",
              },
              credentials: 'include',
          });
          if ( !deleteBannerElementResponse.ok ) throw new Error("Banner element deletion failed!");
        }

          // @ts-ignore
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}banners/delete-a-banner/${row.original._id!}`, {
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
      
          // const products = await getBanners();
      
          // console.log(data, products);
          // setProductData(products);
          const updatedCategory =  { banners: [] } ;
        // console.log(updatedCategory, categories, values?.bannerCategory);
          console.log(updatedCategory);
        
          if (banner.bannerType == "category-banner") {
            // @ts-ignore
            const CategoryResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}categories/update-a-category/${row?.original?.bannerCategory!}`, {
              headers: {
                "Content-Type": "application/json",
              },
              credentials: 'include',
              method: "PATCH",
              body: JSON.stringify({ updatedCategoryFromReq: { banners: []} }),
            });
            
            const CategoryData = await CategoryResponse.json();
  
            console.log(data);
            
            if ( !CategoryResponse.ok ) {
              throw {
                error: [CategoryData?.errors?.[0]]
              }
              return;
            }
            console.log(CategoryData.data);
          }

          toast.success("Banner deleted successfully!", { description: row.original.bannerName!, className: "font-[quicksand]", icon: <ToastSuccess /> });
          window.location.reload();
        } catch (error: any) {
          let description = "";
          if ( error.errors ) description = error?.errors[0];
          console.log(error);
          toast.error("Banner deletion failed!", { description: description, className: "font-[quicksand]", icon: <ToastFaliure /> })
        }
        setIsTrashButtonLoading(false);
      };

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
                    {/* <DropdownMenuItem asChild>
                      <Dialog>
                          <DialogTrigger asChild>
                            <Button className="hover:text-yellow-500 w-full grid-cols-3 gap-2 items-center justify-start h-12" variant={"ghost"}>
                              <PencilIcon className="w-4 h-4 col-start-1 col-span-1" />
                              <span className="col-start-2 col-span-2">Edit</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[800px] w-[500px]">
                              <DialogHeader>
                              <DialogTitle>Update this banner</DialogTitle>
                              <DialogDescription>
                                  Make changes to your the banner details here. Click save changes when you're done.
                              </DialogDescription>
                              </DialogHeader>
                              <div className="grid w-full grid-cols-2 gap-4 py-4">
                                <div className="grid col-span-full grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name">
                                        Banner name
                                    </Label>
                                    <Input required
                                        id="name"
                                        defaultValue={banner.bannerText}
                                        className="col-span-3 focus-visible:ring-yellow-500"
                                    />
                                </div>
                                <div className="grid col-span-full grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name">
                                        Banner image
                                    </Label>
                                    <div className="grid col-span-3 grid-cols-3 items-center gap-4 justify-center grid-rows-1 focus-visible:ring-yellow-500">
                                        <Button variant={"ghost"} className="col-start-3 col-span-1 row-span-full flex justify-center items-center gap-2">
                                            Upload
                                            <Upload className="w-4 h-4"/>
                                        </Button>
                                        <img src={banner.imageUrl} alt="" className="col-start-1 rounded-md row-span-1 max-h-20 col-span-2" />
                                    </div>
                                </div>
                                {banner.bannerType === "hero-section-banner" && <div className="grid col-span-full grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name">
                                        Banner element
                                    </Label>
                                    <div className="grid col-span-3 rounded-md grid-cols-3 items-center gap-4 justify-center grid-rows-1 focus-visible:ring-yellow-500">
                                        <Button variant={"ghost"} className="col-start-3 col-span-1 row-span-full flex justify-center items-center gap-2">
                                            Upload
                                            <Upload className="w-4 h-4"/>
                                        </Button>
                                        {(!banner.bannerElementUrl || banner.bannerElementUrl.length === 0) ? <div className="flex justify-center items-center col-start-1 rounded-md row-span-1 max-h-20 h-10 col-span-2 bg-yellow-100">
                                            <ImageOff className="text-yellow-500" />
                                        </div> : <img src={banner?.bannerElementUrl} alt="" className="col-start-1 rounded-md row-span-1 max-h-20 col-span-2" />}
                                        
                                    </div>
                                </div>}
                                <div className="grid col-span-full grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name">
                                        Banner type
                                    </Label>
                                    <Input required disabled
                                        id="name"
                                        defaultValue={banner.bannerType}
                                        className="col-span-3 focus-visible:ring-yellow-500"
                                    />
                                </div>
                              </div>
                              <DialogFooter>
                              <Button variant={"ghost"} onClick={handleProductEdit} className="bg-yellow-300 hover:bg-yellow-500 text-white hover:text-white" type="submit">Save changes</Button>
                              </DialogFooter>
                          </DialogContent>
                      </Dialog>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem className="p-0"><Button disabled={isTrashButtonLoading} onClick={handleBannerDelete} className="hover:text-red-500 w-full flex justify-start items-center gap-2" variant={"ghost"}>{isTrashButtonLoading ? <LoaderCircle className="animate-spin"/> : <Trash2 className="w-4 h-4" />} Delete</Button></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      )
    },
  },
]
 
export function DataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
    
  const bannerCreateForm = useForm<z.infer<typeof bannerFormSchema>>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      bannerCategory: "",
      // bannerName: "",
      // bannerText: "",
      bannerColours: ["fff", "fff"],
      // bannerType: "",
      // bannerElementUrl: {
      //   url: "",
      //   publicId: ""
      // },
      // imageUrl: {
      //   url: "",
      //   publicId: "",
      // }
    }
  });
    
  const [ bannerData, setBannerData ] = React.useState<Array<ISampleBanners>>([]);
  const [ categories, setCategories ] = React.useState<Array<ICategory>>([]);
  const [selectedBannerImage, setSelectedBannerImage ] = React.useState<File | null>(null);
  const [selectedBannerElement, setSelectedBannerElement ] = React.useState<File | null>(null);
  const [ isUploadButtonLoading, setIsUploadButtonLoading ] = React.useState<boolean>(false);
  const [ isElementUploadButtonLoading, setElementIsUploadButtonLoading ] = React.useState<boolean>(false);

  const handleBannerElementChange = (event : any) => {
    if (event.target.files) {
      setSelectedBannerElement(event.target.files[0]);
    }
  };

  const handleBannerImageChange = (event : any) => {
    if (event.target.files) {
      setSelectedBannerImage(event.target.files[0]);
    }
  };

  const handleBannerElementImageUpload = async (event : React.MouseEvent) => {
    event.preventDefault();
    try {
      setElementIsUploadButtonLoading(true);
      if (!selectedBannerElement) {
        throw { errors: ["Please select a banner element first!"]};
      }
      const formData = new FormData();
      formData.append("bannerElement", selectedBannerElement);
      // @ts-ignore
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}media/upload`, {
        headers: {
          // "Content-Type": "application/json",
          "filetype": "bannerElement"
        },
        credentials: 'include',
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();

      console.log(data);
      
      if ( !response.ok )
        throw new Error("Error : "+ response);
      
      console.log(data.data);

      bannerCreateForm.setValue("bannerElementUrl.publicId", data.data.public_id);
      bannerCreateForm.setValue("bannerElementUrl.url", data.data.url);
      toast.success("Banner element uploaded successfully!", { className: "font-[quicksand]", icon: <ToastSuccess />});
      bannerCreateForm.clearErrors("bannerElementUrl.url");

    } catch (error: any) {
      const errData = JSON.stringify(error)
      console.log(errData, error);
      toast.error("Error uploading banner element file", { description: error.errors[0], className: "bg-red-300 font-[quicksand]", icon: <ToastFaliure /> }, );
      setElementIsUploadButtonLoading(false);
    }
    setElementIsUploadButtonLoading(false);
  };

  const handleBannerImageUpload = async (event : React.MouseEvent) => {
    event.preventDefault();
    try {
      setIsUploadButtonLoading(true);
      if (!selectedBannerImage) {
        throw { errors: ["Please select a banner image first!!"]};
      }
      const formData = new FormData();
      formData.append("bannerImage", selectedBannerImage);
      // @ts-ignore
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}media/upload`, {
        headers: {
          // "Content-Type": "application/json",
          "filetype": "bannerImage"
        },
        credentials: 'include',
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();

      console.log(data);
      
      if ( !response.ok )
        throw new Error("Error : "+ response);
      
      console.log(data.data);

      bannerCreateForm.setValue("imageUrl.publicId", data.data.public_id);
      bannerCreateForm.setValue("imageUrl.url", data.data.url);
      toast.success("Banner image uploaded successfully!", { className: "font-[quicksand]", icon: <ToastSuccess />});
      bannerCreateForm.clearErrors("imageUrl.url");
    } catch (error: any) {
      console.log(error);
      toast.error("Error uploading banner image file", { description: "", className: "bg-red-300 font-[quicksand]", icon: <ToastFaliure /> }, );
      setIsUploadButtonLoading(false);
    }
    setIsUploadButtonLoading(false);
  }

  const table = useReactTable({
    data: bannerData,
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
  const [ isDialogOpen, setIsDialogOpen ] = React.useState(false);
  const [ bannertype, setBannertype ] = React.useState<string>("");
  const [ isButtonLoading, setIsButtonLoading ] = React.useState(false);

  const onBannerCreateFormSubmit = async (values: z.infer<typeof bannerFormSchema>) => {
    setIsButtonLoading(true);
    let {bannerCategory, ...formValues} = values;
    try {
      if ( values.bannerType == "hero-section-banner" ) {
        if ( !values?.bannerElementUrl?.url) {
          bannerCreateForm.setError("bannerElementUrl.url", { message: "Required" });
          throw new Error();{ errors: ["Banner element not found!"] };
        }

        if ( !values?.bannerElementUrl?.url?.startsWith("http://res.cloudinary.com") )
          {
            bannerCreateForm.setError("bannerElementUrl.url", { message: "Please upload the banner element file!!" });
            throw new Error();{ errors: ["Banner element not uploaded!"] };
          }
        
        if ( !values?.bannerText ) {
          bannerCreateForm.setError("bannerText", { message: "Required" });
          throw new Error();{ errors: ["Banner text not found!"] }
        }
      }
      if ( values.bannerType == "category-banner" )
      {
        if ( values.bannerCategory == "" || !values.bannerCategory ) {
          bannerCreateForm.setError("bannerCategory", { message: "Please select a banner category!"})
          throw new Error();{ errors: ["Banner text not found!"] }
        }
      }
      if ( !values.imageUrl.publicId ) bannerCreateForm.setError("imageUrl.url", { message: "Error while uploading media"});
      if ( !values?.imageUrl?.url?.startsWith("http://res.cloudinary.com") )
      {
        bannerCreateForm.setError("imageUrl.url", { message: "Please upload the banner image file!!" });
        throw new Error();
      }
      let formdata = bannertype == "category-banner" ? values : formValues;
      // @ts-ignore
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}banners/create-a-banner`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        method: "POST",
        body: JSON.stringify({bannerData: formdata}),
      });
      
      const data = await response.json();

      console.log(data);
      
      if ( !response.ok )
        throw new Error("Error : "+ response);
      
      console.log(data.data);

      if ( values.bannerType == "category-banner" ) {

        const updatedCategory = categories.filter((category: ICategory) => category._id == values?.bannerCategory )[0];
        // console.log(updatedCategory, categories, values?.bannerCategory);
        updatedCategory.banners = data.data._id;
        console.log(updatedCategory);
        
        // @ts-ignore
        const CategoryResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}categories/update-a-category/${values.bannerCategory}`, {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          method: "PATCH",
          body: JSON.stringify({ updatedCategoryFromReq: updatedCategory }),
        });
        
        const CategoryData = await CategoryResponse.json();
  
        console.log(data);
        
        if ( !CategoryResponse.ok )
          throw new Error("Error : failed to update category!\n"+ response);
        
        console.log(CategoryData.data);
      }

      toast.success("Banner created successfully!", { description: values?.bannerName!, icon: <ToastSuccess /> });
      setIsDialogOpen(false);
    } catch (error: any) {
      setIsButtonLoading(false);
      console.log(error);
      let description = "";
      if ( error.errors )
        description = error.errors[0];
      toast.error("Error while creating banner!", { description: description, className: "bg-red-300 font-[quicksand]", icon: <ToastFaliure /> }, );
    }
    console.log("values: ", values);
    setIsButtonLoading(false);
    setBannerData(await getBanners());
  };
 

  React.useEffect(() => {
    (async function () {
      setBannerData(await getBanners());
      setCategories(await getCategories());
    })();
  }, []);

  return (
    <div className="font-[Quicksand] px-2">

      <div className="flex items-center py-4">
      <div className="w-full flex justify-end gap-4 px-4 h-full">
          <Dialog open={isDialogOpen} onOpenChange={() => {
            setIsDialogOpen(!isDialogOpen);
            bannerCreateForm.reset();
          }} >
              <DialogTrigger asChild>
                <Button variant={"ghost"} className="bg-yellow-100 px-2 hover:bg-yellow-300 text-yellow-300 hover:text-white"><Plus /></Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                  <DialogTitle>Enter banner details</DialogTitle>
                  <DialogDescription>
                      Enter banner details to create a banner . Click create when you're done.
                  </DialogDescription>
                  </DialogHeader>
                  <Form {...bannerCreateForm}>
                    <form onSubmit={bannerCreateForm.handleSubmit(onBannerCreateFormSubmit)} className="grid pb-10 gap-4 py-4">                    
                    <div className="w-full items-center grid grid-cols-4">
                      <Label className="col-span-1">
                        Banner name
                      </Label>
                      <FormField  
                        control={bannerCreateForm.control}
                        name="bannerName"
                        render={({ field }) => (
                          <FormItem className="col-span-3">
                            <FormControl className="col-span-3 w-full">
                              <Input placeholder="" className="col-span-3 focus-visible:ring-yellow-500"  {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-full items-center grid grid-cols-4">
                      <Label className="col-span-1">
                        Banner type
                      </Label>
                      <FormField  
                        control={bannerCreateForm.control}
                        name="bannerType"
                        render={({ field }) => (
                          <FormItem className="col-span-3">
                            <FormControl className="col-span-3 w-full">
                            <Select onValueChange={(value) => {
                              setBannertype(value);
                              field.onChange(value);
                            }} defaultValue={""}  >
                                <SelectTrigger className="w-full focus:ring-yellow-500 focus-visible:ring-yellow-500 capitalize">
                                  <SelectValue placeholder="Select a type"/>
                                </SelectTrigger>
                                <SelectContent className="focus:ring-yellow-500 focus-visible:ring-yellow-500 active-visible:ring-yellow-500 ">
                                  <SelectGroup {...field}>
                                    <SelectLabel>Types</SelectLabel>
                                    {SAMPLE_BANNER_TYPES.map((type: string) => <SelectItem key={type} className="capitalize" value={type}>{type.replace(/-/g, ' ')}</SelectItem>)}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {bannertype === "category-banner" && <div className="w-full items-center grid grid-cols-4">
                      <Label className="col-span-1">
                        Banner Category
                      </Label>
                      <FormField  
                        control={bannerCreateForm.control}
                        name="bannerCategory"
                        render={({ field }) => (
                          <FormItem className="col-span-3">
                            <FormControl className="col-span-3 w-full">
                            <Select {...field} onValueChange={(value) => {
                              field.onChange(value);
                            }} defaultValue={""}  >
                                <SelectTrigger className="w-full focus:ring-yellow-500 focus-visible:ring-yellow-500 capitalize">
                                  <SelectValue placeholder="Select a type"/>
                                </SelectTrigger>
                                <SelectContent className="focus:ring-yellow-500 focus-visible:ring-yellow-500 active-visible:ring-yellow-500 ">
                                  <SelectGroup {...field}>
                                    <SelectLabel>Categories</SelectLabel>
                                    {categories.map((category: ICategory) => <SelectItem key={category._id} className="capitalize" value={category._id}>{category.categoryName}</SelectItem>)}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>}
                    {bannertype == "hero-section-banner" && <div className="w-full items-center grid grid-cols-4">
                      <Label className="col-span-1">
                        Banner text
                      </Label>
                      <FormField  
                        control={bannerCreateForm.control}
                        name="bannerText"
                        render={({ field }) => (
                          <FormItem className="col-span-3">
                            <FormControl className="col-span-3 w-full">
                              <Input placeholder="" className="col-span-3 focus-visible:ring-yellow-500"  {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>}
                    {bannertype == "hero-section-banner" && <div className="w-full items-center grid grid-cols-4">
                      <Label className="col-span-1">
                        Banner colours
                      </Label>
                      <div className="col-span-3 flex gap-4">
                        <FormField  
                          control={bannerCreateForm.control}
                          name="bannerColours.0"
                          render={({ field }) => (
                            <FormItem className="">
                              <FormControl className="">
                                <ColourInput placeholder="DBD3D3" className="focus-visible:ring-yellow-500" field={field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField  
                          control={bannerCreateForm.control}
                          name="bannerColours.1"
                          render={({ field }) => (
                            <FormItem className="">
                              <FormControl className="">
                                <ColourInput placeholder="DBD3D3" className="focus-visible:ring-yellow-500"  field={field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>}
                    <div className="w-full items-center grid grid-cols-4">
                      <Label className="col-span-1">
                        Banner image
                      </Label>
                      <FormField  
                        control={bannerCreateForm.control}
                        name="imageUrl.url"
                        render={({ field }) => (
                          <FormItem className="col-span-3">
                            <FormControl className="col-span-3 gap-4 w-full">
                              <div className="flex w-full gap-4">
                                <img src={bannerCreateForm.getValues("imageUrl.url")} className={cn("rounded-md w-1/3 object-contain flex-1")} alt="" />
                                <Input placeholder="" type="file" accept="image/*" className={cn("focus-visible:ring-yellow-500 col-span-3")} ref={field.ref} name={field.name} onChange={(event) => {
                                  handleBannerImageChange(event);
                                  field.onChange(event);
                                }} />
                                <Button disabled={isUploadButtonLoading} variant={"ghost"} className="flex justify-center items-center gap-2 col-span-2" onClick={handleBannerImageUpload}>Upload {isUploadButtonLoading ? <LoaderCircle className="animate-spin"/> : <UploadIcon />}</Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {bannertype == "hero-section-banner" && <div className="w-full items-center grid grid-cols-4">
                      <Label className="col-span-1">
                        Banner element
                      </Label>
                      <FormField  
                        control={bannerCreateForm.control}
                        name="bannerElementUrl.url"
                        render={({ field }) => (
                          <FormItem className="col-span-3">
                            <FormControl className="col-span-3 w-full">
                              <div className="flex w-full gap-4">
                                <img src={bannerCreateForm.getValues("bannerElementUrl.url")} className={cn("rounded-md aspect-square max-h-10 object-contain flex-1")} alt="" />
                                <Input placeholder="" accept="image/*" type="file" className="focus-visible:ring-yellow-500" ref={field.ref} name={field.name} onChange={(event) => {
                                  handleBannerElementChange(event);
                                  field.onChange(event);
                                }} />
                                <Button disabled={isElementUploadButtonLoading} variant={"ghost"} className="flex justify-center items-center gap-2"  onClick={handleBannerElementImageUpload}>Upload { isElementUploadButtonLoading ? <LoaderCircle className="animate-spin"/> : <UploadIcon />}</Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>}
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

export const AllBannersTable = () => {
    
    return (
        <div className="w-full h-[calc(100%-96px)] overflow-y-scroll scrollbar-thin scrollbar-thumb-yellow-300 scrollbar-thumb-rounded-full scrollbar-track-transparent">
            <DataTable />
        </div>
    );
};