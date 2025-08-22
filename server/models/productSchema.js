'use strict';


import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    items: [
      {
        itemId: {
          type: Schema.Types.ObjectId,
          ref: 'Inventory',
          required: true,
        },
        discount: {
          type: Schema.Types.ObjectId,
          ref: 'Discount',
          required: false,
        },
      },
    ],
    painPoint: [{ type: String, enum:  [
      'lowerBack',
      'upperBack',
      'neck',
      'shoulder',
      'knee',
      'hip',
      'ankle',
      'elbow',
      'wristAndHand',
    ], index: true }],
    department: { type: String, required: true, enum: ['orthopedic', 'gynaecology', 'sports_injury', 'pcod'] },
    sports: [{type: String, enum: [
      "badminton", "swimming", "football", "tennis", "basketball", "volleyball", "hand_ball", "cricket", "kabaddi" ,  "weight_lifting",  "wrestling"
    ], index: true}],
    days: {
      type: Number,
      required: true,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validTo: {
      type: Date,
      required: true,
    },
    visibility: {
      type: Boolean,
      default: false,
      required: true,
    },
    recommended: {
      type: Boolean,
      required: true,
      default: false,
    },
    thumbnail:{
      type: String,
      required: false
  }
  },
  {
    timestamps: true
  }
);
const Product = mongoose.model('Product', ProductSchema);
export default Product;
