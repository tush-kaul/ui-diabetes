import mongoose from 'mongoose'


// HbA1cEntry Model
const hbA1cSchema = new mongoose.Schema({
  phoneNumber: {                                                                                      // USED AS MAIN PATIENT ID
    type: String,
    required: true,                                                                                   // REQUIRED
    ref: 'Patient',
    validate: {                                                                                       // INTERNATIONAL NUMBERS (+ / 00 PREFIX OR JUST PLAIN DIGITS); REMOVES, SPACES, DASHES AND BRACKETS BEFORE VALIDATING
      validator: function(v: string) {                                                                
        const cleanNumber = v.replace(/[-\s()]/g, '');
        return /^(\+[1-9]\d{0,3}[0-9]{4,14}|00[1-9]\d{0,3}[0-9]{4,14}|[0-9]{7,15})$/.test(cleanNumber);
      },
      message: 'Please provide a valid phone number (with or without country code)'
    }
  },
  value: {
    type: Number,
    required: true,                                                                                    // REQUIRED
    min: [2.0, 'HbA1c value must be at least 2.0%'],                                                   // LOWEST EVER RECORDED VALUES WERE BETWEEN 2.0% - 3.0%
    max: [27.0, 'HbA1c value cannot exceed 27.0%'],
    validate: {
      validator: function(v: number) {
        return Number((v * 10) % 1) === 0                                                              // ONE DECIMAL PLACE AS PER STANDARD
      },
      message: 'HbA1c value should have at most one decimal place'
    }
  },
  testDate: {
    type: Date,
    required: true,                                                                                    // REQUIRED
    validate: {
      validator: function(v: Date) {
        const today = new Date()
        const fiveYearsAgo = new Date()
        fiveYearsAgo.setFullYear(today.getFullYear() - 5)
        
        return v <= today && v >= fiveYearsAgo                                                         // UPTO 5 YEARS OF DATA HISTORY FOR RELEVANCE AND CONTROLLING DATASET SIZE
      },
      message: 'Test date must be within the last 5 years and not in the future'


    }
  },
  labName: {
    type: String,
    required: true,                                                                                   // REQUIRED
    trim: true,
    maxLength: [100, 'Lab name cannot exceed 100 characters'],
  },
  notes: {
    type: String,
    required: false,                                                                                  // OPTIONAL; DOCTOR CAN ADD ADDITIONAL NOTES                                                                                   
    trim: true,
    maxLength: [500, 'Notes cannot exceed 500 characters'],
  },
  zone: {
    type: String,
    required: false,                                                                                  // OPTIONAL; DOCTOR OR AUTO-SYSTEM CLASSIFICATION USING HELPER FUNCTION "getSystemClassification(value: number)""
    enum: {
      values: ['very low', 'low', 'optimal', 'high', 'very high'],
      message: 'Zone must be one of: very low, low, optimal, high, very high'
    },
    lowercase: true,
  },
  alertLevel: {
    type: String,
    required: false,                                                                                  // OPTIONAL; DOC OR HELPER FUNCTION "getPredefinedAlertLevelForZone(zone: string, value: number)"
    enum: {
      values: ['none', 'borderline caution', 'caution', 'borderline critical', 'critical'],
      message: 'Alert level must be one of: none, borderline caution, caution, borderline critical, critical'
    },
    lowercase: true,
  },
  
  doctorOverrideZone: {
    type: Boolean,
    default: false,
    required: false,                                                                                  // TRACK WHEN DOCTOR SETS THE ZONE OR USES SYSTEM CLASSIFICATION
  },
  doctorOverrideAlertLevel: {
    type: Boolean,
    default: false,                                                         
    required: false,                                                                                  // TRACK WHEN DOCTOR SETS THE ALERT LEVEL OR USES SYSTEM CLASSIFICATION
  },
  clinicalReasoning: {
    type: String,
    required: false,
    trim: true,
    maxLength: [300, 'Clinical reasoning cannot exceed 300 characters'],                              // OPTIONAL: IF DOCTOR WANTS TO EXPLAIN WHY THE OVERRIDE

  }
}, {
  timestamps: true,
})


