import { configureStore } from "@reduxjs/toolkit"
import campaignReducer from "@/core/store/features/campaigns/campaignSlice"
import commentReducer from "@/core/store/features/comments/commentSlice"

export const store = configureStore({
    reducer:{
        campaign:campaignReducer,
        comment:commentReducer
    }
})

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch