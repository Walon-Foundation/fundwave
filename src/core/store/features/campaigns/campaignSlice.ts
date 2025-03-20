import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { axiosInstance } from "@/core/api/axiosInstance";
import { CampaignSice } from "@/core/types/slicesTypes";
import { Campaign } from "@/core/types/types";


const campaignAdaptor = createEntityAdapter<Campaign, string>({
    selectId: (campaign) => campaign._id as string,
    sortComparer:(a,b) => (b._id ?? "").localeCompare(a._id ?? "")
})

export const fetchCampaigns = createAsyncThunk("campaign/fetchCampaigns", async(_,{rejectWithValue}) => {
    try{
        const response = await axiosInstance.get('/campaign')
        return response.data.data as Campaign[]
    }catch(error){
        console.error(error)
        return rejectWithValue("Failed to fetch campaign");
    }
})

export const addCampaign = createAsyncThunk("campaign/addCampaign", async(data:Campaign, {rejectWithValue}) => {
    try{
        if(Object.keys(data).length === 0){
            return rejectWithValue("All field required")
        }
        const response = await  axiosInstance.post("/campaign", data)
        return response.data.data as Campaign
    }catch(error){
        console.error(error);
        return rejectWithValue("Failed to add campaign")
    }
})

const initialState:CampaignSice = campaignAdaptor.getInitialState({
    status:"idle",
    error:null
})

const campaignSlice = createSlice({
    name:"campaign",
    initialState,
    reducers:{},
    extraReducers(builder){
        builder.addCase(fetchCampaigns.pending, (state) => {
            state.status = "loading";
            state.error = null;
        })
        .addCase(fetchCampaigns.fulfilled, (state, action) => {
            state.status = "success";
            campaignAdaptor.upsertMany(state, action.payload);
            state.error = null;
        })
        .addCase(fetchCampaigns.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message as string;
        })
        .addCase(addCampaign.pending, (state) => {
            state.status = "loading";
            state.error = null
        })
        .addCase(addCampaign.fulfilled, (state, action) => {
            state.status = "success";
            campaignAdaptor.upsertOne(state, action.payload);
            state.error = null
        })
        .addCase(addCampaign.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message as string;
        })
    }
})

export default campaignSlice.reducer