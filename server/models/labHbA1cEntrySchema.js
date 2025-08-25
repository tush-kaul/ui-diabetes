'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const LabHbA1cEntrySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mobile: {
      type: String,
      default: null,
      trim: true,
    },
    value: {
      type: Number,
      required: true,
    },
    testDate: {
      type: Date,
      required: true,
    },
    labName: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      required: false,
      trim: true,
    },
    zone: {
      type: String,
      required: false,
      enum: ['very low', 'low', 'optimal', 'high', 'very high'],
      lowercase: true,
    },
    alertLevel: {
      type: String,
      required: false,
      enum: ['none', 'borderline caution', 'caution', 'borderline critical', 'critical'],
      lowercase: true,
    },
    doctorOverrideZone: {
      type: Boolean,
      default: false,
      required: false,
    },
    doctorOverrideAlertLevel: {
      type: Boolean,
      default: false,
      required: false,
    },
    clinicalReasoning: {
      type: String,
      required: false,
      trim: true,
    }
  },
  { timestamps: true }
);

// Indexes for analytics and queries
LabHbA1cEntrySchema.index({ user: 1, testDate: -1 });
LabHbA1cEntrySchema.index({ zone: 1, testDate: -1 });
LabHbA1cEntrySchema.index({ alertLevel: 1, testDate: -1 });
LabHbA1cEntrySchema.index({ testDate: -1 });
LabHbA1cEntrySchema.index({ labName: 1, testDate: -1 });
LabHbA1cEntrySchema.index({ mobile: 1, testDate: -1 });
LabHbA1cEntrySchema.index({ doctorOverrideZone: 1 });
LabHbA1cEntrySchema.index({ doctorOverrideAlertLevel: 1 });

// Classification helper functions
function getSystemClassification(value) {
  if (value < 3.5) {
    return { zone: 'very low', alertLevel: 'critical' };
  } else if (value <= 3.7) {
    return { zone: 'very low', alertLevel: 'borderline critical' };
  } else if (value <= 4.5) {
    return { zone: 'low', alertLevel: 'caution' };
  } else if (value <= 4.7) {
    return { zone: 'low', alertLevel: 'borderline caution' };
  } else if (value <= 7.3) {
    return { zone: 'optimal', alertLevel: 'none' };
  } else if (value <= 7.5) {
    return { zone: 'high', alertLevel: 'borderline caution' };
  } else if (value <= 8.3) {
    return { zone: 'high', alertLevel: 'caution' };
  } else if (value <= 8.5) {
    return { zone: 'very high', alertLevel: 'borderline critical' };
  } else {
    return { zone: 'very high', alertLevel: 'critical' };
  }
}

function getPredefinedAlertLevelForZone(zone, value) {
  switch (zone.toLowerCase()) {
    case 'very low':
      return value < 3.5 ? 'critical' : 'borderline critical';
    case 'low':
      return value <= 4.5 ? 'caution' : 'borderline caution';
    case 'optimal':
      return 'none';
    case 'high':
      return value <= 7.5 ? 'borderline caution' : 'caution';
    case 'very high':
      return value <= 8.5 ? 'borderline critical' : 'critical';
    default:
      return getSystemClassification(value).alertLevel;
  }
}

function getTypicalZoneForAlertLevel(alertLevel, value) {
  switch (alertLevel.toLowerCase()) {
    case 'none':
      return 'optimal';
    case 'borderline caution':
      if (value <= 4.7) return 'low';
      else if (value <= 7.5) return 'high';
      else return 'very high';
    case 'caution':
      return value <= 4.5 ? 'low' : 'high';
    case 'borderline critical':
      return value <= 3.7 ? 'very low' : 'very high';
    case 'critical':
      return value < 3.5 ? 'very low' : 'very high';
    default:
      return getSystemClassification(value).zone;
  }
}

// Pre-save hook for classification logic only
LabHbA1cEntrySchema.pre('save', function(next) {
  const value = this.value;

  const doctorProvidedZone = this.isNew
    ? (this.zone && this.zone !== undefined)
    : this.isModified('zone');

  const doctorProvidedAlertLevel = this.isNew
    ? (this.alertLevel && this.alertLevel !== undefined)
    : this.isModified('alertLevel');

  const systemClassification = getSystemClassification(value);

  if (doctorProvidedZone && doctorProvidedAlertLevel && this.zone && this.alertLevel) {
    this.doctorOverrideZone = true;
    this.doctorOverrideAlertLevel = true;
  } else if (doctorProvidedZone && this.zone && !doctorProvidedAlertLevel) {
    this.alertLevel = getPredefinedAlertLevelForZone(this.zone, value);
    this.doctorOverrideZone = true;
    this.doctorOverrideAlertLevel = false;
  } else if (doctorProvidedAlertLevel && this.alertLevel && !doctorProvidedZone) {
    this.zone = getTypicalZoneForAlertLevel(this.alertLevel, value);
    this.doctorOverrideZone = false;
    this.doctorOverrideAlertLevel = true;
  } else {
    this.zone = systemClassification.zone;
    this.alertLevel = systemClassification.alertLevel;
    this.doctorOverrideZone = false;
    this.doctorOverrideAlertLevel = false;
  }

  next();
});

const LabHbA1cEntry = mongoose.model('LabHbA1cEntry', LabHbA1cEntrySchema);
export default LabHbA1cEntry;