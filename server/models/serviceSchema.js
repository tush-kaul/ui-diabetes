'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ServiceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['verified', 'unverified'],
      default: 'unverified',
    },
    serviceType: {
      type: String,
      enum: ['consultation', 'auto_diet', 'dietician'],
      default:'consultation'
    }
  },
  { timestamps: true }
);
const Service = mongoose.model('Service', ServiceSchema);
export default Service;
