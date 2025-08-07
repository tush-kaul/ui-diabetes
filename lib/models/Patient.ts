import mongoose from 'mongoose'

// Patient Model 
const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,               // REQUIRED
    trim: true,
    maxLength: [100, 'Name cannot exceed 100 characters'],
  },
  phoneNumber: {
    type: String,
    required: true,               // REQUIRED
    unique: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        // Cleaning: Remove all spaces, hyphens, and parentheses
        const cleanNumber = v.replace(/[-\s()]/g, '');
        
        // TO ADD ON TOP OF FIELD TO ENTER PHONE NUMBER
        // -> Must start with + followed by 1-3 digits (country code) and 4-15 total digits
        // -> OR start with 00 followed by country code and number
        // -> OR be a local number (7-15 digits without country code)
        return /^(\+[1-9]\d{0,3}[0-9]{4,14}|00[1-9]\d{0,3}[0-9]{4,14}|[0-9]{7,15})$/.test(cleanNumber);
      },
      message: 'Please provide a valid phone number (with or without country code)'
    }
  },
  ipd: {
    type: String,
    required: false,              // OPTIONAL: Not Every Patient Checking in Would be Admitted
    trim: true,
    sparse: true,
    validate: {
      validator: function(v: string) {
        return !v || v.length >= 3
      },
      message: 'IPD ID must be at least 3 characters long'
    }
  },
  opd: {
    type: String,
    required: true,               // REQUIRED
    unique: true,
    trim: true,
    validate: {                   // To do: Understand why this is throwing an error, despite correct logic and syntax and even that it is working
      validator: function(v: string) {
        return v && v.length >= 3
      },
      message: 'OPD ID must be at least 3 characters long'
    }
  },
  age: {
    type: Number,
    required: true,               // REQUIRED
    min: [0, 'Age cannot be negative'],
    max: [125, 'Age cannot exceed 125 years'],          // Fun fact: Oldest Person to Ever Live was 122 Years Old
  },
  gender: {
    type: String,
    required: true,              // REQUIRED
    enum: {
      values: ['male', 'female', 'transgender', 'prefer not to disclose', 'other'],         
      // Add more genders here incase of chances of being cancelled ^^
      
      message: 'Gender must be one of: male, female, transgender, prefer not to disclose, other'    
      // Update this as well if you add or change the values ^^
    },
    lowercase: true,
  },
  height: {
    type: Number,
    required: true,               // REQUIRED
    min: [20, 'Height must be at least 20 cm'],           // Fun fact: Shortest baby ever was 24 cms
    max: [300, 'Height cannot exceed 300 cm'],            // Fun fact: Tallest person ever was 272 cms
    validate: {
      validator: function(v: number) {
        return Number.isInteger(v)
      },
      message: 'Height must be a whole number in centimeters'
    }
  },
  status: {
    type: String,
    required: true,               // REQUIRED
    trim: true,
    maxLength: [200, 'Status summary cannot exceed 200 characters'],
    default: 'New patient - initial assessment pending'
  },
}, {
  timestamps: true,
})

// Indexes - only create for fields that don't already have a unique/sparse attribute
patientSchema.index({ name: 1 })                 // Name search
patientSchema.index({ age: 1, gender: 1 })       // Demographics filtering

// Pre-save middleware with international phone number support
patientSchema.pre('save', function(next) {
  // FIXED: Handle international phone numbers properly
  if (this.phoneNumber) {
    // Clean the phone number but preserve international format
    let cleaned = this.phoneNumber.replace(/\s+/g, '').trim();
    // To do: Understand why this is throwing an error, despite correct logic and syntax and even that it is working
    
    // Only add +91 if it's a 10-digit Indian number without country code
    if (/^[6-9]\d{9}$/.test(cleaned)) {
      cleaned = '+91' + cleaned;
    }
    
    this.phoneNumber = cleaned;
  }
  
  // Auto-generate OPD if not provided (TO DO: CONFIRM FORMAT OF OPD FOLLOWED AT CASAMED; for now this should make the auto-generated OPD distinguishble)
  if (!this.opd) {
    this.opd = `OPD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }
  
  next();
});

export const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema);

export default Patient;