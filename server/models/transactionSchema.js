'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    orderId: {
      type: String,
      required: false,
    },
    paymentId: {
      type: String,
      required: false,
    },
    paymentSignature: {
      type: String,
      required: false,
    },
    paymentStatus: {
      type: Boolean,
      required: false,
    },
    orderObject: {
      type: Object,
      required: false,
    },
    paymentObject: {
      type: Object,
      required: false,
    },
    couponId: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon',
      required: false,
    },
  },
  { timestamps: true }
);
const Transaction = mongoose.model('Transaction', TransactionSchema);
export default Transaction;
