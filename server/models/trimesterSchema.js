'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TrimesterSchema = new Schema(
  {
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    trimesters: [{
      date: { type: Date, required: true },
      trimester: { type: String, required: true },
      bloodPressure: {
        type: String, 
        required: false
    },
      pulseRate: {
        type: String,
        required: false,
      },
      temperature: {
        type: String,
        required: false,
      },
      spo2: {
        type: String,
        required: false,
      },
      weight: {
        type: String,
        required: false,
      },
      bloodSugar: {
        type: String,
        required: false,
      },
      haemoglobin: {
        type: String,
        required: false,
      },
      foetalHeartRate: {
        type: String,
        required: false,
      },
      urineProteinAlbumin: {
        type: String,
        required: false,
      },
      bloodSugarUrine: {
        type: String,
        required: false,
      },
      t3: {
        type: String,
        required: false,
      },
      t4: {
        type: String,
        required: false,
      },
      tsh: {
        type: String,
        required: false,
      },
      torchPanelIgm: {
        type: [String],
        required: false,
      },
      torchPanelIgg: {
        type: [String],
        required: false,
      },
      lipidProfile: {
        cholesterol: {
          type: String,
          required: false,
        },
        triglycerides: {
          type: String,
          required: false,
        },
        hdlCholesterol: {
          type: String,
          required: false,
        },
        ldlCholesterol: {
          type: String,
          required: false,
        }
      },
      hbsAg: {
        type: String,
        required: false,
      },
      ogtt: {
        type: String,
        required: false,
      },
      prolactinTest: {
        type: String,
        required: false,
      },
      estrogenLevelTest: {
        type: String,
        required: false,
      },
      antiMullerianHormoneTest: {
        type: String,
        required: false,
      }
    }]
  },
  { timestamps: true }
);
const Trimester = mongoose.model('Trimester', TrimesterSchema);
export default Trimester;
