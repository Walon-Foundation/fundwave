import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { axiosInstance } from "@/core/api/axiosInstance";
import { CommentSlice } from "@/core/types/slicesTypes";
import { Comment } from "@/core/types/types";
import { RootState } from "../../store";


const commentAdaptor = createEntityAdapter<Comment, string>({
    selectId: (comment) => comment._id as string,
    sortComparer:(a,b) => (b._id ?? "").localeCompare(a._id ?? "")
})

export const fetchComment = createAsyncThunk("comment/fetchComment", async(_,{rejectWithValue}) => {
    try{
        const response = await axiosInstance.get('/comment')
        return response.data.data as Comment[] || []
    }catch(error){
        console.error(error)
        return rejectWithValue("Failed to fetch comment");
    }
})

export const addComment = createAsyncThunk("comment/addComment", async(data:Comment, {rejectWithValue}) => {
    try{
        if(Object.keys(data).length === 0){
            return rejectWithValue("All field required")
        }
        const response = await  axiosInstance.post(`/comment/${data.campaignId}/comment/`, data)
        return response.data.data as Comment
    }catch(error){
        console.error(error);
        return rejectWithValue("Failed to add comment")
    }
})

export const deleteComment = createAsyncThunk("comment/deleteComment", async(id:string, {rejectWithValue}) => {
    try{
        const response = await axiosInstance.delete(`comment/${id}`)
        return response.data.data as {id : string}
    }catch(error){
        console.error(error)
        return rejectWithValue("Deleting comment failed")
    }
})

export const updateComment = createAsyncThunk("comment/updateComment", async(data:Comment, {rejectWithValue}) => {
    try{
        if(data.description === " "){
            return rejectWithValue("All field required")
        }
        const response = await axiosInstance.patch(`comment/${data._id}`,data)
        return response.data.data as Comment
    }catch(error){
        console.error(error)
        return rejectWithValue("Updating comment failed")
    }
})

const initialState:CommentSlice = commentAdaptor.getInitialState({
    status:"idle",
    error:null
})

const commentSlice = createSlice({
    name:"comment",
    initialState,
    reducers:{},
    extraReducers(builder){
        builder.addCase(fetchComment.pending, (state) => {
            state.status = "loading";
            state.error = null;
        })
        .addCase(fetchComment.fulfilled, (state, action) => {
            state.status = "success";
            commentAdaptor.upsertMany(state, action.payload);
            state.error = null;
        })
        .addCase(fetchComment.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message as string;
        })
        .addCase(addComment.pending, (state) => {
            state.status = "loading";
            state.error = null
        })
        .addCase(addComment.fulfilled, (state, action) => {
            state.status = "success";
            commentAdaptor.upsertOne(state, action.payload);
            state.error = null
        })
        .addCase(addComment.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message as string;
        })
        .addCase(deleteComment.pending, (state) => {
            state.status = "loading";
            state.error = null
        })
        .addCase(deleteComment.fulfilled, (state, action) => {
            state.status = "success";
            commentAdaptor.removeOne(state, action.payload.id ?? "")
        })
        .addCase(deleteComment.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload as string;
        })
        .addCase(updateComment.pending, (state) => {
            state.status = "loading";
            state.error = null
        })
        .addCase(updateComment.fulfilled, (state, action) => {
            state.status = "success";
            commentAdaptor.upsertOne(state, action.payload)
        })
        .addCase(updateComment.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload as string;
        })
    }
})

export const {
    selectAll:selectAllCampaign,
    selectById:selectCampaignById,
    selectIds: getCampaignId,
} = commentAdaptor.getSelectors((state:RootState) => state.comment)

export default commentSlice.reducer