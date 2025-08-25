'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    heightMeasure: {
      type: String,
      enum: ['ft', 'cm'],
      default: 'cm',
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    weightMeasure: {
      type: String,
      enum: ['kg', 'lb'],
      default: 'kg',
      required: true,
    },
    natureOfWork: {
      type: String,
      enum: ['sedentary', 'household_work', 'athletic', 'heavy_manual_labour', 'travelling'],
      required: true,
    },
    medications: [
      {
        name: {
          type: String,
          required: false
        },
        frequency: {
          type: String,
          required: false,
          enum: ['daily', 'weekly', 'monthly', 'quarterly'],
        },
        dailyFrequency: { type: Number, required: false },
        startDate: { type: Date, required: false },
        endDate: { type: Date, required: false },
        notificationTime: { type: Date, required: false },
        conditions: [
          {
            type: String,
            required: false,
            enum: [
              'diabetes',
              'hypertension',
              'thyroid',
              'asthma',
              'lung',
              'cardiac',
              'kidney',
              'cirrhosis',
              'cancer',
              'liver',
              'other',
            ],
          },
        ],
        diagnosis: { type: String, required: false },
        diagnosisSchedule: { type: Date, required: false },
      },
    ],
    dietPlan: {
      foodAllergies: [
        {
          type: String,
          required: false,
          enum: ['dairy', 'gluten', 'peanuts', 'sea_food','soy', 'other'],
        },
      ],
      foodPreference: { type: String, required: false, enum: ['veg', 'non'] },
      mealsPerDay: { type: Number, required: false },
      sleepCycle: {
        type: String,
        required: false,
        enum: ['less_than_6', '6_to_8', 'greater_than_8'],
      },
      waterIntake: {
        type: String,
        required: false,
        enum: ['less_than_8', '8_to_12', 'greater_than_12'],
      },
      physicalActivities: { type: String, required: false, enum:['regular', 'occasional', 'seldom', 'never'] },
      alcoholic: { type: Boolean, required: false },
      smoker: { type: Boolean, required: false },
      hormonalImbalance: { type: Boolean, required: false },
      isThyroid: { type: Boolean, required: false },
      isDiabetic: { type: Boolean, required: false }
    },
    comorbidities: [{
      type:String,
      required: false
    }],
    spo2: {
      type: String,
      required:false
    },
    bp:{
      type: String,
      required:false
    },
    pulse:{
      type: String,
      required:false
    },
    heartRate:{
      type: String,
      required:false
    },
    sleepQuality:{
      type: String,
      required:false
    },
    mrn: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
      trim: true
    },
    opd: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
      trim: true
    },
    ipd: {
      type: String,
      sparse: true,
      default: null,
      trim: true
    },
    emergencyContact: {
      name: {
        type: String,
        default: null,
        trim: true
      },
      phoneNumber: {
        type: String,
        default: null,
        trim: true
      },
      relationship: {
        type: String,
        default: null
      }
    },
    clinicalStatus: {
      type: String,
      default: 'New patient - initial assessment pending',
      trim: true
    },
    clinicalFlags: [{
      type: String,
      trim: true
    }],
    clinicalNotes: {
      type: String,
      default: null,
      trim: true
    }
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("User", UserSchema);

Users.collection.createIndex({ mrn: 1 });
Users.collection.createIndex({ opd: 1 });
Users.collection.createIndex({ 'emergencyContact.phoneNumber': 1 });
Users.collection.createIndex({ clinicalFlags: 1 });

export default Users;