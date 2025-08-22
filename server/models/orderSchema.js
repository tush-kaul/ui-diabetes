'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ['created', 'paid'],
      default: 'created',
    },
    couponId: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon',
      default: null,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
      default: null,
    },
    addons:[
      {
        type: Schema.Types.ObjectId,
        ref: 'Inventory',
        required: false
      }
    ]
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model('Order', OrderSchema);
export default Order;
