'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SelfDiagnosticSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    painPoint: [
      {
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
    ],
    department: {
      type: String,
      enum: ['orthopedic', 'gynaecology', 'sports_injury', 'pcod'],
      required: true,
    },
    scenarioId: {
      type: String,
      required: false,
    },
    questionAnswer: {
      type: Object,
      required: true,
    },
    plan: {
      type: Schema.Types.ObjectId,
      ref: 'Plan',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
const SelfDiagnostic = mongoose.model('SelfDiagnostic', SelfDiagnosticSchema);
export default SelfDiagnostic;
