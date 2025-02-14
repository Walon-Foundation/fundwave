import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    description:{
        type:String,
        required:true,
    },
    likeCount: {
        type:Number,
        default:0
    },
    dislikeCount: {
        type:Number,
        default: 0, 
    },
    campaignId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Campaign",
        required:true
    }
})

const Comment = mongoose.models.comments || mongoose.model("comments",commentSchema);

export default Comment;