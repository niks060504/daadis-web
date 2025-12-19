export enum DashboardOptions {
    Dashboard = "Dashboard",
    Products = "Products",
    Customers = "Customers",
    Coupons = "Coupons",
    Analytics = "Analytics",
    Delivery = "Delivery",
    Marketing = "Marketing"
};

export const utilityColours = [
    "#F6FB7A", "#B4E380", "#73BBA3", "#FF7777", "#BB9AB1", "#77E4C8", "#F9D689", "#4B70F5", "#FF7F3E", "#9B86BD", "#219C90", "#FF6969", "#A67B5B",
    "#8C3061", "#FFAF00", "#D95F59", "#F9E400", "#9CA986", "#FFDFD6", "#5F6F65", "#914F1E", "#6C946F", "#FFB200", "#E9FF97", "#36C2CE", "#758694",
    "#50B498", "#508D4E", "#80AF81", "#FFC7ED", "#36BA98", "#973131", "#B1AFFF", "#C80036", "#EF9C66", "#ECB176", "#8E3E63", "#74512D", "#006769",
    "#E6FF94", "#9DDE8B", "#6DC5D1", "#DBAFA0", "#9B3922", "#FA7070", "#416D19", "#CCD3CA", "#2D9596", "#E78895", "#FF8080", "#474F7A", "#E8C872",
];

export const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export interface IEmail {
    _id?: string,
    type?: string,
    markup: string,
    design: object,
};

export interface ICustomer {
    _id?: string,
    firstName: string
    lastName: string,
    phoneNumber: number,
    phoneNumberVerified: boolean,
    email: string,
    emailVerified: boolean,
    wishList: IProduct[]
    address?: {
        line1?: string,
        line2?: string,
        company?: string,
        city?: string,
        postalCode?: number,
        state?: string,
    },
    cart: ICartItem[]
    orders: IOrder[]
    totalOrderAmount: number
    luckyPoints: number,
    role?: "Customer"| "Admin" | "Guest",
    password?: string,
    comment?: string,
    refreshToken?: string,
    createdAt?: string,
    updatedAt?: string,
    __v?:0,
};

export interface ICartItem {
    product: IProduct;
    quantity: number;
};

export interface ISampleBanners {
    _id: string,
    imageUrl: {
        url: string,
        publicId: string
    },
    bannerName: string,
    bannerText: string,
    bannerType: string,
    bannerColours?: string[],
    bannerElementUrl?: {
        url: string,
        publicId: string
    },
}

export interface ISampleBlogs {
    _id: string,
    blogName: string,
    title: string,
    blogImgUrl: {
        url: string,
        publicId: string,
    },
    blogContent: {
        design: object,
        markup: string
    },
}

export const EMAIL_CATEGORIES = [
    {type: "LuckyPoints", text: "Lucky points"},
    {type: "Intransit", text: "In-transit"},
    {type: "Delivered", text: "Delivered"},
    {type: "Ordered", text: "Ordered"},
    {type: "SelfMail", text: "Self-mail"},
];

export const SAMPLE_TOTAL_USERS = 458;
export const SAMPLE_TOTAL_SALES = 556_981;
export const SAMPLE_TOTAL_ORDERS = 2548;
export const SAMPLE_SALES_INCREASE = "8%";
export const SAMPLE_ORDERS_INCREASE = "15%";
export const SAMPLE_USERS_INCREASE = "0%";
export const SAMPLE_TOP_3_PRODUCTS = [
    {
        productId: 92384092834,
        productName: "Garlic Khakhra",
        quantitySold: 526,
    },
    {
        productId: 92384092835,
        productName: "Tomato Khakhra",
        quantitySold: 485,
    },
    {
        productId: 92384092836,
        productName: "Masala Khakhra",
        quantitySold: 168,
    },
];

export const SAMPLE_BANNER_TYPES = [ "hero-section-banner", "category-banner", "partner-banner"];


export const SAMPLE_ORDER_STATUS = [
    {
        type: "completed",
        value: 152,
    },
    {
        type: "processing",
        value: 41,
    },
    {
        type: "ordered",
        value: 86,
    },

]

export const SAMPLE_WEBSITE_VISITS = [
    {
        type: "Guest",
        value: 458,
    },
    {
        type: "Logged in",
        value: 695,
    },
    // {
    //     type: "ordered",
    //     value: 86,
    // },
]

export const SAMPLE_PRODUCTS = [
    {
        productId: "string",
        productName: "Tomato khakhra",
        productDescription: "tomato Khakhra",
        productCategory: {
            _id: "",
            createdAt: "",
            updatedAt: "",
            categoryName: "Khakhra",
        },
        weight: {
            number: 180,
            unit: "g"
        },
        vegetarian: true,
        price: 85,
        quantitySold: 0,
        imageUrl: ["", ""],
        stock: 100,
        dimensions: {h: 10, b: 10, l: 10},
        impressions: 1,
    }
]

export const SAMPLE_RECENT_ORDERS = [];

export interface IOrder {
    _id?: string,
    orderId: string,
    customerId: ICustomer,
    orderStatus: "Fulfilled" | "Pending" | "In-transit",
    cart: ICartItem[],
    total: number,
    deliveryAddress: {
        line1: string,
        line2: string,
        company: string,
        city: string,
        postalCode: number,
        state: string,
    },
    note?: string,
    createdAt?: string,
};

const SAMPLE_CUSTOMER: ICustomer = {
    firstName: "Johan",
    lastName: "Libert",
    phoneNumber: 9876543210,
    phoneNumberVerified: true,
    emailVerified: true,
    email: "johanlibert@gmail.com",
    wishList: [],
    cart: [],
    address: {
        line1: "Nexus mall",
        line2: "Koramangala",
        company: "",
        city: "Bangalore",
        postalCode: 560029,
        state: "Karnataka"
    },
    orders: [],
    totalOrderAmount: 500000,
    luckyPoints: 10000,
    role: "Customer",
    comment: "Monster"    
};

export const SAMPLE_ORDERS: IOrder[] = [
    {
        createdAt: "2024-12-16T18:27:30.867+00:00",
        orderId: "one",
        customerId: SAMPLE_CUSTOMER,
        orderStatus: "Pending",
        cart: [],
        total: 500,
        deliveryAddress: {
            line1: "Nexus mall",
            line2: "Koramangala",
            company: "",
            city: "Bangalore",
            postalCode: 560029,
            state: "Karnataka"
        },
    },
];

export const SAMPLE_DELIVERY_PIE_CHART_DATA = [
    { id: 0, value: 15, label: "Ordered", color: "#EE4E4E" },
    { id: 1, value: 8, label: "In-transit", color: "#FFDB5C" },
    { id: 2, value: 6, label: "Delivered", color: "#A1DD70" },
];

export const SAMPLE_SALES_DATA = [
    {
        amount: 2456,
        month: "Jan"
    },
    {
        amount: 7856,
        month: "Feb"
    },
    {
        amount: 1569,
        month: "March"
    },
    {
        amount: 1587,
        month: "April"
    },
    {
        amount: 1445,
        month: "May"
    },
    {
        amount: 9650,
        month: "June"
    },
    {
        amount: 12568,
        month: "July"
    },
    {
        amount: 28456,
        month: "Aug"
    },
    {
        amount: 4236,
        month: "Sep"
    },
    {
        amount: 4585,
        month: "Oct"
    },
    {
        amount: 30156,
        month: "Nov"
    },
    {
        amount: 7895,
        month: "Dec"
    },
];

export interface IProduct {
    _id?: string,
    productId: string,
    productName: string,
    productDescription: string,
    productCategory: ICategory,
    weight: {
        number: number,
        unit: string
    },
    vegetarian: boolean,
    price: number,
    quantitySold: number,
    imageUrl: {
        url: string,
        publicId: string,
    }[],
    stock: number,
    dimensions: {h: number, b: number, l: number}
    impressions: number,
};

export interface ICoupon {
    _id?: string,
    couponName: string,
    couponCode: string,
    type: "percentage" | "fixed",
    discount: { amount : number, upperLimit: number },
    customerLogin: boolean,
    products: Array<IProduct>,
    categories: Array<ICategory>,
    dateStart: Date,
    dateEnd: Date,
    userdBy: Array<ICustomer>,
    usesPerCustomer: number,
    totalUses: number,
    status: boolean
};

export interface ICategory {
    _id: string,
    categoryName: string,
    products: string[],
    categoryDescription: string,
    banners: ISampleBanners[]
    createdAt: string,
    updatedAt: string
};

export const SAMPLE_CATEGORIES = [
    {
        categoryName: "Khakhra",
        products: []
    },
    {
        categoryName: "Mobile khakhra",
        products: []
    },
    {
        categoryName: "Sweets",
        products: []
    },
];

export const SAMPLE_COUPONS: ICoupon[] = [
    {
        couponName: "first",
        couponCode: "FIRSTBUY",
        discount: {
            amount: 10,
            upperLimit: 100
        },
        type: "fixed",
        userdBy: [],
        customerLogin: false,
        products: [],
        categories: [],
        dateStart: new Date(),
        dateEnd: new Date(),
        usesPerCustomer: 1,
        totalUses: 0,
        status: true,
    },
];