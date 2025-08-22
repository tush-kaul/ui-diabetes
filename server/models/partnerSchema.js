import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PartnerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      default: null,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Account"
    },
    status: {
      type: String,
      enum: ["inactive", "active", "idle", "hidden"],
      default: "inactive",
    },
    countryCode: {
      type: String,
      default: null,
    },
    photoUrl: {
      type: String,
      default: null,
    },
    email: {
      type: String,

      default: null,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    mobile: {
      type: String,
      default: null,
      unique: true,
    },
    whatsapp: {
      type: String,
      default: null,
    },
    adhaarUrl: {
      type: String,
      default: null,
    },
    currentAddress: {
      type: String,
      default: null,
    },
    city: {
      type: String,

      default: null,
    },
    pincode: {
      type: Number,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    degree: [
      {
        type: String,
        default: null,
      },
    ],
    degreeUrl: {
      type: String,
      default: null,
    },
    yearOfGraduation: {
      type: Number,
      default: null,
    },
    // regAuthority: {
    //   type: String,
    //   default: null,
    // },
    // regNumber: {
    //   type: Number,
    //   default: null,
    // },
    mciReg: {
      type: String,
      default: null,
    },
    licenseNumber: {
      type: String,
      default: null,
    },
    yearsOfExperience: {
      type: Number,
      default: null,
    },
    specialization: [
      {
        type: String,
        default: null,
      },
    ],
    // areaOfExpertise: {
    //   type: String,
    //   default: null,
    // },
    currentEngagement: {
      type: String,
      default: null,
    },
    pan: {
      type: String,
      default: null,
    },
    panUrl: {
      type: String,
      default: null,
    },
    accountHoldername: {
      type: String,
      default: null,
    },
    bankName: {
      type: String,
      default: null,
    },
    branchName: {
      type: String,
      default: null,
    },
    accountNumber: {
      type: Number,
      default: null,
    },
    bankIFSC: {
      type: String,
      default: null,
    },
    onlineEvaluationFees: {
      type: Number,
      default: null,
    },
    telePhysioSessionFee: {
      type: Number,
      default: null,
    },
    homeVisits: {
      type: String,
      default: null,
    },
    homeVisitFee: {
      type: Number,
      default: null,
    },
    consultationTimings: [
      {
        type: String,
        default: null,
      },
    ],
    facebook: {
      type: String,
      default: null,
    },
    twitter: {
      type: String,
      default: null,
    },
    linkedin: {
      type: String,
      default: null,
    },
    instagram: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
const Partner = mongoose.model("Partner", PartnerSchema);
export default Partner;
