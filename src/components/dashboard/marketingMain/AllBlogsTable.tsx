import { ISampleBlogs } from "../../../utils/constants.ts";
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
import { ChevronDown, Loader2, LoaderCircle, MoreHorizontal, PencilIcon, Plus, SaveIcon, Trash2, UploadIcon } from "lucide-react"

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
} from "../../ui/dropdown-menu.tsx";
import { Input } from "../../ui/input.tsx";
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
import { ToastFaliure, ToastSuccess } from "../productMain/AllProductsTable.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "../../ui/form.tsx";
import { FormControl } from "@mui/material";
import { cn } from "../../../lib/utils.ts";
import EmailEditor, { EditorRef, EmailEditorProps } from "react-email-editor";
// import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../ui/select.tsx";
// import { ProductsOrderedTable } from "../deliveryMain/ProductsOrderedTable.tsx";
// import { BannerColourPallete } from "./BannerColourPallete.tsx";
// import { HexColorPicker } from "react-colorful";
// import { Popover, PopoverTrigger, PopoverContent } from "../../ui/popover.tsx";
// import { BannerColourComponent } from "./BannerColourComponent.tsx";

/* Todo: finish product delete and edit, add delete multiple button and update filter feature */

export const blogFormSchema = z.object({
  blogImgUrl: z.object({
    url: z.string(),
    publicId: z.optional(z.string()),
  }),
  blogName: z.string().min(1, { message: "Blog name should be at least 1 character long!" }).max(30, { message: "Blog name cannot be more than 30 characters!"}),
  title: z.string().min(1, { message: "Blog title shoud be at least 1 character long" }),
  blogContent: z.object({
    design: z.unknown(),
    markup: z.string(),
  })
});

