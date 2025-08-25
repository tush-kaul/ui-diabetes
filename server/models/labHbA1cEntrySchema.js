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
    
    value: {
      type: Number,
      required: true
    },
    
    testDate: {
      type: Date,
      required: true
    },
    
    labName: {
      type: String,
      required: true,
      trim: true
    },
    
    notes: {
      type: String,
      required: false,
      trim: true
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
      trim: true
    },
    
    // Phone snapshot for audit trail (simple strings)
    phoneSnapshot: {
      e164: { type: String, default: null },
      raw: { type: String, default: null }
    },
    
    // Account snapshot for faster joins
    accountSnapshot: {
      accountId: { type: Schema.Types.ObjectId, ref: 'Account', default: null },
      countryCode: { type: String, default: null },
      mobile: { type: String, default: null }
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
LabHbA1cEntrySchema.index({ doctorOverrideZone: 1 });
LabHbA1cEntrySchema.index({ doctorOverrideAlertLevel: 1 });

// Classification helper functions (keep your core logic)
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
  
  console.log(`Pre-save hook running for HbA1c value: ${value}%`);
  
  const doctorProvidedZone = this.isNew ? 
    (this.zone && this.zone !== undefined) : 
    this.isModified('zone');

  const doctorProvidedAlertLevel = this.isNew ? 
    (this.alertLevel && this.alertLevel !== undefined) : 
    this.isModified('alertLevel');

  const systemClassification = getSystemClassification(value);

  if (doctorProvidedZone && doctorProvidedAlertLevel && this.zone && this.alertLevel) {
    // Case 1: Doctor provides both zone AND alertLevel
    console.log(`Full doctor override: zone=${this.zone}, alertLevel=${this.alertLevel}`);
    console.log(`   → System would suggest: ${systemClassification.zone}/${systemClassification.alertLevel}`);
    
    this.doctorOverrideZone = true;
    this.doctorOverrideAlertLevel = true;
  }
  else if (doctorProvidedZone && this.zone && !doctorProvidedAlertLevel) {
    // Case 2: Doctor enters zone, system calculates alertLevel
    this.alertLevel = getPredefinedAlertLevelForZone(this.zone, value);
    console.log(`Doctor zone override: ${this.zone}`);
    console.log(`   → Using predefined alert level for zone: ${this.alertLevel}`);
    
    this.doctorOverrideZone = true;
    this.doctorOverrideAlertLevel = false;
  }
  else if (doctorProvidedAlertLevel && this.alertLevel && !doctorProvidedZone) {
    // Case 3: Doctor enters alertLevel, system calculates zone
    this.zone = getTypicalZoneForAlertLevel(this.alertLevel, value);
    console.log(`Doctor alert level override: ${this.alertLevel}`);
    console.log(`   → Using typical zone for alert level: ${this.zone}`);
    
    this.doctorOverrideZone = false;
    this.doctorOverrideAlertLevel = true;
  }
  else {
    // Case 4: Full system classification
    this.zone = systemClassification.zone;
    this.alertLevel = systemClassification.alertLevel;
    console.log(`Complete system classification: ${this.zone}/${this.alertLevel}`);
    
    this.doctorOverrideZone = false;
    this.doctorOverrideAlertLevel = false;
  }
  
  console.log(`   → Final: zone=${this.zone}, alertLevel=${this.alertLevel}`);
  console.log(`   → Override flags: zone=${this.doctorOverrideZone}, alertLevel=${this.doctorOverrideAlertLevel}`);
  next();
});

const LabHbA1cEntry = mongoose.model('LabHbA1cEntry', LabHbA1cEntrySchema);
export default LabHbA1cEntry;
