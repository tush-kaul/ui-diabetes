import connectDB from '../lib/mongodb'
import Patient from '../lib/models/Patient'
import HbA1cEntry from '../lib/models/HbA1cEntry'

async function debugPhoneNumbers() {
  try {
    console.log('Phone Number Debug')
    
    await connectDB()
    
    console.log('\n=== PATIENT PHONE NUMBERS ===')
    const patients = await Patient.find({})
    patients.forEach(p => {
      console.log(`${p.name.padEnd(25)} | "${p.phoneNumber}"`)
    })
    
    console.log('\n=== HbA1cEntry PHONE NUMBERS (unique) ===')
    const uniquePhones = await HbA1cEntry.distinct('phoneNumber')
    uniquePhones.forEach(phone => {
      console.log(`HbA1c Entry                 | "${phone}"`)
    })
    
    console.log('\n=== MATCHING ANALYSIS ===')
    let matchCount = 0
    let mismatchCount = 0
    
    patients.forEach(patient => {
      const hasMatchingHbA1c = uniquePhones.includes(patient.phoneNumber)
      const status = hasMatchingHbA1c ? 'MATCH' : 'MISMATCH'
      console.log(`${patient.name.padEnd(25)} | ${status} | "${patient.phoneNumber}"`)
      
      if (hasMatchingHbA1c) {
        matchCount++
      } else {
        mismatchCount++
      }
    })
    
    console.log('\n=== SUMMARY ===')
    console.log(`Total Patients: ${patients.length}`)
    console.log(`Matching Phone Numbers: ${matchCount}`)
    console.log(`Mismatched Phone Numbers: ${mismatchCount}`)
    console.log(`Orphaned HbA1c Entries: ${uniquePhones.length - matchCount}`)
    
    if (mismatchCount > 0) {
      console.log('\n=== MISMATCHED DETAILS ===')
      patients.forEach(patient => {
        if (!uniquePhones.includes(patient.phoneNumber)) {
          console.log(`Patient: "${patient.phoneNumber}" has no matching HbA1c entries`)                // Find similar phone numbers to see why the mismatch and what is not formatting properly
          uniquePhones.forEach(hbPhone => {
            const cleanPatient = patient.phoneNumber.replace(/[-\s()]/g, '')
            const cleanHb = hbPhone.replace(/[-\s()]/g, '')
            if (cleanPatient === cleanHb || 
                cleanPatient.endsWith(cleanHb.slice(-10)) || 
                cleanHb.endsWith(cleanPatient.slice(-10))) {
              console.log(`  → Possible match with HbA1c: "${hbPhone}"`)
            }
          })
        }
      })
    }
    
  } catch (error) {
    console.error('Debug failed:', error)
  } finally {
    process.exit(0)
  }
}

debugPhoneNumbers()