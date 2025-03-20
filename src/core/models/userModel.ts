import {model, Schema, Document,models} from "mongoose";

interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  username:string
  password: string;
  phoneNumber: string;
  address:string;
  DOB:string;
  qualification?: string;
  campaigns?: string[];
  isCampaign:boolean;
  roles:string
};

const userSchema = new Schema<User>(
  {
    firstName: {
      type: String,
      required: true
    },
    username: {
      type:String,
      required:true,
      unique:true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
    },
    roles:{
      type:String,
      enum:["Admin", "User"],
      default:"User"
    },
    address:{
      type:String
    },
    DOB:{
      type:String,
    },
    qualification: {
      type:String,
    },
    isCampaign:{
      type:Boolean,
      default:false,
    },
    campaigns: [{
      type: Schema.Types.ObjectId,
      ref: 'Campaign'
    }]
  },
  {
    timestamps: true,
  }
);


const User = models.users || model('users', userSchema);

export default User;