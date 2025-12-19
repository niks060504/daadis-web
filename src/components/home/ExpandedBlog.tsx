//expandedBlog.tsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux1/store"; // Adjust path as needed
import { 
  getBlogById, 
  selectCurrentBlog, 
  selectBlogsLoading, 
  selectBlogsError,
  clearCurrentBlog 
} from "../../redux1/blogSlice"; // Adjust path as needed
import { toast } from "sonner";
import { ToastFaliure } from "../dashboard/productMain/AllProductsTable";
import parse from 'html-react-parser';

export const Expandedblog = () => {
    const { blogId } = useParams<{ blogId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    
    // Get state from Redux store
    const blog = useSelector(selectCurrentBlog);
    const isLoading = useSelector(selectBlogsLoading);
    const error = useSelector(selectBlogsError);

    useEffect(() => {
        if (blogId) {
            // Clear any previous blog data
            dispatch(clearCurrentBlog());
            // Fetch the blog by ID
            dispatch(getBlogById(blogId));
        }
    }, [blogId, dispatch]);

    useEffect(() => {
        // Show error toast if there's an error
        if (error) {
            toast.error("Error while fetching the blog!", { 
                description: error, 
                className: "bg-red-300 font-[quicksand]", 
                icon: <ToastFaliure /> 
            });
        }
    }, [error]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            dispatch(clearCurrentBlog());
        };
    }, [dispatch]);

    if (isLoading) {
        return (
            <div className="w-full min-h-[calc(100vh-56px)] mt-14 p-[2%] flex gap-4 justify-center items-center flex-col">
                <img src="/public/loader.svg" alt="Loading..." />
                <p className="font-[quicksand] text-gray-600">Loading blog...</p>
            </div>
        );
    }

    if (error && !blog) {
        return (
            <div className="w-full min-h-[calc(100vh-56px)] mt-14 p-[2%] flex gap-4 justify-center items-center flex-col">
                <div className="text-center">
                    <h2 className="font-[quicksand] font-bold text-2xl text-red-600 mb-2">
                        Failed to Load Blog
                    </h2>
                    <p className="font-[quicksand] text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={() => blogId && dispatch(getBlogById(blogId))}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-[quicksand]"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="w-full min-h-[calc(100vh-56px)] mt-14 p-[2%] flex gap-4 justify-center items-center flex-col">
                <div className="text-center">
                    <h2 className="font-[quicksand] font-bold text-2xl text-gray-600">
                        Blog not found
                    </h2>
                    <p className="font-[quicksand] text-gray-500">
                        The requested blog could not be found.
                    </p>
                </div>
            </div>
        );
    }

    // Get the content from the appropriate field
    const getContentToRender = () => {
        // First try to get content from blogContent.markup (new structure)
        if (blog.blogContent?.markup) {
            return blog.blogContent.markup;
        }
        // Fallback to content field (old structure)
        if (blog.content) {
            return blog.content;
        }
        return '<p>No content available.</p>';
    };

    const contentToRender = getContentToRender();

    return (
        <div className="w-full min-h-[calc(100vh-56px)] mt-14 p-[2%] flex gap-4 flex-col">
            <div id="heading" className="flex w-full h-[300px] inset-0 bg-gradient-to-t from-white from-5% relative justify-center items-center">
                {blog.blogImgUrl?.url && (
                    <img 
                        src={blog.blogImgUrl.url} 
                        className="absolute backdrop-blur-lg rounded-t-lg w-full h-full top-0 left-0 object-cover z-[-1]" 
                        alt={blog.title}
                    />
                )}
                <h2 className="font-[quicksand] font-bold text-5xl text-center mix-blend-difference invert">
                    {blog.title}
                </h2>
            </div>
            
            <div className="rounded-lg prose prose-lg max-w-none">
                {parse(contentToRender)}
            </div>
            
            {blog.createdAt && (
                <div className="text-sm text-gray-500 font-[quicksand] mt-4">
                    Published: {new Date(blog.createdAt).toLocaleDateString()}
                </div>
            )}

            {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                <div className="text-sm text-gray-500 font-[quicksand]">
                    Last updated: {new Date(blog.updatedAt).toLocaleDateString()}
                </div>
            )}
        </div>
    );
};