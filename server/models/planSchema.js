

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PlanSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    multiWeekPlan: [
      {
        weekNumber: { type: Number, required: true },
        isDaily: { type: Boolean, required: false, default: false },
        exercises: [
          {
            exercise: {
              type: Schema.Types.ObjectId,
              ref: 'Exercise',
            },
            reps: { type: Number, required: true, default: 5 },
            sets: { type: Number, required: true, default: 1 },
            times: { type: Number, required: true, default: 1 },
          },
        ],
      },
    ],
    painPoint: [{ type: String, enum: [
      'lowerBack',
      'upperBack',
      'neck',
      'shoulder',
      'knee',
      'hip',
      'ankle',
      'elbow',
      'wristAndHand',
    ] }],
    department: [{ type: String, required: true, enum: ['orthopedic', 'gynaecology', 'sports_injury', 'pcod'] }],
    createdBy: {
      type: Schema.Types.ObjectId,
      refPath: 'createdByType',
      //required: true,
    },
    createdByType: {
      type: String,
      enum: ['Admin', 'Doctor', 'Physio', 'Client'],
      //required: true,
    },
    custom: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['verified', 'unverified', 'hidden'],
      default: 'unverified',
    },
    numberOfSessions: {
      type: Number,
      default: 1
    },
  },
  {
    timestamps: true,
  }
);
const Plan = mongoose.model("Plan", PlanSchema);
export default Plan;
