'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const DiscountSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    value: {
      type: Number,
      required: true,
      default: 0,
    },
    type: {
      type: String,
      enum: ['percentage', 'amount'],
      required: true,
      default: 'percentage',
    },
    days: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Discount = mongoose.model('Discount', DiscountSchema);
export default Discount;
