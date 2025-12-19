// WishListPage.tsx
import { ChevronLeft, Loader2, X } from "lucide-react";
import { Button } from "../ui/button";
import {  useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux1/store";
import { User } from "../../redux1/authSlice";
import {
  WishlistItem,
  fetchWishlist,
  removeFromWishlist,
  selectWishlistItems,
  selectWishlistLoading,
} from "../../redux1/wishlistSlice";
import { CartItem, addToCart, selectCartItems } from "../../redux1/cartSlice";
import { Product, getProductById } from "../../redux1/productSlice";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

interface WishListCardProps {
  user: User | null;
  wishListItem: WishlistItem;
  cart: CartItem[];
  productDetails: Product | null;
}

const WishListCard = ({ user, wishListItem, cart, productDetails }: WishListCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Get user authentication status
  const isAuthenticated = !!user;

  // WishlistItem has `product` as string representing product ID
  const prodId = wishListItem.product;
  // Check if product is in cart
  const inCart = cart.some((ci) => ci.product === prodId);

  const onRemove = async () => {
    // Check if user is authenticated before removing
    if (!isAuthenticated) {
      toast.error("Please login to manage your wishlist");
      navigate('/auth');
      return;
    }
    
    setLoading(true);
    try {
      if (user?._id) {
        await dispatch(removeFromWishlist(prodId)).unwrap();
        toast.success("Removed from Wishlist");
      } else {
        // Guest user fallback - update localStorage
        const stored = JSON.parse(localStorage.getItem("wishlist") || "[]") as WishlistItem[];
        const updated = stored.filter((w) => w.product !== prodId);
        localStorage.setItem("wishlist", JSON.stringify(updated));
        toast.success("Removed from Wishlist");
        // Force page refresh for guest users
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    } finally {
      setLoading(false);
    }
  };

  const onMoveToCart = async () => {
    // Check if user is authenticated before adding to cart
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate('/auth');
      return;
    }
    
    setLoading(true);
    try {
      await dispatch(addToCart({ product: prodId, quantity: 1 })).unwrap();
      toast.success("Added to Cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  // Show loading if product details are not available
  if (!productDetails) {
    return (
      <div className="w-[100px] sm:w-[250px] bg-slate-200 relative rounded-lg flex items-center justify-center h-[200px]">
        <LoaderCircle className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-[100px] sm:w-[250px] bg-slate-200 relative rounded-lg">
      <img
        src={productDetails.images?.[0] || "/default-image.jpg"}
        alt={productDetails.name}
        className="w-full h-[100px] sm:h-[250px] object-cover rounded-t-md"
      />
      <div className="p-4 flex flex-col gap-2 text-xs sm:text-base">
        <b>{productDetails.name}</b>
        <p>₹{wishListItem.priceWhenAdded || productDetails.price}</p>
        <Button
          onClick={onMoveToCart}
          disabled={loading || inCart}
          className="mb-2"
          variant={inCart ? "secondary" : "default"}>
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : inCart ? (
            "In Cart"
          ) : (
            "Move to Cart"
          )}
        </Button>
      </div>
      <Button
        onClick={onRemove}
        disabled={loading}
        variant="destructive"
        size="sm"
        className="absolute top-2 right-2 p-1 h-8 w-8">
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <X className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};

export const WishListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);
  const wishlist = useSelector(selectWishlistItems);
  const wishlistLoading = useSelector(selectWishlistLoading);
  const cart = useSelector(selectCartItems);

  // Check authentication on component mount
  useEffect(() => {
    if (!user) {
      toast.error("Please login to view your wishlist");
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  // State to store product details for each wishlist item
  const [productDetails, setProductDetails] = useState<{ [key: string]: Product }>({});
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Load wishlist on user login
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchWishlist());
    } else {
      // For guest users, get wishlist from localStorage
      const guestWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      // You might need to dispatch a local action to set guest wishlist
    }
  }, [dispatch, user?._id]);

  // Fetch product details for each wishlist item
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (wishlist.length === 0) {
        setLoadingProducts(false);
        return;
      }

      const details: { [key: string]: Product } = {};
      
      try {
        await Promise.all(
          wishlist.map(async (item) => {
            try {
              const result = await dispatch(getProductById(item.product)).unwrap();
              // result is ProductResponse { data: Product, ... }
              const prod = (result as any).data ? (result as any).data : result;
              // images: string[]
              const images: string[] = Array.isArray(prod.images)
                ? prod.images
                : [];
              // weight: { number, unit }
              const weight = prod.weight && typeof prod.weight === 'object'
                ? prod.weight
                : { number: 0, unit: '' };
              // dimensions: { l, b, h }
              const dimensions = prod.dimensions && typeof prod.dimensions === 'object'
                ? prod.dimensions
                : { l: 0, b: 0, h: 0 };
              const product: Product = {
                _id: prod._id,
                product: prod.product ?? "",
                name: prod.name,
                code: prod.code,
                category: prod.category,
                price: prod.price,
                description: prod.description,
                images,
                isActive: prod.isActive ?? true,
                tags: prod.tags ?? [],
                dimensions,
                stock: prod.stock,
                vegetarian: prod.vegetarian ?? false,
                quantitySold: prod.quantitySold ?? 0,
                weight,
                ratings: prod.ratings ?? [],
                createdAt: prod.createdAt,
                updatedAt: prod.updatedAt,
                __v: prod.__v ?? 0,
              };
              details[item.product] = product;
            } catch (error) {
              console.error(`Failed to fetch product ${item.product}:`, error);
            }
          })
        );
        setProductDetails(details);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProductDetails();
  }, [wishlist, dispatch]);

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  if (wishlistLoading || loadingProducts) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-56px)]">
        <LoaderCircle className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mt-[56px] w-full min-h-[calc(100vh-56px)] font-[quicksand]",
        wishlist.length === 0 ? "" : ""
      )}
    >
      <div className="w-full h-24 flex items-center sm:px-10">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xl"
        >
          <ChevronLeft />
          <div>WishList Page</div>
        </Button>
      </div>
      
      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-152px)]">
          <p className="text-2xl mb-4">No items wishlisted</p>
          <Button onClick={() => navigate("/category/all")}> 
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 p-10 pt-0">
          {wishlist.map((item: WishlistItem) => (
            <WishListCard
              key={item._id}
              user={user ?? null}
              wishListItem={item}
              cart={cart}
              productDetails={productDetails[item.product] || null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
// End of file