import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
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
    country: {
      type: String,
      required: true
    },

    capitalCity: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },

    campaigns: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign'
    }]
  },
  {
    timestamps: true,
  }
);


const User = mongoose.models.users || mongoose.model('users', userSchema);

export default User;