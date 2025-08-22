// INACTIVE COLLECTION

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    referralCode: {
      type: String,
      default: null,
    },
    userReferralCode: {
      type: String,
      default: "",
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    mobileVerified: {
      type: Number,
      default: 0,
      required: true,
    },
    status: {
      type: Number,
      default: 1,
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    otp: {
      type: String,
      required: false,
    },
    otpSentAt: {
      type: Date,
      default: null,
    },
    otpVerifiedAt: {
      type: Date,
      default: null,
    },
    offer: {
      type: String,
      enum: ["30percent", "unlimited", "none"],
    },
    userFCMToken: {
      type: String,
      default: null,
    },
    latitude: {
      type: String,
      default: null,
    },
    longitude: {
      type: String,
      default: null,
    },
    canAssignPlan: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

schema.virtual("profile", {
  ref: "Profile", // The model to use
  localField: "_id", // Find people where `localField`
  foreignField: "user", // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: true,
});

schema.set("toObject", { virtuals: true });
schema.set("toJSON", { virtuals: true });

// const TrueUsers = mongoose.model("User", schema);

export default schema;