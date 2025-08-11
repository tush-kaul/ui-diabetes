import mongoose from 'mongoose'


// Patient Model
const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,                                                                                             // REQUIRED
    trim: true,
    maxLength: [100, 'Name cannot exceed 100 characters'],
    validate: {
      validator: function(v: string) {
        return /^[a-zA-Z\s\-'\.]+$/.test(v)
      },
      message: 'Name can only contain letters, spaces, hyphens, and apostrophes'
    }
  },
  phoneNumber: {
    type: String,
    required: true,                                                                                             // REQUIRED
    unique: true,
    trim: true,
    validate: {
      validator: function(v: string) {                                                                          // INTERNATIONAL NUMBERS (+ / 00 PREFIX OR JUST PLAIN DIGITS); REMOVES, SPACES, DASHES AND BRACKETS BEFORE VALIDATING
        const cleanNumber = v.replace(/[-\s()]/g, '');
        
        return /^(\+[1-9]\d{0,3}[0-9]{4,14}|00[1-9]\d{0,3}[0-9]{4,14}|[0-9]{7,15})$/.test(cleanNumber);
      },
      message: 'Please provide a valid phone number (with or without country code)'
    }
  },
  ipd: {
    type: String,
    required: false,                                                                                            // OPTIONAL
    trim: true,
    sparse: true,        
    validate: {
      validator: function(v: string) {
        if (!v) return true                                                                                         
        return /^IPD-[A-Z]{3,6}-\d{3,6}$/.test(v) || v.length >= 3                                              // IPD FORMAT FOR NOW: IPD-DEPT-NUMBER (e.g., IPD-ENDO-001, IPD-RADIO-123)
      },
      message: 'IPD ID should follow format IPD-DEPT-NUMBER or be at least 3 characters'
    }
  },
  opd: {
    type: String,
    required: true,                                                                                             // REQUIRED
    unique: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        if (!v) return false                                                                                    // OPD FORMAT FOR NOW: OPD-DEPT-YYYY-NUMBER (e.g., OPD-DIAB-2024-001) (ADDING YEAR TO HELP DISTINGUISH FROM IPD)
        return /^OPD-[A-Z]{3,6}-\d{4}-\d{3,6}$/.test(v) || v.length >= 3
      },
      message: 'OPD ID should follow format OPD-DEPT-YYYY-NUMBER or be at least 3 characters'
    }
  },
  age: {
    type: Number,
    required: true,                                                                                             // REQUIRED
    min: [0, 'Age cannot be negative'],
    max: [125, 'Age cannot exceed 125 years'],                                                                  // FUN FACT: OLDER PERSON TO EVER LIVE 122 YEARS: Jeanne Calment
    validate: {
      validator: function(v: number) {
        return Number.isInteger(v)
      },
      message: 'Age must be a whole number'
    }
  },
  gender: {
    type: String,
    required: true,                                                                                             // REQUIRED
    enum: {
      values: ['male', 'female', 'transgender', 'prefer not to disclose', 'other'],                             // ADD ADDITIONAL GENDERS HERE IF NEEDED
      message: 'Gender must be one of: male, female, transgender, prefer not to disclose, other'                // MODIFY THIS AS WELL IF MORE GENDERS ARE ADDED
    },
    lowercase: true,
  },
  height: {
    type: Number,                                                                                               // NOTE: HEIGHT IN CMS
    required: true,                                                                                             // REQUIRED
    min: [20, 'Height must be at least 20 cm'],                                                                 // FUN FACT: SHORTEST BABY EVER WAS 20 CMS
    max: [300, 'Height cannot exceed 300 cm'],                                                                  // FUN FACT: TALLEST PERSON TO EVER LIVE WAS 272 CMS
    validate: {
      validator: function(v: number) {
        return Number.isInteger(v)
      },
      message: 'Height must be a whole number in centimeters'
    }
  },
  status: {
    type: String,
    required: true,                                                                                            // REQUIRED; IF LEFT BLANK, SYSTEM WILL USE DEFAULT (INCASE PATIENT NOT DIAGNOSED AT TIME OF ENTRY)
    trim: true,
    maxLength: [200, 'Status summary cannot exceed 200 characters'],
    default: 'New patient - initial assessment pending'
  },
  
  emergencyContact: {                                                                                          // ALL FIELDS IN EMERGENCY CONTACT ARE OPTIONAL
    name: {
      type: String,
      required: false,                                                                                          
      trim: true,
      maxLength: [100, 'Emergency contact name cannot exceed 100 characters']
    },
    phoneNumber: {
      type: String,
      required: false,
      trim: true,
      validate: {
        validator: function(v: string) {
          if (!v) return true
          const cleanNumber = v.replace(/[-\s()]/g, '');
          return /^(\+[1-9]\d{0,3}[0-9]{4,14}|00[1-9]\d{0,3}[0-9]{4,14}|[0-9]{7,15})$/.test(cleanNumber);
        },
        message: 'Emergency contact phone number must be valid'
      }
    },
    relationship: {
      type: String,
      required: false,
      trim: true,
      enum: {
        values: ['spouse', 'parent', 'child', 'sibling', 'relative', 'friend', 'other'],
        message: 'Emergency contact must be: spouse, parent, child, sibling, relative, friend or other'
      }
    }
  },
  
  mrn: {
    type: String,
    required: false,                                                                                            // IF NOT PROVIDED, AUTO GENERATED
    unique: true,
    sparse: true,                                                                                               // THIS CREATES THE INDEX AUTOMATICALLY, NO NEED FOR DUPLICATE INDEX
    trim: true,                                                                                                 // MRN FORMAT FOR NOW: MRN-YYYY-XXXXXX (e.g., MRN-2024-000001)
    validate: {
      validator: function(v: string) {
        if (!v) return true
        return /^MRN-\d{4}-\d{6}$/.test(v)
      },
      message: 'MRN should follow format MRN-YYYY-XXXXXX'
    }
  }
}, {
  timestamps: true,
})


