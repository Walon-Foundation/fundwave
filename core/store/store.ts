"use client"

import { configureStore } from "@reduxjs/toolkit"
import campaignReducer from "./features/campaigns/campaignSlice"
import commentReducer from "./features/comments/commentSlice"
import userReducer from "./features/user/userSlice"
import updateReducer from "./features/update/updateSlice"

export const store = configureStore({
    reducer:{
        campaign:campaignReducer,
        comment:commentReducer,
        user:userReducer,
        update:updateReducer
    }
})

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch