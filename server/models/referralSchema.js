
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ReferralSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    timesUsed: {
      type: Number,
      default: 0,
    },
    organization: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);
const Referral = mongoose.model("Referral", ReferralSchema);
export default Referral;
