import{ Schema,models, model, Document } from "mongoose";

interface Comment extends Document{
    description:string,
    campaignId:string | undefined,
    campaignName:string,
    username:string,
    userId:string | undefined
}

const commentSchema = new Schema<Comment>({
    description:{
        type:String,
        required:true,
    },
    campaignId: {
        type:Schema.Types.ObjectId,
        ref:"Campaign",
        required:true
    },
    campaignName:{
        type:String,
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