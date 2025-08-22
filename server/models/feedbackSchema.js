'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const FeedbackSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: false,
    },
    time: {
      type: Number,
      default: 0,
      required: false,
    },
    plan: {
      type: Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    status: {
      type: String,
      enum: ['completed', 'active'],
      default: 'active',
    },
    rating: {
      type: Number,
      default: null,
    },
    painPerception: {
      type: Number,
      default: null,
    },
    difficulty: {
      type: Number,
      default: null,
    },
    rom: {
      type: String,
      default: null,
    },
    physioTest : [
      {
         test: {
          type: String,
          default: 0
         },
         score: {
           type:  String,
           default: ""
         }
      }
    ]
  },
  {
    timestamps: true,
  }
);
const Feedbacks = mongoose.model('Feedback', FeedbackSchema);
export default Feedbacks;
