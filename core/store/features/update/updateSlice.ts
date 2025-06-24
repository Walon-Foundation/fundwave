import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { axiosInstance } from "@/core/api/axiosInstance";
import { UpdateSlice } from "@/core/types/slicesTypes";
import { Update } from "@/core/types/types";
import { RootState } from "../../store";


const updateAdaptor = createEntityAdapter<Update, string>({
    selectId: (comment) => comment._id as string,
    sortComparer:(a,b) => (b._id ?? "").localeCompare(a._id ?? "")
})

export const fetchUpdate = createAsyncThunk("comment/fetchUpdate", async(_,{rejectWithValue}) => {
    try{
        const response = await axiosInstance.get('/update')
        return response.data.data as Update[] || []
    }catch(error){
        console.error(error)
        return rejectWithValue("Failed to fetch update");
    }
})

export const deleteUpdate = createAsyncThunk("update/deleteUpdate", async(id:string, {rejectWithValue}) => {
    try{
        const response = await axiosInstance.delete(`update/${id}`)
        return response.data.data as {id : string}
    }catch(error){
        console.error(error)
        return rejectWithValue("Deleting update failed")
    }
})

export const updateUpdate = createAsyncThunk("update/updateComment", async(data:Update, {rejectWithValue}) => {
    try{
        if(data.description === " "){
            return rejectWithValue("All field required")
        }
        const response = await axiosInstance.patch(`update/${data._id}`,data)
        return response.data.data as Update
    }catch(error){
        console.error(error)
        return rejectWithValue("Updating update failed")
    }
})

const initialState:UpdateSlice = updateAdaptor.getInitialState({
    status:"idle",
    error:null
})

const updateSlice = createSlice({
    name:"update",
    initialState,
    reducers:{},
    extraReducers(builder){
        builder.addCase(fetchUpdate.pending, (state) => {
            state.status = "loading";
            state.error = null;
        })
        .addCase(fetchUpdate.fulfilled, (state, action) => {
            state.status = "success";
            updateAdaptor.upsertMany(state, action.payload);
            state.error = null;
        })
        .addCase(fetchUpdate.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message as string;
        })
        .addCase(deleteUpdate.pending, (state) => {
            state.status = "loading";
            state.error = null
        })
        .addCase(deleteUpdate.fulfilled, (state, action) => {
            state.status = "success";
            updateAdaptor.removeOne(state, action.payload.id ?? "")
        })
        .addCase(deleteUpdate.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload as string;
        })
        .addCase(updateUpdate.pending, (state) => {
            state.status = "loading";
            state.error = null
        })
        .addCase(updateUpdate.fulfilled, (state, action) => {
            state.status = "success";
            updateAdaptor.upsertOne(state, action.payload)
        })
        .addCase(updateUpdate.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload as string;
        })
    }
})

export const {
    selectAll:selectAllUpdate,
    selectById:selectUpdateById,
    selectIds: getUpdateId,
} = updateAdaptor.getSelectors((state:RootState) => state.update)

export default updateSlice.reducer