const getBlogs = async () => {
  try {
    // @ts-ignore
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}blogs/get-all-blogs`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
    });

    const data = await response.json();
    
    if ( !response.ok )
      throw new Error("error" + response);

    console.log(data.data);
    return data.data;
  } catch (error: any) {
    console.log(error);
    toast.error("Error while fetching product list, refresh!", { description: error, className: "bg-red-300 font-[quicksand]", icon: <ToastFaliure /> }, );
    return error;
  }
};


export const columns: ColumnDef<ISampleBlogs>[] = [
  {
    accessorKey: "blogImgUrl",
    id: "blogImgUrl",
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
        
        const url: string = row.original.blogImgUrl.url;

        return <div className="flex items-center gap-2">
            {/* <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            /> */}
            <img src={url} className="h-10 w-10 object-cover rounded-md" />
        </div>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "blogName",
    header: "Blog name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("blogName")}</div>
    ),
  },
  {
    accessorKey: "title",
    header: "Blog title",
    cell: ({ row }) => (
      <div className="">{row.getValue("title")}</div>
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
      const blog = row.original;
      // console.log(row.original);
      
      // const [ value, setValue ] = React.useState<string>("#ffffff");
      const [ isTrashButtonLoading, setIsTrashButtonLoading ] = React.useState<boolean>(false);
      const [ isButtonLoading, setIsButtonLoading ] = React.useState<boolean>(false);
      const [ selectedBlogImage, setSelectedBlogImage ] = React.useState<File | null>(null);
      const [ isUploadButtonLoading, setIsUploadButtonLoading ] = React.useState<boolean>(false);

      const handleBlogImageChange = (event : any) => {
        if (event.target.files) {
          setSelectedBlogImage(event.target.files[0]);
        }
      };
      const blogEditForm = useForm<z.infer<typeof blogFormSchema>>({
        resolver: zodResolver(blogFormSchema),
        defaultValues: {
          blogContent: blog.blogContent,
          blogImgUrl: blog.blogImgUrl,
          blogName: blog.blogName,
          title: blog.title
        }
      });

      const handleBlogImageUpload = async (event : React.MouseEvent) => {
        event.preventDefault();
        try {
          setIsUploadButtonLoading(true);
          if (!selectedBlogImage) {
            throw { errors: ["Please select a blog image first!!"]};
          }
          const formData = new FormData();
          formData.append("blogCover", selectedBlogImage);
          // @ts-ignore
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}media/upload`, {
            headers: {
              // "Content-Type": "application/json",
              "filetype": "blogCover"
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
    
          blogEditForm.setValue("blogImgUrl.publicId", data.data.public_id);
          blogEditForm.setValue("blogImgUrl.url", data.data.url);
          toast.success("Blog image uploaded successfully!", { className: "font-[quicksand]", icon: <ToastSuccess />});
          blogEditForm.clearErrors("blogImgUrl.url");
        } catch (error: any) {
          console.log(error);
          const description = (error?.errors[0]) ? error?.errors[0] : "";
          toast.error("Error uploading blog image file", { description: description, className: "bg-red-300 font-[quicksand]", icon: <ToastFaliure /> }, );
          setIsUploadButtonLoading(false);
        }
        setIsUploadButtonLoading(false);
      }
      
      const onBlogEditFormSubmit = async (values: z.infer<typeof blogFormSchema>) => {
        setIsButtonLoading(true);
        try {
          if ( !values?.blogImgUrl?.url?.startsWith("http://res.cloudinary.com") ) {
            blogEditForm.setError("blogImgUrl.url", { message: "Please upload the blog image file!!" });
            throw new Error();
          }
          // @ts-ignore
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}blogs/update-a-blog/${blog._id}`, {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include',
            method: "PATCH",
            body: JSON.stringify({ updatedBlog: values }),
          });
          
          const data = await response.json();
    
          console.log(data);
          
          if ( !response.ok )
            throw new Error("Error : "+ response);
          
          console.log(data.data);
    
          toast.success("Blog edited successfully!", { description: data.data.blogName || "", className: "bg-red-300 font-[quicksand]", icon: <ToastSuccess /> }, );
          window.location.reload();
        } catch (error: any) {
          setIsButtonLoading(false);
          let description = "";
          if ( error?.errors[0] )
            description = error?.errors[0];
          toast.error("Error while creating blog!", { description: description || "", className: "bg-red-300 font-[quicksand]", icon: <ToastFaliure /> }, );
        }
        setIsButtonLoading(false);
      };

      const handleBlogDelete = async (event: any) => {
        setIsTrashButtonLoading(true);
        event.preventDefault();
        try {
          // @ts-ignore
          const deleteBlogImageResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}media/delete`, {
              method: "DELETE",
              headers: {
                  "publicId" : blog.blogImgUrl.publicId,
                  "Content-Type": "application/json",
              },
              credentials: 'include',
          });
          if ( !deleteBlogImageResponse.ok ) throw new Error("blog image deletion failed!");
          // @ts-ignore
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}blogs/delete-a-blog/${blog._id!}`, {
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
          toast.success("Blog deleted successfully!", { description: row.original.blogName!, className: "font-[quicksand]", icon: <ToastSuccess /> });
          window.location.reload();
        } catch (error: any) {
          setIsTrashButtonLoading(false);
          console.log(error);
          const description = (error?.errors[0]) ? error?.errors[0] : "";
          toast.error("Blog deletion failed!", { description: description, className: "font-[quicksand]", icon: <ToastFaliure /> })
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
                    <DropdownMenuItem asChild>
                    <Dialog>
                          <DialogTrigger asChild>
                            <Button className="hover:text-yellow-500 w-full grid-cols-3 gap-2 items-center justify-start h-12" variant={"ghost"}>
                              <PencilIcon className="w-4 h-4 col-start-1 col-span-1" />
                              <span className="col-start-2 col-span-2">Edit</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[1200px]">
                              <DialogHeader>
                              <DialogTitle>Update your blog details</DialogTitle>
                              <DialogDescription>
                                  Make changes to your the blog details here. Click save changes when you're done.
                              </DialogDescription>
                              </DialogHeader>
                              <Form {...blogEditForm}>
                                <form onSubmit={blogEditForm.handleSubmit(onBlogEditFormSubmit)} className="flex flex-col pb-10 gap-4 py-4">
                                    <div className="flex gap-4">
                                      <div className="grid flex-1 grid-cols-4 items-center gap-4 col-span-2">
                                          <Label className="col-span-1">
                                              Blog name
                                          </Label>
                                          <FormField
                                              control={blogEditForm.control}
                                              name="blogName"
                                              defaultValue={blog.blogName}
                                              render={({ field }) => (
                                                  <FormItem className="col-span-3">
                                                      <FormControl className="w-full col-span-3">
                                                          <Input {...field} className="col-span-3 focus-visible:ring-yellow-500" />
                                                      </FormControl>
                                                      <FormMessage />
                                                  </FormItem>
                                              )}
                                          />
                                      </div>
                                      <div className="grid flex-1 grid-cols-4 items-center gap-4 col-span-2">
                                          <Label className="col-span-1">
                                              Title
                                          </Label>
                                          <FormField
                                              control={blogEditForm.control}
                                              defaultValue={blog.title}
                                              name="title"
                                              render={({ field }) => (
                                                  <FormItem className="col-span-3">
                                                      <FormControl className="w-full col-span-3">
                                                          <Input {...field} className="col-span-3 focus-visible:ring-yellow-500" />
                                                      </FormControl>
                                                      <FormMessage />
                                                  </FormItem>
                                              )}
                                          />
                                      </div>
                                      <div className="w-full flex-1 items-center grid grid-cols-4">
                                        <Label className="col-span-1">
                                          Banner image
                                        </Label>
                                        <FormField  
                                          control={blogEditForm.control}
                                          name="blogImgUrl.url"
                                          defaultValue={blog.blogImgUrl.url}
                                          render={({ field }) => (
                                            <FormItem className="col-span-3">
                                              <FormControl className="col-span-3 gap-4 w-full">
                                                <div className="flex w-full gap-4">
                                                  <img src={blog.blogImgUrl.url} className={cn("rounded-md w-1/3 object-contain flex-1")} alt="" />
                                                  <Input placeholder="" type="file" accept="image/*" className={cn("focus-visible:ring-yellow-500 col-span-3")} ref={field.ref} name={field.name} onChange={(event) => {
                                                    handleBlogImageChange(event);
                                                    field.onChange(event);
                                                  }} />
                                                  <Button disabled={isUploadButtonLoading} variant={"ghost"} className="flex justify-center items-center gap-2 col-span-2" onClick={handleBlogImageUpload}>Upload {isUploadButtonLoading ? <LoaderCircle className="animate-spin"/> : <UploadIcon />}</Button>
                                                </div>
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4 col-span-2">
                                        <Label className="col-span-1">
                                            Blog content
                                        </Label>
                                        <FormField
                                            control={blogEditForm.control}
                                            name="blogContent.markup"
                                            render={({ field }) => {
                                        
                                              const blogEditorRef = React.useRef<EditorRef>(null);
                                              
                                              const exportHtml = () => {
                                                const unlayer = blogEditorRef?.current?.editor;
                                        
                                                unlayer?.exportHtml((data: any) => {
                                                    const { design, html } = data;
                                                    console.log(design, html);
                                                    blogEditForm.setValue("blogContent.markup", html);
                                                });
                                              };
                                          
                                              const saveDesign = () => {
                                                  const unlayer = blogEditorRef?.current?.editor;
                                          
                                                  unlayer?.saveDesign((data: any) => {
                                                      blogEditForm.setValue("blogContent.design", data);
                                                  });
                                              };

                                              const onReady: EmailEditorProps['onReady'] = (unlayer) => {
                                                // editor is ready
                                                // you can load your template here;
                                                // the design json can be obtained by calling
                                                // unlayer.loadDesign(callback) or unlayer.exportHtml(callback)
                                            
                                                // const templateJson = { DESIGN JSON GOES HERE };
                                                // @ts-ignore
                                                unlayer.loadDesign(blog.blogContent.design);
                                              };

                                              return (
                                                <FormItem className="col-span-full">
                                                    <FormControl className="w-full col-span-full ">
                                                      <div className="w-full border bg-yellow-100 rounded-lg">
                                                          <Button className="mb-4 flex items-center justify-center gap-2 bg-yellow-100 hover:bg-yellow-300 text-yellow-300 hover:text-white absolute left-2 top-2" onClick={(e) => {    
                                                              e.preventDefault();
                                                              exportHtml();
                                                              saveDesign();
                                                              console.log(blogEditForm.getValues());
                                                          }} variant={"ghost"}>Save <SaveIcon className="w-4 h-4"/></Button>
                                                          <EmailEditor onReady={onReady} {...field} minHeight={400} style={{
                                                              width: "50px"
                                                          }} ref={blogEditorRef} />
                                                      </div>
                                                        {/* <Input {...field} className="col-span-3 focus-visible:ring-yellow-500" /> */}
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                              )
                                            }}
                                        />
                                    </div>
                                    <Button disabled={isButtonLoading} variant={"ghost"} className="absolute bottom-5 right-5 flex justify-center items-center gap-2 bg-yellow-300 hover:bg-yellow-500 text-white hover:text-white" type="submit">{isButtonLoading ? <Loader2 className="animate-spin" /> : <>Save changes <SaveIcon className="w-4 h-4"/></>}</Button>
                                </form>
                            </Form>
                              <DialogFooter>
                              {/* <Button variant={"ghost"} onClick={handleProductEdit} className="bg-yellow-300 hover:bg-yellow-500 text-white hover:text-white" type="submit">Save changes</Button> */}
                              </DialogFooter>
                          </DialogContent>
                      </Dialog>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-0"><Button onClick={handleBlogDelete} disabled={isTrashButtonLoading} className="hover:text-red-500 w-full flex justify-start items-center gap-2" variant={"ghost"}>{isTrashButtonLoading ? <LoaderCircle className="w-4 h-4 animate-spin"/> : <Trash2 className="w-4 h-4" />} Delete</Button></DropdownMenuItem>
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
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
    
  const blogCreateForm = useForm<z.infer<typeof blogFormSchema>>({
    resolver: zodResolver(blogFormSchema),
  });
    
  const [ blogData, setBlogData ] = React.useState<Array<ISampleBlogs>>([]);
  const [ isButtonLoading, setIsButtonLoading ] = React.useState(false); 
  
  const table = useReactTable({
    data: blogData,
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

  const [ isUploadButtonLoading, setIsUploadButtonLoading ] = React.useState<boolean>(false);
  const [selectedBlogImage, setSelectedBlogImage ] = React.useState<File | null>(null);
  
  const handleBlogImageChange = (event : any) => {
    if (event.target.files) {
      setSelectedBlogImage(event.target.files[0]);
    }
  };

  const handleBlogImageUpload = async (event : React.MouseEvent) => {
    event.preventDefault();
    try {
      setIsUploadButtonLoading(true);
      if (!selectedBlogImage) {
        throw { errors: ["Please select a blog image first!!"]};
      }
      const formData = new FormData();
      formData.append("blogCover", selectedBlogImage);
      // @ts-ignore
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}media/upload`, {
        headers: {
          // "Content-Type": "application/json",
          "filetype": "blogCover"
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

      blogCreateForm.setValue("blogImgUrl.publicId", data.data.public_id);
      blogCreateForm.setValue("blogImgUrl.url", data.data.url);
      toast.success("Blog image uploaded successfully!", { className: "font-[quicksand]", icon: <ToastSuccess />});
      blogCreateForm.clearErrors("blogImgUrl.url");
    } catch (error: any) {
      console.log(error);
      const description = (error?.errors[0]) ? error?.errors[0] : "";
      toast.error("Error uploading blog image file", { description: description, className: "bg-red-300 font-[quicksand]", icon: <ToastFaliure /> }, );
      setIsUploadButtonLoading(false);
    }
    setIsUploadButtonLoading(false);
  };

  const onBlogCreateFormSubmit = async (values: z.infer<typeof blogFormSchema>) => {
    setIsButtonLoading(true);
    try {
      if ( !values?.blogImgUrl?.url?.startsWith("http://res.cloudinary.com") ) {
        blogCreateForm.setError("blogImgUrl.url", { message: "Please upload the blog image file!!" });
        throw new Error();
      }
      // @ts-ignore
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}blogs/create-a-blog`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        method: "POST",
        body: JSON.stringify({ blogData: values }),
      });
      
      const data = await response.json();

      console.log(data);
      
      if ( !response.ok )
        throw new Error("Error : "+ response);
      
      console.log(data.data);

      toast.success("Blog created successfully!", { description: data.data.blogName || "", className: "bg-red-300 font-[quicksand]", icon: <ToastSuccess /> }, );
      blogCreateForm.reset();
    } catch (error: any) {
      setIsButtonLoading(false);
      const description = (error?.errors[0]) ? error?.errors[0] : "";
      toast.error("Error while creating blog!", { description: description || "", className: "bg-red-300 font-[quicksand]", icon: <ToastFaliure /> }, );
    }
    console.log("values: ", values);
    setIsButtonLoading(false);
    setIsDialogOpen(false);
    setBlogData(await getBlogs());
    console.log(values);
  };
 

  React.useEffect(() => {
    (async function () {
      setBlogData(await getBlogs());
    })();
  }, []);

  const [ isDialogOpen, setIsDialogOpen ] = React.useState(false);

  return (
    <div className="font-[Quicksand] px-2">
      <div className="flex items-center py-4">
      <div className="w-full flex justify-end gap-4 px-4 h-full">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant={"ghost"} className="bg-yellow-100 px-2 hover:bg-yellow-300 text-yellow-300 hover:text-white"><Plus /></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[1200px]">
                  <DialogHeader>
                  <DialogTitle>Enter blog details</DialogTitle>
                  <DialogDescription>
                      Enter blog details to create a blog . Click create when you're done.
                  </DialogDescription>
                  </DialogHeader>
                    <Form {...blogCreateForm}>
                        <form onSubmit={blogCreateForm.handleSubmit(onBlogCreateFormSubmit)} className="flex flex-col pb-10 gap-4 py-4">
                            <div className="flex gap-4">
                              <div className="grid flex-1 grid-cols-4 items-center gap-4 col-span-2">
                                  <Label className="col-span-1">
                                      Blog name
                                  </Label>
                                  <FormField
                                      control={blogCreateForm.control}
                                      name="blogName"
                                      render={({ field }) => (
                                          <FormItem className="col-span-3">
                                              <FormControl className="w-full col-span-3">
                                                  <Input {...field} className="col-span-3 focus-visible:ring-yellow-500" />
                                              </FormControl>
                                              <FormMessage />
                                          </FormItem>
                                      )}
                                  />
                              </div>
                              <div className="grid flex-1 grid-cols-4 items-center gap-4 col-span-2">
                                  <Label className="col-span-1">
                                      Title
                                  </Label>
                                  <FormField
                                      control={blogCreateForm.control}
                                      name="title"
                                      render={({ field }) => (
                                          <FormItem className="col-span-3">
                                              <FormControl className="w-full col-span-3">
                                                  <Input {...field} className="col-span-3 focus-visible:ring-yellow-500" />
                                              </FormControl>
                                              <FormMessage />
                                          </FormItem>
                                      )}
                                  />
                              </div>
                              <div className="w-full flex-1 items-center grid grid-cols-4">
                                <Label className="col-span-1">
                                  Banner image
                                </Label>
                                <FormField  
                                  control={blogCreateForm.control}
                                  name="blogImgUrl.url"
                                  render={({ field }) => (
                                    <FormItem className="col-span-3">
                                      <FormControl className="col-span-3 gap-4 w-full">
                                        <div className="flex w-full gap-4">
                                          <img src={blogCreateForm.getValues("blogImgUrl.url")} className={cn("rounded-md w-1/3 object-contain flex-1")} alt="" />
                                          <Input placeholder="" type="file" accept="image/*" className={cn("focus-visible:ring-yellow-500 col-span-3")} ref={field.ref} name={field.name} onChange={(event) => {
                                            handleBlogImageChange(event);
                                            field.onChange(event);
                                          }} />
                                          <Button disabled={isUploadButtonLoading} variant={"ghost"} className="flex justify-center items-center gap-2 col-span-2" onClick={handleBlogImageUpload}>Upload {isUploadButtonLoading ? <LoaderCircle className="animate-spin"/> : <UploadIcon />}</Button>
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4 col-span-2">
                                <Label className="col-span-1">
                                    Blog content
                                </Label>
                                <FormField
                                    control={blogCreateForm.control}
                                    name="blogContent.markup"
                                    render={({ field }) => {
                                
                                      const blogEditorRef = React.useRef<EditorRef>(null);
                                      
                                      const exportHtml = () => {
                                        const unlayer = blogEditorRef?.current?.editor;
                                
                                        unlayer?.exportHtml((data: any) => {
                                            const { design, html } = data;
                                            console.log(design, html);
                                            blogCreateForm.setValue("blogContent.markup", html);
                                        });
                                      };
                                  
                                      const saveDesign = () => {
                                          const unlayer = blogEditorRef?.current?.editor;
                                  
                                          unlayer?.saveDesign((data: any) => {
                                              blogCreateForm.setValue("blogContent.design", data);
                                          });
                                      };

                                      return (
                                        <FormItem className="col-span-full">
                                            <FormControl className="w-full col-span-full ">
                                              <div className="w-full border bg-yellow-100 rounded-lg">
                                                  <Button className="mb-4 flex items-center justify-center gap-2 bg-yellow-100 hover:bg-yellow-300 text-yellow-300 hover:text-white absolute left-2 top-2" onClick={(e) => {    
                                                      e.preventDefault();
                                                      exportHtml();
                                                      saveDesign();
                                                      console.log(blogCreateForm.getValues());
                                                  }} variant={"ghost"}>Save <SaveIcon className="w-4 h-4"/></Button>
                                                  <EmailEditor {...field} minHeight={400} style={{
                                                      width: "50px"
                                                  }} ref={blogEditorRef} />
                                              </div>
                                                {/* <Input {...field} className="col-span-3 focus-visible:ring-yellow-500" /> */}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                      )
                                    }}
                                />
                            </div>
                            <Button disabled={isButtonLoading} variant={"ghost"} className="absolute bottom-5 right-5 flex justify-center items-center gap-2 bg-yellow-300 hover:bg-yellow-500 text-white hover:text-white" type="submit">{isButtonLoading ? <Loader2 className="animate-spin" /> : <>Create <Plus className="w-4 h-4"/></>}</Button>
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
  );
}

export const AllBlogsTable = () => {
    return (
        <div className="w-full h-[calc(100%-96px)] overflow-y-scroll scrollbar-thin scrollbar-thumb-yellow-300 scrollbar-thumb-rounded-full scrollbar-track-transparent">
            <DataTable />
        </div>
    );
};