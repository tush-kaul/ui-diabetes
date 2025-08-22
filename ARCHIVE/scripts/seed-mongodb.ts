import connectDB, { disconnectDB } from '../lib/mongodb'
import Patient from '../lib/models/Patient'
import HbA1cEntry from '../lib/models/HbA1cEntry'

async function seedDatabase() {
  try {
    console.log('Starting MongoDB seed with test data...')
    
    await connectDB()

    // Clear any existing data for fresh start and prevent conflicts 
    // !!!!!!!!!(TO NEVER RUN THIS WHEN WE HAVE ACTUAL PATIENT DATA AND ARE USING THIS IN A PRODUCTION ENV)!!!!!!!!
    console.log('Clearing existing data...')
    await Patient.deleteMany({})
    await HbA1cEntry.deleteMany({})

    // Create different test patients to cover all data validation scenarios
    console.log('Creating test patients...')
    
    const patients = [
      {
        name: 'Rajesh Kumar',
        phoneNumber: '9876543210', // test whether number will auto-format to Indian +91 format
        ipd: 'IPD-ENDO-001',
        opd: 'OPD-DIAB-2024-001',
        age: 45,
        gender: 'male',
        height: 170,
        status: 'Type 2 diabetes with poor glycemic control, on insulin therapy',
        emergencyContact: {
          name: 'Sunita Kumar',
          phoneNumber: '9876543220',
          relationship: 'spouse'
        }
      },
      {
        name: 'Dr. Priya Sharma',
        phoneNumber: '+91-9876543211', // What happens when number is already pre-formatted, ideally nothing should happen
        opd: 'OPD-CARD-2024-002',
        age: 38,
        gender: 'female',
        height: 162,
        status: 'Well controlled diabetes, diet and exercise management',
        emergencyContact: {
          name: 'Amit Sharma',
          phoneNumber: '+919876543221',
          relationship: 'spouse'
        }
      },
      {
        name: "Alex O'Connor-Johnson", // Testing complex name with symbols in the name; ideally should not reject it
        phoneNumber: '00919876543212', // European phone number format; ideally should convert to match our phone number formatting preference
        ipd: 'IPD-CARD-002',
        opd: 'OPD-CARD-2024-003',
        age: 52,
        gender: 'transgender',
        height: 175,
        status: 'Type 2 diabetes with cardiovascular complications requiring critical monitoring',
        emergencyContact: {
          name: 'Maria Johnson',
          phoneNumber: '00919876543222',
          relationship: 'spouse'
        }
      },
      {
        name: 'Anonymous Patient',
        phoneNumber: '+1-555-123-4567', // US number phone formatting; ideally should not cause any issue
        opd: 'OPD-DIAB-2024-004',
        age: 29,
        gender: 'prefer not to disclose',
        height: 168,
        status: 'Recently diagnosed Type 1 diabetes - education and stabilization phase',
        emergencyContact: {
          name: 'John Doe',
          phoneNumber: '+15551234568',
          relationship: 'friend'
        }
      },
      {
        name: 'Maria Rodriguez',
        phoneNumber: '447911123456', // UK phone number formatting with the standard "+" before country code
        opd: 'OPD-ENDO-2024-005',
        age: 67,
        gender: 'female',
        height: 158,
        status: 'Elderly patient with Type 2 diabetes and multiple comorbidities'
        // No emergency contact entered to test optional field validity
      }
    ]

    const createdPatients = []
    console.log('Processing patients with full validation...')

    for (const patientData of patients) {
      console.log(`Creating patient: ${patientData.name}`)
      const patient = new Patient(patientData)
      await patient.save()  // .save() necessary to ensure that the pre-save hook feature during data entry is triggered to ensure data validation and auto-formatting functions are running
      createdPatients.push(patient)
    }

    console.log(`Created ${createdPatients.length} patients with diverse profiles`)

    // Creating different HbA1c test data
    console.log('Creating comprehensive HbA1c test data...')
    
    const hba1cData = [
      // All 9 classification zones using system auto-classification
      { phone: '+91-9876543210', value: 3.2, date: '2024-01-15', lab: 'Apollo Diagnostics', notes: 'Very Low Critical - system classification' },
      { phone: '+91-9876543210', value: 3.6, date: '2024-02-15', lab: 'Apollo Diagnostics', notes: 'Very Low Borderline Critical - system classification' },
      { phone: '+91-9876543210', value: 4.3, date: '2024-03-15', lab: 'Apollo Diagnostics', notes: 'Low Caution - system classification' },
      { phone: '+91-9876543210', value: 4.6, date: '2024-04-15', lab: 'Apollo Diagnostics', notes: 'Low Borderline Caution - system classification' },
      { phone: '+91-9876543210', value: 6.8, date: '2024-05-15', lab: 'Apollo Diagnostics', notes: 'Optimal None - system classification' },
      { phone: '+91-9876543210', value: 7.4, date: '2024-06-15', lab: 'Apollo Diagnostics', notes: 'High Borderline Caution - system classification' },
      { phone: '+91-9876543210', value: 8.0, date: '2024-07-15', lab: 'Apollo Diagnostics', notes: 'High Caution - system classification' },
      { phone: '+91-9876543210', value: 8.4, date: '2024-08-15', lab: 'Apollo Diagnostics', notes: 'Very High Borderline Critical - system classification' },
      { phone: '+91-9876543210', value: 9.2, date: '2024-09-15', lab: 'Apollo Diagnostics', notes: 'Very High Critical - system classification' },

      // Test doctor full override scenarios (both zone and alertLevel provided)
      { 
        phone: '+91-9876543211', 
        value: 8.5, 
        date: '2024-08-01', 
        lab: 'Central Lab', 
        notes: 'Doctor full override - patient shows excellent symptoms despite elevated HbA1c',
        zone: 'optimal',
        alertLevel: 'none',
        clinicalReasoning: 'Patient demonstrates excellent glucose control based on continuous monitoring data'
      },
      { 
        phone: '+91-9876543211', 
        value: 6.9, 
        date: '2024-08-02', 
        lab: 'Max Lab', 
        notes: 'Doctor full override - elderly patient with relaxed targets',
        zone: 'high',
        alertLevel: 'caution',
        clinicalReasoning: 'Adjusted for age and comorbidity considerations per ADA guidelines'
      },

      // Test doctor partial override - zone only (alertLevel calculated by system)
      { 
        phone: '+919876543212', 
        value: 7.6, 
        date: '2024-08-03', 
        lab: 'Quest Diagnostics', 
        notes: 'Doctor zone override - system calculates alertLevel',
        zone: 'optimal'
      },
      { 
        phone: '+919876543212', 
        value: 8.2, 
        date: '2024-08-04', 
        lab: 'LabCorp', 
        notes: 'Doctor zone override - different zone for same range',
        zone: 'high'
      },

      // Test doctor partial override - alertLevel only (zone calculated by system)
      { 
        phone: '+1-555-123-4567', 
        value: 7.8, 
        date: '2024-08-05', 
        lab: 'US Medical Lab', 
        notes: 'Doctor alertLevel override - system calculates zone',
        alertLevel: 'borderline caution'
      },
      { 
        phone: '+1-555-123-4567', 
        value: 8.6, 
        date: '2024-08-06', 
        lab: 'US Medical Lab', 
        notes: 'Doctor alertLevel override - reducing severity',
        alertLevel: 'caution',
        clinicalReasoning: 'Patient showing rapid improvement, reducing alert severity to maintain motivation'
      },

      // Test edge cases and boundary values
      { phone: '+447911123456', value: 2.0, date: '2024-08-07', lab: 'NHS Lab London', notes: 'Minimum allowed HbA1c value' },
      { phone: '+447911123456', value: 27.0, date: '2024-08-08', lab: 'NHS Lab London', notes: 'Maximum allowed HbA1c value' },
      { phone: '+447911123456', value: 7.3, date: '2024-08-09', lab: 'NHS Lab London', notes: 'Exact boundary between optimal and high' },
      { phone: '+447911123456', value: 8.5, date: '2024-08-10', lab: 'NHS Lab London', notes: 'Exact boundary between borderline critical and critical' },

      // Test different lab names and international scenarios
      { phone: '+91-9876543211', value: 6.5, date: '2024-01-10', lab: 'Metropolis Healthcare', notes: 'Indian lab chain test' },
      { phone: '+919876543212', value: 7.2, date: '2024-02-10', lab: 'SRL Diagnostics', notes: 'Another Indian lab chain' },
      { phone: '+1-555-123-4567', value: 6.8, date: '2024-03-10', lab: 'Mayo Clinic Lab', notes: 'US hospital lab test' },
      { phone: '+447911123456', value: 7.1, date: '2024-04-10', lab: 'King\'s College Hospital', notes: 'UK NHS hospital lab' },

      // Test time boundaries (5 years ago to today) - FIXED DATE TO BE WITHIN 5 YEARS IDEALLY ANYMORE SHOULD BE REJECTED
      { phone: '+91-9876543210', value: 8.8, date: '2021-08-11', lab: 'Historical Lab', notes: 'Historical data within 5 year limit' },
      { phone: '+91-9876543211', value: 6.2, date: '2025-08-11', lab: 'Today Lab', notes: 'Today\'s date - should be valid' }
    ]

    console.log('Creating HbA1c entries with different test scenarios:')
    
    let autoClassificationCount = 0
    let fullOverrideCount = 0
    let partialOverrideCount = 0
    
    for (const entry of hba1cData) {
      const entryData: any = {
        phoneNumber: entry.phone,
        value: entry.value,
        testDate: new Date(entry.date),
        labName: entry.lab,
        notes: entry.notes
      }

      // what if optional fields were provided
      if (entry.zone) entryData.zone = entry.zone
      if (entry.alertLevel) entryData.alertLevel = entry.alertLevel
      if (entry.clinicalReasoning) entryData.clinicalReasoning = entry.clinicalReasoning

      const hba1cEntry = new HbA1cEntry(entryData)
      await hba1cEntry.save()
      
      // Track classification types for summary in the form of a log
      if (entry.zone && entry.alertLevel) {
        fullOverrideCount++
        console.log(`Full Override: ${entry.value}% -> ${hba1cEntry.zone}/${hba1cEntry.alertLevel}`)
      } else if (entry.zone || entry.alertLevel) {
        partialOverrideCount++
        console.log(`Partial Override: ${entry.value}% -> ${hba1cEntry.zone}/${hba1cEntry.alertLevel}`)
      } else {
        autoClassificationCount++
        console.log(`Auto Classification: ${entry.value}% -> ${hba1cEntry.zone}/${hba1cEntry.alertLevel}`)
      }
    }

    console.log('Database seeded successfully with comprehensive test data!')

    // Generate detailed summary of both Patients and HbA1cEntry; ideally records should be paired correctly to their respective patients
    const patientCount = await Patient.countDocuments()
    const hba1cCount = await HbA1cEntry.countDocuments()
    
    console.log('\nComprehensive Summary:')
    console.log(`Patients: ${patientCount}`)
    console.log(`HbA1c Entries: ${hba1cCount}`)
    console.log(`Auto Classifications: ${autoClassificationCount}`)
    console.log(`Full Doctor Overrides: ${fullOverrideCount}`)
    console.log(`Partial Doctor Overrides: ${partialOverrideCount}`)
    
    // Zone distributions
    const zoneStats = await HbA1cEntry.aggregate([
      { $group: { _id: '$zone', count: { $sum: 1 }, avgValue: { $avg: '$value' } } },
      { $sort: { avgValue: 1 } }
    ])
    
    console.log('\nZone Distribution:')
    zoneStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} entries (avg: ${stat.avgValue.toFixed(1)}%)`)
    })

    // Alert level distributions
    const alertStats = await HbA1cEntry.aggregate([
      { $group: { _id: '$alertLevel', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
    
    console.log('\nAlert Level Distribution:')
    alertStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} entries`)
    })

    // Doctor overrides
    const overrideStats = await HbA1cEntry.aggregate([
      {
        $group: {
          _id: {
            zoneOverride: '$doctorOverrideZone',
            alertOverride: '$doctorOverrideAlertLevel'
          },
          count: { $sum: 1 }
        }
      }
    ])
    
    console.log('\nDoctor Override Patterns:')
    overrideStats.forEach(stat => {
      const pattern = stat._id
      let description = 'System Auto-Classification'
      if (pattern.zoneOverride && pattern.alertOverride) description = 'Full Doctor Override'
      else if (pattern.zoneOverride && !pattern.alertOverride) description = 'Zone Override Only'
      else if (!pattern.zoneOverride && pattern.alertOverride) description = 'Alert Level Override Only'
      
      console.log(`   ${description}: ${stat.count} entries`)
    })

  } catch (error) {
    console.error('Seed failed:', error)
  } finally {
    await disconnectDB()
    process.exit(0)
  }
}

seedDatabase()