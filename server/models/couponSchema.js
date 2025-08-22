'use strict';

import mongoose from 'mongoose';


const Schema = mongoose.Schema;

const CouponSchema = new Schema(
  {
    discount: {
      type: Schema.Types.ObjectId,
      ref: 'Discount',
      required: true,
    },
    couponCode: {
      type: String,
      required: true,
      unique: true,
    },
    numberOfCoupons: {
      type: Number,
      required: true,
    },
    timesUsed: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      required: false,
    },
    validFrom: {
      type: Date,
      default: new Date(),
      required: true,
    },
    validTill: {
      type: Date,
      default: new Date(),
      required: true,
    },
    type: {
      type: String,
      enum: ['all', 'referral', 'product'],
      required: true,
    },
    productIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: false,
      },
    ],
    referralIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Referral',
        required: false,
      },
    ],
    location: {
      type: String,
      required: false,
    },
    maxAge: {
      type: Number,
      required: false,
    },
    minAge: {
      type: Number,
      required: false,
    },
    private: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Coupon = mongoose.model('Coupon', CouponSchema);
export default Coupon;
