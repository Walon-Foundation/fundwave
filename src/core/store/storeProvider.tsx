"use client"
import { Provider } from "react-redux"
import { store } from "./store"
import { fetchCampaigns } from "./features/campaigns/campaignSlice"

store.dispatch(fetchCampaigns())

export default function StoreProvider({children}:{children:React.ReactNode}){
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}