import {models, model, Schema, Document} from "mongoose";

interface Update extends Document {
    campaignId:string | undefined,
    title:string,
    campaignName:string,
    description:string,
}

const updateSchema = new Schema<Update>({
    campaignId:{
        type:Schema.Types.ObjectId,
        ref:"Campaign",
        required:true
    },
    campaignName:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },

}, { timestamps: true })

const Update = models.update || model("update", updateSchema);

export default Update;