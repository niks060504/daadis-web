import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSliceReducer from "./slices/userSlice";
import websiteSliceReducer from "./slices/websiteSlice";

export const store = configureStore({
    reducer: combineReducers({
        users: userSliceReducer,
        website: websiteSliceReducer
    }),
});


