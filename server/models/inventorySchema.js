'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const InventorySchema = new Schema(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      refPath: 'itemType',
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    itemType: {
      type: String,
      enum: ['Plan', 'Service'],
      required: true,
    },
    
  },
  { timestamps: true }
);
const Inventory = mongoose.model('Inventory', InventorySchema);
export default Inventory;
