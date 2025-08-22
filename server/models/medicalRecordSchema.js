'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MedicalRecordSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    document: {
      type: String,
      default: null,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    
  },
  { timestamps: true }
);
const MedicalRecord = mongoose.model('MedicalRecord', MedicalRecordSchema);
export default MedicalRecord;