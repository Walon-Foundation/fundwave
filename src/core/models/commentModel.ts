import{ Schema,models, model } from "mongoose";

interface Comment extends Document{
    description:string,
    likeCount:number,
    dislikeCount:number,
    campaignId:string | undefined,
    username:string,
    userId:string | undefined
}

const commentSchema = new Schema<Comment>({
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
        type:Schema.Types.ObjectId,
        ref:"Campaign",
        required:true
    },
    username:{
        type:String,
        required: true,
    },
    userId: {
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
})

const Comment = models.comments || model("comments",commentSchema);

export default Comment;