'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TimeSlotSchema = new Schema(
  {
    time: {
      type: String,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'disabled'],
    },
  },
  { timestamps: true }
);
const TimeSlot = mongoose.model("TimeSlot", TimeSlotSchema);
export default TimeSlot;
