import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AccountSchema = new Schema(
  {
    role: {
      type: String,
      enum: ['Admin', 'Doctor', 'Physio', 'Client', 'Team-Member'],
      required: true,
      default: 'Client',
    },
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: Number,
      required: false,
    },
    otpSentAt: {
      type: Date,
      required: false,
    },
    otpVerfiedAt: {
      type: Date,
      required: false,
    },
    userFCMToken: {
      type: String,
      required: false,
    },
    referralCode: {
      type: Schema.Types.ObjectId,
      ref: 'Referral',
      required: false,
    },
    userReferralCode: {
      type: Schema.Types.ObjectId,
      ref: 'Referral',
      required: false,
    },
    isCaseTransfered:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);
const Account = mongoose.model("Account", AccountSchema);
export default Account;
