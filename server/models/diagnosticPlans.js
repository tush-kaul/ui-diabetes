import mongoose from "mongoose";
import constants from "../utilities/constants.js";

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    painPoint: {
      type: String,
      enum: constants.painPoints,
      required: true,
    },
    multiWeeksPlan: {
      type: [],
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    exercisesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const DiagnosticPlan = mongoose.model("DiagnosticPlan", schema);

export default DiagnosticPlan