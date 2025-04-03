"use client"
import { Provider } from "react-redux"
import { store } from "./store"
import { fetchCampaigns } from "./features/campaigns/campaignSlice"
import { fetchComment } from "./features/comments/commentSlice"

store.dispatch(fetchCampaigns())
store.dispatch(fetchComment())

export default function StoreProvider({children}:{children:React.ReactNode}){
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}