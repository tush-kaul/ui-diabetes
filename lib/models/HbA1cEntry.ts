import mongoose from 'mongoose'

// HbA1cEntry Model
const hbA1cSchema = new mongoose.Schema({
  phoneNumber: {                                                          // Matches Patient.ts model with support for international numbers
    type: String,
    required: true,                                                       // REQUIRED
    ref: 'Patient',
    validate: {
      validator: function(v: string) {
        const cleanNumber = v.replace(/[-\s()]/g, '');
        return /^(\+[1-9]\d{0,3}[0-9]{4,14}|00[1-9]\d{0,3}[0-9]{4,14}|[0-9]{7,15})$/.test(cleanNumber);
      },
      message: 'Please provide a valid phone number (with or without country code)'
    }
  },
  value: {
    type: Number,
    required: true,                   // REQUIRED
    min: [2.0, 'HbA1c value must be at least 2.0%'],                      // 2.0% to 3.0% have been recorded before          
    max: [27.0, 'HbA1c value cannot exceed 27.0%'],                       // 25.6% has been documented in medical literature
    validate: {
      validator: function(v: number) {
        return Number((v * 10) % 1) === 0                                 // Most lab reports show only one decimal place, I could be wrong
      },
      message: 'HbA1c value should have at most one decimal place'
    }
  },
  testDate: {
    type: Date,
    required: true,                                                       // REQUIRED
    validate: {
      validator: function(v: Date) {                                      // Allowing only upto 5 years of past data, anymore could result in overloading
        const today = new Date()
        const fiveYearsAgo = new Date()
        fiveYearsAgo.setFullYear(today.getFullYear() - 5)
        
        return v <= today && v >= fiveYearsAgo
      },
      message: 'Test date must be within the last 5 years and not in the future'
    }
  },
  labName: {
    type: String,
    required: true,                                                       // REQUIRED
    trim: true,
    maxLength: [100, 'Lab name cannot exceed 100 characters'],
  },
  notes: {
    type: String,
    required: false,                                                      // OPTIONAL; if doctor wants to leave notes 
    trim: true,
    maxLength: [500, 'Notes cannot exceed 500 characters'],
  },
  zone: {                                                                 // In the dashboard, mention not REQUIRED, doctor can add classification themselves
    type: String,                                                         // Doctor's insights >> Helper functions
    required: false,                                                      // OPTIONAL; if doctor enters value, no matter what system thinks Doctor >> System
    enum: {
      values: ['low', 'optimal', 'high'],
      message: 'Zone must be one of: low, optimal, high'
    },
    lowercase: true,
  },
  alertLevel: {                                                           // Same as "zone"
    type: String,
    required: false,
    enum: {
      values: ['none', 'cautionary', 'critical'],
      message: 'Alert level must be one of: none, cautionary, critical'
    },
    lowercase: true,
  },
}, {
  timestamps: true,
})

// Create compound indexes for efficient queries
hbA1cSchema.index({ phoneNumber: 1, testDate: -1 })
hbA1cSchema.index({ zone: 1 })
hbA1cSchema.index({ alertLevel: 1 })
hbA1cSchema.index({ testDate: -1 })
hbA1cSchema.index({ labName: 1, testDate: -1 })

// Helper functions, this function is what will give us our zone classification based on HbA1cEntry_value
function getSystemClassification(value: number) {
  if (value < 4.0) {
    return { zone: 'low', alertLevel: 'cautionary' }
  } else if (value <= 7.0) {
    return { zone: 'optimal', alertLevel: 'none' }
  } else if (value <= 8.5) {
    return { zone: 'high', alertLevel: 'cautionary' }
  } else {
    return { zone: 'high', alertLevel: 'critical' }
  }
}

// Helper functions, this function is what will give us our alertLevel classification based on what function getSystemClassification or zone is
function getAlertLevelForZone(zone: string, value: number) {
  switch (zone.toLowerCase()) {
    case 'low':
      return 'cautionary'
    case 'optimal':
      return 'none'
    case 'high':
      return value > 8.5 ? 'critical' : 'cautionary'
    default:
      return getSystemClassification(value).alertLevel
  }
}

// Helper function to autofill zone if left blank; auto fill the zone value based on what AlertLevel is
function getZoneForAlertLevel(alertLevel: string, value: number) {
  switch (alertLevel.toLowerCase()) {
    case 'none':
      return 'optimal'
    case 'cautionary':
      return value < 4.0 ? 'low' : 'high'
    case 'critical':
      return 'high'
    default:
      return getSystemClassification(value).zone
  }
}

// Pre-save middleware with international phone number formatting
hbA1cSchema.pre('save', function(next) {
  const value = this.value
  
  console.log(`Pre-save hook running for HbA1c value: ${value}%`)
  
// Check if the doctor has provided both zone and alertLevel
const doctorProvidedZone = this.isNew ? 
  (this.zone && this.zone !== undefined) : 
  this.isModified('zone')

const doctorProvidedAlertLevel = this.isNew ? 
  (this.alertLevel && this.alertLevel !== undefined) : 
  this.isModified('alertLevel')

// Case 1: Doctor provided both zone and alertLevel (Doctor >> System)
if (doctorProvidedZone && doctorProvidedAlertLevel && this.zone && this.alertLevel) {
  console.log(`Doctor override detected: zone=${this.zone}, alertLevel=${this.alertLevel}`)
  const systemSuggestion = getSystemClassification(value)
  console.log(`   → System would suggest: ${systemSuggestion.zone}/${systemSuggestion.alertLevel}`)
  console.log(`   → Using doctor's clinical judgment instead`)
}

// Case 2: Doctor provided zone only → calculate alertLevel using doctor's zone value
else if (doctorProvidedZone && this.zone && !doctorProvidedAlertLevel) {
  this.alertLevel = getAlertLevelForZone(this.zone, value)
  console.log(`Doctor provided zone: ${this.zone}, system calculated alertLevel: ${this.alertLevel}`)
}

// Case 3: Doctor provided alertLevel only → calculate zone using doctor's alertLevel
else if (doctorProvidedAlertLevel && this.alertLevel && !doctorProvidedZone) {
  this.zone = getZoneForAlertLevel(this.alertLevel, value)
  console.log(`Doctor provided alertLevel: ${this.alertLevel}, system calculated zone: ${this.zone}`)
}

// Case 4: No doctor input → use of helper function to calculate both zone and alertLevel
else {
  const systemClassification = getSystemClassification(value)
  this.zone = systemClassification.zone
  this.alertLevel = systemClassification.alertLevel
  console.log(`Automatic classification: ${this.zone}/${this.alertLevel}`)
}
  
  // for International phone number formatting
  if (this.phoneNumber) {
    // Clean the phone number
    let cleanPhone = this.phoneNumber.replace(/[\s\-\(\)]/g, '')
    
    // If it doesn't start with +, try to detect and add country code
    if (!cleanPhone.startsWith('+')) {
      // For backward compatibility, if it looks like Indian number, add +91
      if (cleanPhone.length === 10 && cleanPhone.startsWith('9')) {
        cleanPhone = '+91' + cleanPhone
      }
      // For US numbers starting with 1
      else if (cleanPhone.length === 11 && cleanPhone.startsWith('1')) {
        cleanPhone = '+' + cleanPhone
      }
      // For other 10+ digit numbers, keep as is (Indian format)
    }
    
    // Store the cleaned/formatted phone number
    this.phoneNumber = cleanPhone
  }
  
  console.log(`   → Final: zone=${this.zone}, alertLevel=${this.alertLevel}`)
  next()
})

export const HbA1cEntry = mongoose.models.HbA1cEntry || mongoose.model('HbA1cEntry', hbA1cSchema)

export default HbA1cEntry