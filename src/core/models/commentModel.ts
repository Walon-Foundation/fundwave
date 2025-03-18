import{ Schema,models, model, Document } from "mongoose";

interface Comment extends Document{
    description:string,
    campaignId:string | undefined,
    username:string,
    userId:string | undefined
    reactions:string[] | undefined[]
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
    username:{
        type:String,
        required: true,
    },
    reactions:[{
        type:Schema.Types.ObjectId,
        ref:"Reaction"
    }],
    userId: {
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
})

const Comment = models.comments || model("comments",commentSchema);

export default Comment;