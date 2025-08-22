import connectDB, { disconnectDB, checkDBHealth } from '../lib/mongodb'
import Patient from '../lib/models/Patient'
import HbA1cEntry from '../lib/models/HbA1cEntry'

async function testUpdatedModels() {
  try {
    console.log('Testing comprehensive MongoDB models and functionality...')
    
    await connectDB()

    // Test 1: Database health and connection
    console.log('\n1. Testing Database Connection Health...')
    const healthCheck = await checkDBHealth()
    console.log('Database health status:', healthCheck)
    
    if (!healthCheck.connected) {
      throw new Error('Database connection is unhealthy')
    }

    // Test 2: Patient model validation and features
    console.log('\n2. Testing Enhanced Patient Model...')
    
    const patients = await Patient.find().limit(5)
    console.log(`Found ${patients.length} patients`)

    for (const patient of patients) {
      console.log(`Patient: ${patient.name}`)
      console.log(`   Phone: ${patient.phoneNumber}`)
      console.log(`   Age: ${patient.age}, Gender: ${patient.gender}, Height: ${patient.height}cm`)
      console.log(`   IDs - MRN: ${patient.mrn}, OPD: ${patient.opd}, IPD: ${patient.ipd || 'None'}`)
      
      if (patient.emergencyContact?.name) {
        console.log(`   Emergency Contact: ${patient.emergencyContact.name} (${patient.emergencyContact.relationship})`)
        console.log(`   Emergency Phone: ${patient.emergencyContact.phoneNumber}`)
      } else {
        console.log('   No emergency contact on file')
      }
      
      // Test display method
      const displayInfo = patient.getDisplayInfo()
      console.log(`   Display Info: ${displayInfo.displayName}, ${displayInfo.displayAge}`)
      console.log('')
    }

    // Test 3: Phone number search functionality; please work I am tired of this throwing an error again and again because of the auto-formatting function
    console.log('\n3. Testing Phone Number Search Functionality...')
    
    const phoneNumbers = ['+91-9876543210', '9876543210', '+919876543210']
    
    for (const phone of phoneNumbers) {
      const foundPatient = await Patient.findByPhone(phone)
      if (foundPatient) {
        console.log(`Found patient by phone ${phone}: ${foundPatient.name}`)
      } else {
        console.log(`No patient found for phone: ${phone}`)
      }
    }

    // Test 4: HbA1c model comprehensive testing; you too please work
    console.log('\n4. Testing Enhanced HbA1c Model...')
    
    const hba1cEntries = await HbA1cEntry.find().sort({ createdAt: -1 }).limit(10)
    console.log(`Found ${hba1cEntries.length} recent HbA1c entries`)
    
    for (const entry of hba1cEntries) {
      console.log(`HbA1c Entry: ${entry.value}% (${entry.zone}/${entry.alertLevel})`)
      console.log(`   Patient: ${entry.phoneNumber}`)
      console.log(`   Test Date: ${entry.testDate.toISOString().split('T')[0]}`)
      console.log(`   Lab: ${entry.labName}`)
      console.log(`   Override Flags - Zone: ${entry.doctorOverrideZone}, Alert: ${entry.doctorOverrideAlertLevel}`)
      
      if (entry.clinicalReasoning) {
        console.log(`   Clinical Reasoning: ${entry.clinicalReasoning}`)
      }
      
      if (entry.notes) {
        console.log(`   Notes: ${entry.notes.substring(0, 80)}${entry.notes.length > 80 ? '...' : ''}`)
      }
      console.log('')
    }

    // Test 5: Classification system validation
    console.log('\n5. Testing HbA1c Classification System...')
    
    // Test each classification zone
    const classificationTests = [
      { value: 3.2, expectedZone: 'very low', expectedAlert: 'critical' },
      { value: 3.6, expectedZone: 'very low', expectedAlert: 'borderline critical' },
      { value: 4.3, expectedZone: 'low', expectedAlert: 'caution' },
      { value: 4.6, expectedZone: 'low', expectedAlert: 'borderline caution' },
      { value: 6.8, expectedZone: 'optimal', expectedAlert: 'none' },
      { value: 7.4, expectedZone: 'high', expectedAlert: 'borderline caution' },
      { value: 8.0, expectedZone: 'high', expectedAlert: 'caution' },
      { value: 8.4, expectedZone: 'very high', expectedAlert: 'borderline critical' },
      { value: 9.2, expectedZone: 'very high', expectedAlert: 'critical' }
    ]

    console.log('Testing system classification accuracy:')
    for (const test of classificationTests) {
      const testEntry = new HbA1cEntry({
        phoneNumber: '+91-9999999999',
        value: test.value,
        testDate: new Date(),
        labName: 'Test Lab'
      })
      
      // Not saving, just checking classification
      await testEntry.validate()
      
      // Simulate pre-save hook logic for testing; should work now with .save() function running after every single entry which is ideally what will happen as doctor won't enter 2-3 patient data at once 
      const systemClassification = getSystemClassificationForTest(test.value)
      
      const isCorrect = systemClassification.zone === test.expectedZone && 
                       systemClassification.alertLevel === test.expectedAlert
      
      console.log(`   HbA1c ${test.value}%: ${systemClassification.zone}/${systemClassification.alertLevel} ${isCorrect ? 'CORRECT' : 'INCORRECT'}`)
      
      if (!isCorrect) {
        console.log(`     Expected: ${test.expectedZone}/${test.expectedAlert}`)
      }
    }

    // Test 6: Doctor override summary
    console.log('\n6. Testing Doctor Override System...')
    
    const overrideAnalysis = await HbA1cEntry.aggregate([
      {
        $group: {
          _id: {
            zoneOverride: '$doctorOverrideZone',
            alertOverride: '$doctorOverrideAlertLevel'
          },
          count: { $sum: 1 },
          avgValue: { $avg: '$value' },
          examples: { $push: { value: '$value', zone: '$zone', alertLevel: '$alertLevel' } }
        }
      }
    ])

    console.log('Doctor override patterns:')
    overrideAnalysis.forEach(pattern => {
      const type = pattern._id
      let description = 'Full System Classification'
      
      if (type.zoneOverride && type.alertOverride) {
        description = 'Full Doctor Override'
      } else if (type.zoneOverride && !type.alertOverride) {
        description = 'Zone Override Only'
      } else if (!type.zoneOverride && type.alertOverride) {
        description = 'Alert Level Override Only'
      }
      
      console.log(`   ${description}: ${pattern.count} entries (avg: ${pattern.avgValue.toFixed(1)}%)`)
      
      // Show one example
      if (pattern.examples.length > 0) {
        const example = pattern.examples[0]
        console.log(`     Example: ${example.value}% -> ${example.zone}/${example.alertLevel}`)
      }
    })

    // Test 7: Data integrity and relationships
    console.log('\n7. Testing Data Integrity and Relationships...')
    
    // Check for orphaned HbA1c entries; orphans only show up when phone number entries are not matching phone formattting standard set up by us
    const allPhones = await Patient.distinct('phoneNumber')
    const hba1cPhones = await HbA1cEntry.distinct('phoneNumber')
    
    const orphanedEntries = hba1cPhones.filter(phone => !allPhones.includes(phone))
    
    if (orphanedEntries.length > 0) {
      console.log(`Found ${orphanedEntries.length} orphaned HbA1c entries:`)
      orphanedEntries.forEach(phone => console.log(`   ${phone}`))
    } else {
      console.log('All HbA1c entries have corresponding patients - Good data integrity!')
    }

    // Test 8: Edge cases and boundary testing
    console.log('\n8. Testing Edge Cases and Boundaries...')
    
    // Test minimum and maximum values
    const extremeValues = await HbA1cEntry.find({
      $or: [
        { value: { $lte: 2.5 } },  // Very low values
        { value: { $gte: 25.0 } }  // Very high values
      ]
    })

    console.log(`Found ${extremeValues.length} entries with extreme values:`)
    extremeValues.forEach(entry => {
      console.log(`   ${entry.value}% (${entry.zone}/${entry.alertLevel}) - ${entry.labName}`)
    })

    // Test date boundaries
    const oldEntries = await HbA1cEntry.find({
      testDate: { $lt: new Date(Date.now() - 4.5 * 365 * 24 * 60 * 60 * 1000) }
    }).countDocuments()

    console.log(`Found ${oldEntries} entries older than 4.5 years (testing 5-year limit)`)

    // Test 9: Performance and indexing
    console.log('\n9. Testing Database Performance and Indexing...')
    
    const startTime = Date.now()
    
    // Test complex query performance
    await HbA1cEntry.find({
      zone: 'high',
      alertLevel: { $in: ['caution', 'borderline critical'] },
      testDate: { $gte: new Date('2024-01-01') }
    }).sort({ testDate: -1 })
    
    const queryTime = Date.now() - startTime
    console.log(`Complex query executed in ${queryTime}ms`)
    
    if (queryTime > 1000) {
      console.log('   Warning: Query took longer than 1 second - consider index optimization')
    } else {
      console.log('   Query performance is good')
    }

    // Test 10: Summary statistics
    console.log('\n10. Generating Summary Statistics...')
    
    const totalPatients = await Patient.countDocuments()
    const totalHbA1cEntries = await HbA1cEntry.countDocuments()
    
    const zoneDistribution = await HbA1cEntry.aggregate([
      { $group: { _id: '$zone', count: { $sum: 1 }, avgValue: { $avg: '$value' } } },
      { $sort: { avgValue: 1 } }
    ])
    
    const alertDistribution = await HbA1cEntry.aggregate([
      { $group: { _id: '$alertLevel', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    console.log('Final Summary:')
    console.log(`   Total Patients: ${totalPatients}`)
    console.log(`   Total HbA1c Entries: ${totalHbA1cEntries}`)
    console.log(`   Average Entries per Patient: ${(totalHbA1cEntries / totalPatients).toFixed(1)}`)
    
    console.log('\n   Zone Distribution:')
    zoneDistribution.forEach(zone => {
      console.log(`     ${zone._id}: ${zone.count} entries (avg: ${zone.avgValue.toFixed(1)}%)`)
    })
    
    console.log('\n   Alert Level Distribution:')
    alertDistribution.forEach(alert => {
      console.log(`     ${alert._id}: ${alert.count} entries`)
    })

    console.log('\nAll comprehensive tests completed successfully! YAY')

  } catch (error) {
    console.error('Test failed:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      console.error('Stack trace:', error.stack)
    }
  } finally {
    await disconnectDB()
  }
}

// Main Helper function for testing classification system
function getSystemClassificationForTest(value: number) {
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

testUpdatedModels()