hbA1cSchema.index({ phoneNumber: 1, testDate: -1 })                                                   // INITIATE INDEXES FOR QUERYING
hbA1cSchema.index({ zone: 1 })
hbA1cSchema.index({ alertLevel: 1 })
hbA1cSchema.index({ testDate: -1 })
hbA1cSchema.index({ labName: 1, testDate: -1 })
hbA1cSchema.index({ doctorOverrideZone: 1 })                                                          // TRACK DOCTOR OVERRIDES
hbA1cSchema.index({ doctorOverrideAlertLevel: 1 })                                                    // TRACK DOCTOR OVERRIDES


function getSystemClassification(value: number) {                                                     // SYSTEM CLASSIFIER (AS PER DRAWING)
  if (value < 3.5) {
    return { zone: 'very low', alertLevel: 'critical' }
  } else if (value <= 3.7) {
    return { zone: 'very low', alertLevel: 'borderline critical' }
  } else if (value <= 4.5) {
    return { zone: 'low', alertLevel: 'caution' }
  } else if (value <= 4.7) {
    return { zone: 'low', alertLevel: 'borderline caution' }
  } else if (value <= 7.3) {
    return { zone: 'optimal', alertLevel: 'none' }
  } else if (value <= 7.5) {
    return { zone: 'high', alertLevel: 'borderline caution' }
  } else if (value <= 8.3) {
    return { zone: 'high', alertLevel: 'caution' }
  } else if (value <= 8.5) {
    return { zone: 'very high', alertLevel: 'borderline critical' }
  } else {
    return { zone: 'very high', alertLevel: 'critical' }
  }
}


function getPredefinedAlertLevelForZone(zone: string, value: number) {                                // SYSTEM CLASSIFIER (AS PER DRAWING)
  switch (zone.toLowerCase()) {
    case 'very low':
      return value < 3.5 ? 'critical' : 'borderline critical'
    case 'low':
      return value <= 4.5 ? 'caution' : 'borderline caution'
    case 'optimal':
      return 'none'
    case 'high':
      return value <= 7.5 ? 'borderline caution' : 'caution'
    case 'very high':
      return value <= 8.5 ? 'borderline critical' : 'critical'
    default:
      return getSystemClassification(value).alertLevel
  }
}


function getTypicalZoneForAlertLevel(alertLevel: string, value: number) {                             // GET ZONE IF "alertLevel" IS GIVEN
  switch (alertLevel.toLowerCase()) {
    case 'none':
      return 'optimal'
    case 'borderline caution':
      if (value <= 4.7) return 'low'
      else if (value <= 7.5) return 'high'
      else return 'very high'
    case 'caution':
      return value <= 4.5 ? 'low' : 'high'
    case 'borderline critical':
      return value <= 3.7 ? 'very low' : 'very high'
    case 'critical':
      return value < 3.5 ? 'very low' : 'very high'
    default:
      return getSystemClassification(value).zone
  }
}