patientSchema.index({ name: 1 })                 
patientSchema.index({ age: 1, gender: 1 })       
patientSchema.index({ 'emergencyContact.phoneNumber': 1 })


patientSchema.pre('save', function(next) {                                                                        // PRE-SAVE FOR BETTER ID GENERATION
  console.log(`Processing patient: ${this.name}`)
  
  if (this.phoneNumber) {                                                                                         // PHONE NUMBER FORMATTING DURING PRE-SAVE
    let cleaned = this.phoneNumber.replace(/[\s\-\(\)]/g, '').trim();
    
    if (cleaned.startsWith('00')) {                                                                               // TO AUTOMATICALLY DETECT EUROPEAN STYLE INPUT FORMAT AND CLEAN
      cleaned = '+' + cleaned.substring(2)
      console.log(`   Converted European format: ${cleaned}`)
    }
    else if (/^[6-9]\d{9}$/.test(cleaned)) {                                                                      // TO AUTOMATICALLY DETECT INDIAN NUMBER AND CLEAN
      cleaned = '+91-' + cleaned;
      console.log(`   Added India country code: ${cleaned}`)
    }
    else if (/^1\d{10}$/.test(cleaned)) {                                                                         // AUTOMATICALLY DETECT US NUMBER AND CLEAN
      cleaned = '+' + cleaned;
      console.log(`   Added US country code: ${cleaned}`)
    }
    else if (cleaned.startsWith('+91') && !cleaned.includes('-')) {                                               // IMPLEMENT PROPER FORMATTING FOR EXISITING (+) PHONE NUMBERS
      cleaned = cleaned.replace('+91', '+91-')
      console.log(`   Formatted Indian number: ${cleaned}`)
    }
    else if (cleaned.startsWith('+1') && cleaned.length === 12 && !cleaned.includes('-')) {
      cleaned = cleaned.replace('+1', '+1-')
      console.log(`   Formatted US number: ${cleaned}`)
    }
    
    this.phoneNumber = cleaned;
  }
  
  if (this.emergencyContact && this.emergencyContact.phoneNumber) {                                               // SIMILARLY FOR EMERGENCY CONTACT DETAILS
    let cleaned = this.emergencyContact.phoneNumber.replace(/[\s\-\(\)]/g, '').trim();
    
    if (cleaned.startsWith('00')) {
      cleaned = '+' + cleaned.substring(2)
    } else if (/^[6-9]\d{9}$/.test(cleaned)) {
      cleaned = '+91-' + cleaned;
    } else if (/^1\d{10}$/.test(cleaned)) {
      cleaned = '+' + cleaned;
    } else if (cleaned.startsWith('+91') && !cleaned.includes('-')) {
      cleaned = cleaned.replace('+91', '+91-')
    } else if (cleaned.startsWith('+1') && cleaned.length === 12 && !cleaned.includes('-')) {
      cleaned = cleaned.replace('+1', '+1-')
    }
    
    this.emergencyContact.phoneNumber = cleaned;
  }
  
  if (!this.opd) {                                                                                                // TO AUTO GENERATE OPD
    const currentYear = new Date().getFullYear()
    const randomId = Math.random().toString(36).substr(2, 3).toUpperCase()
    const timestamp = Date.now().toString().slice(-6)                                                             // USES LAST 6 DIGITS OF TIME STAMP
    
    this.opd = `OPD-GEN-${currentYear}-${timestamp}${randomId}`
    console.log(`   Generated OPD: ${this.opd}`)
  }
  
  if (!this.mrn) {                                                                                                // AUTO GENERATE MRN
    const currentYear = new Date().getFullYear()
    const patientCount = Math.floor(Math.random() * 999999) + 1                                                   // UPON PROPER IMPLEMENATION; WE MAKE THIS ZERO (CHANGE FOR PRODUCTION)
    const mrnNumber = patientCount.toString().padStart(6, '0')                                                    // PAD WTH ZEROS (CHANGE FOR PRODUCTION)
    
    this.mrn = `MRN-${currentYear}-${mrnNumber}`
    console.log(`   Generated MRN: ${this.mrn}`)
  }
  
  console.log(`   Patient processing complete`)
  next()
})


patientSchema.methods.getDisplayInfo = function() {                                                                 // METHOD TO DISPLAY FULL PATIENT DATA
  return {
    displayName: this.name,
    displayAge: `${this.age} years old`,
    displayGender: this.gender.charAt(0).toUpperCase() + this.gender.slice(1),
    displayHeight: `${this.height} cm`,
    displayPhone: this.phoneNumber,
    displayIds: {
      mrn: this.mrn,
      opd: this.opd,
      ipd: this.ipd || 'Not admitted'
    }
  }
}


patientSchema.statics.findByPhone = function(phoneNumber: string) {                                                // METHOD TO FIND PATIENT USING PHONE NUMBER
  const cleaned = phoneNumber.replace(/[-\s()]/g, '').trim()                                                       // CLEAN PHONE NUMBER TO ENSURE PROPER SYNTAX SEARCH
  
  return this.findOne({                                                                                            // ADDITIONAL SYNTAX SEARCH TO ENSURE SEARCH DOES NOT FAIL
    $or: [
      { phoneNumber: phoneNumber },
      { phoneNumber: cleaned },
      { phoneNumber: '+91-' + cleaned.replace('+91', '').replace('-', '') },
      { phoneNumber: '+91' + cleaned.replace('+91', '').replace('-', '') }
    ]
  })
}


export const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema)


export default Patient