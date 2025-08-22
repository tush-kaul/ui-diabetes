'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AppointmentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    partner: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
    partnerType: {
      type: String,
      enum: ['Doctor', 'Physio'],
      required: false,
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
      required: false,
    },
    department: {
      type: String,
      enum: ['orthopedic', 'gynaecology', 'sports_injury', 'pcod'],
      required: true,
    },
    appointmentType: {
      type: String,
      enum: [
        'Physio Evaluation',
        'Physio Session',
        'Doctor Consultation',
        'Diet',
        'Dietician',
        'Home Visit',
      ],
      default: 'Physio Evaluation',
    },
    prescription: {
      type: String,
      default: null,
    },
    notes: [
      {
        type: String,
        default: null,
      },
    ],
    document: {
      type: Schema.Types.ObjectId,
      ref: 'MedicalRecord',
      default: null,
    },
    schedule: {
      type: Date,
      required: false,
    },
    timeDuration: {
      type: Number,
      required: false,
      default:10
    },
    status: {
      type: String,
      enum: ['created', 'active', 'completed', 'cancelled', 'expired','paid'],
      default: 'created',
    },
    payment: {
      type: Boolean,
      default: false,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
      default: null,
    },
    cancelled: {
      type: Boolean,
      default: false,
    },
    reasonForCancellation: {
      type: String,
      required: false,
    },
    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
    cancelledByType: {
      type: String,
      enum: ['Doctor', 'Physio', 'Client', 'Admin'],
    },
  },
  {
    timestamps: true,
  }
);
const Appointments = mongoose.model('Appointment', AppointmentSchema);

export default Appointments;
