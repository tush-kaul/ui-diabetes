'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PricingSchema = new Schema(
  {
    inventoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Inventory',
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ['rupees', 'dollars'],
    },
  },
  { timestamps: true }
);
const Pricing = mongoose.model('Pricing', PricingSchema);
export default Pricing;
