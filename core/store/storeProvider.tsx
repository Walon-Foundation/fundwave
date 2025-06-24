"use client"
import { Provider } from "react-redux"
import { store } from "./store"
import { fetchCampaigns } from "./features/campaigns/campaignSlice"
import { fetchComment } from "./features/comments/commentSlice"
import { fetchUpdate } from "./features/update/updateSlice"

store.dispatch(fetchCampaigns())
store.dispatch(fetchComment())
store.dispatch(fetchUpdate())

export default function StoreProvider({children}:{children:React.ReactNode}){
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}