hbA1cSchema.pre('save', function(next) {                                                              // PRE-SAVE WHEN "HbA1c" IS ENTERED BY DOCTOR FOR SYSTEM CLASSIFICATION TO WORK PROPERLY
  const value = this.value
  
  console.log(`Pre-save hook running for HbA1c value: ${value}%`)
  
  const doctorProvidedZone = this.isNew ?                                                             // CHECK IF DOCTOR ENTERES ZONE
    (this.zone && this.zone !== undefined) : 
    this.isModified('zone')


  const doctorProvidedAlertLevel = this.isNew ?                                                       // CHECK IF DOCTOR ENTERS ALERTLEVEL
    (this.alertLevel && this.alertLevel !== undefined) : 
    this.isModified('alertLevel')


    const systemClassification = getSystemClassification(value)                                       // RETURN SYSTEM CLASSIFIER'S OUTPUT AS A PROMPT TO DOCTOR (LIKE A SUGGESTION HEY THIS WHAT THE SYSTEM THOUGHT, JUST DOUBLE-CHECK)


  if (doctorProvidedZone && doctorProvidedAlertLevel && this.zone && this.alertLevel) {               // CASE 1: DOCTOR PROVIDES BOTH zone AND alertLevel (DOCTOR FULL OVERRIDE)
    console.log(`Full doctor override: zone=${this.zone}, alertLevel=${this.alertLevel}`)
    console.log(`   → System would suggest: ${systemClassification.zone}/${systemClassification.alertLevel}`)
    console.log(`   → Using complete doctor override`)
    
    this.doctorOverrideZone = true                                                                    // zone && alertLevel: OVERRIDE
    this.doctorOverrideAlertLevel = true
  }


  else if (doctorProvidedZone && this.zone && !doctorProvidedAlertLevel) {                            // CASE 2: DOCTOR ENTERS zone BUT WANTS alertLevel; SYSTEM USES DOCTOR'S zone INPUT TO DETERMINE
    this.alertLevel = getPredefinedAlertLevelForZone(this.zone, value)
    console.log(`Doctor zone override: ${this.zone}`)
    console.log(`   → Using predefined alert level for zone: ${this.alertLevel}`)
    
    this.doctorOverrideZone = true                                                                    // zone: OVERRIDE && alertLevel: PARTIAL SYSTEM CLASSIFICATION
    this.doctorOverrideAlertLevel = false
  }


  else if (doctorProvidedAlertLevel && this.alertLevel && !doctorProvidedZone) {                      // CASE 3: DOCTOR ENTERS alertLevel BUT WANTS zone: SYSTEM USES DOCTOR'S alertLevel INPUT TO DETERMINE
    this.zone = getTypicalZoneForAlertLevel(this.alertLevel, value)
    console.log(`Doctor alert level override: ${this.alertLevel}`)
    console.log(`   → Using typical zone for alert level: ${this.zone}`)
    
    this.doctorOverrideZone = false                                                                   // zone: PARTIAL SYSTEM CLASSIFICATION && alertLevel: OVERRIDE
    this.doctorOverrideAlertLevel = true
  }


  else {                                                                                              // CASE 4: DOCTOR ENTERS NOTHING; FULL SYSTEM CLASSIFICATION    
    this.zone = systemClassification.zone
    this.alertLevel = systemClassification.alertLevel
    console.log(`Complete predefined classification: ${this.zone}/${this.alertLevel}`)
    
    this.doctorOverrideZone = false                                                                   // zone && alertLevel: SYSTEM CLASSIFICATION
    this.doctorOverrideAlertLevel = false
  }
  
  if (this.phoneNumber) {                                                                             // PHONE NUMBER FORMATTING FUNCTION - UPDATED TO MATCH PATIENT MODEL
    let cleaned = this.phoneNumber.replace(/[\s\-\(\)]/g, '').trim();
    
    if (cleaned.startsWith('00')) {                                                                   // HANDLE EUROPEAN FORMAT (00XX) FIRST
      cleaned = '+' + cleaned.substring(2)
      console.log(`Converted European format: ${cleaned}`)
      
      if (cleaned.startsWith('+91') && !cleaned.includes('-')) {                                     // ADDITIONAL CHECK: IF EUROPEAN FORMAT CONVERTS TO INDIAN NUMBER, ADD DASH
        cleaned = cleaned.replace('+91', '+91-')
        console.log(`Added dash to converted Indian number: ${cleaned}`)
      }
    }
    else if (/^[6-9]\d{9}$/.test(cleaned)) {                                                          // HANDLE INDIAN NUMBERS WITHOUT COUNTRY CODE
      cleaned = '+91-' + cleaned;
      console.log(`Added India country code: ${cleaned}`)
    }
    else if (/^1\d{10}$/.test(cleaned)) {                                                             // HANDLE US NUMBERS WITHOUT COUNTRY CODE (11 DIGITS STARTING WITH 1)
      cleaned = '+' + cleaned;
      console.log(` Added US country code: ${cleaned}`)
    }
    else if (cleaned.startsWith('+91') && !cleaned.includes('-')) {                                   // ADD PROPER DASH FORMATTING FOR INDIAN NUMBERS
      cleaned = cleaned.replace('+91', '+91-')
      console.log(`Formatted Indian number with dash: ${cleaned}`)
    }
    else if (cleaned.startsWith('+1') && cleaned.length === 12 && !cleaned.includes('-')) {          // ADD PROPER DASH FORMATTING FOR US NUMBERS
      cleaned = cleaned.replace('+1', '+1-')
      console.log(`Formatted US number with dash: ${cleaned}`)
    }
    
    this.phoneNumber = cleaned
  }
  
  console.log(`   → Final: zone=${this.zone}, alertLevel=${this.alertLevel}`)
  console.log(`   → Override flags: zone=${this.doctorOverrideZone}, alertLevel=${this.doctorOverrideAlertLevel}`)
  next()
})


export const HbA1cEntry = mongoose.models.HbA1cEntry || mongoose.model('HbA1cEntry', hbA1cSchema)


export default HbA1cEntry