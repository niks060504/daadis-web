import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // userData: {
    //     firstName: "",
    //     lastName: "",
    //     phoneNumber: 0,
    //     accessToken: "",
    //     userType: "",
    //     phoneNumberVerified: false,
    //     email: "",
    //     emailVerified: false,
    //     wishlist: [],
    //     address: "",
    //     cart: [],
    //     orders: [],
    //     totalOrderAmount: 0,
    //     luckyPoints: 0,
    //     role: "guest"
    // },
    userData: null,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            console.log("inside setUser()");
            console.log(action.payload);
            state.userData = action.payload;
        },
    },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;