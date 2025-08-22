'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ScenarioMapSchema = new Schema(
  {
    scenario: {
      type: String,
      required: true,
    },
    painPoint: {
      type: String,
      enum: [
        'lowerBack',
        'upperBack',
        'neck',
        'shoulder',
        'knee',
        'hip',
        'ankle',
        'elbow',
        'wristAndHand',
      ],
      required: true,
    },
    plan: {
      type: Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
  },
  { timestamps: true }
);
const ScenarioMap = mongoose.model('ScenarioMap', ScenarioMapSchema);
export default ScenarioMap;