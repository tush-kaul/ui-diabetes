import mongoose from "mongoose" ;
import constants from "../utilities/constants.js";

const newDate = new Date();

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    painPoint: {
      type: String,
      enum: constants.painPoints,
      required: true,
    },
    questionAnswer: {
      type: {},
    },
    diagnosticPlan: {
      type: Schema.Types.ObjectId,
      ref: "DiagnosticPlan",
      default: null,
    },
    customPlan: {
      type: Schema.Types.ObjectId,
      ref: "CustomPlan",
      default: null,
    },
    planName: {
      type: String,
    },
    expert: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    scenarioId: {
      type: String,
    },
    exercisesCount: {
      type: Number,
      default: 0,
      required: true,
    },
    status: {
      type: String,
      enum: ["created", "active", "expired"],
      default: "created",
    },
    startsAt: {
      type: Date,
      default: null,
    },
    endsAt: {
      type: Date,
      default: null,
    },
    custom: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    scheduledAt: {
      type: Date,
      default: newDate.setHours(8, 0, 0),
    },
  },
  {
    timestamps: true,
  }
);

const ProductStat = mongoose.model("SelfDiagnostic", schema);

export default ProductStat