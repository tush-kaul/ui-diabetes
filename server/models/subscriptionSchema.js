'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    plan: {
      type: Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    startsAt: {
      type: Date,
      required: true,
    },
    endsAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['created', 'active', 'expired'],
      default: 'created',
    },
    sessions:[
      {
       session: {
        type: Date,
        required: false
       }
      }
    ],
    weekNumber: {
      type: Number,
      required: false,
      default: 1
    }
  },
  {
    timestamps: true,
  }
);
const Subscription = mongoose.model("Subscription", SubscriptionSchema);
export default Subscription;
