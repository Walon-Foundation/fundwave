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
  sex:string;
  profilePicture?:string
  isVerified:boolean
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
    profilePicture:{
      type:String,
      default:""
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
    sex:{
      type:String,
      enum:["Male", "Female"],
    },
    campaigns: [{
      type: Schema.Types.ObjectId,
      ref: 'Campaign'
    }],
    isVerified:{
      type:Boolean,
      required:true
    }
  },
  {
    timestamps: true,
  }
);


const User = models.users || model('users', userSchema);

export default User;