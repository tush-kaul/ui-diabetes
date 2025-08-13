import connectDB from '../lib/mongodb'
import Patient from '../lib/models/Patient'
import HbA1cEntry from '../lib/models/HbA1cEntry'
import mongoose from 'mongoose'

interface ConnectionTestResult {
  connectionId: number
  success: boolean
  responseTime: number
  operationType: string
  error?: string
  timestamp: Date
}

async function testSingleConnection(connectionId: number): Promise<ConnectionTestResult> {
  const startTime = Date.now()
  
  try {
    console.log(`🔗 Connection ${connectionId}: Starting test...`)
    
    // Create a different connection for this test
    await connectDB()
    
    // Perform database operations to stress-test the database
    const operations = [
      'count_patients',
      'count_hba1c', 
      'find_patient',
      'create_patient',
      'update_patient'
    ]
    
    const randomOperation = operations[Math.floor(Math.random() * operations.length)]
    
    switch (randomOperation) {
      case 'count_patients':
        await Patient.countDocuments({})
        break
        
      case 'count_hba1c':
        await HbA1cEntry.countDocuments({})
        break
        
      case 'find_patient':
        await Patient.findOne().limit(1)
        break
        
      case 'create_patient':
        const firstNames = [
          'Alex', 'Sarah', 'Michael', 'Emma', 'James', 
          'Lisa', 'David', 'Anna', 'Chris', 'Maria',
          'John', 'Amy', 'Mark', 'Helen', 'Paul',
          'Grace', 'Tom', 'Kate', 'Sam', 'Nina',
          'Robert', 'Linda', 'William', 'Elizabeth', 'Richard'
        ]
        
        const lastNames = [
          'Smith', 'Johnson', 'Brown', 'Davis', 'Wilson',
          'Garcia', 'Miller', 'Martinez', 'Lee', 'Lopez',
          'Anderson', 'Taylor', 'Thomas', 'White', 'Harris',
          'Clark', 'Lewis', 'Robinson', 'Walker', 'Hall',
          'Allen', 'Young', 'King', 'Wright', 'Scott'
        ]
        
        const firstName = firstNames[connectionId % firstNames.length]
        const lastName = lastNames[Math.floor(connectionId / firstNames.length) % lastNames.length]
        
        const testPatient = new Patient({
          name: `${firstName} ${lastName}`, 
          phoneNumber: `${9000000000 + connectionId}`,
          age: 25 + (connectionId % 50),
          gender: connectionId % 2 === 0 ? 'male' : 'female',  // Alternate genders
          height: 160 + (connectionId % 30),  // Vary heights 160-190cm
          status: `Test patient for connection ${connectionId}`,
          opd: `TEST-${connectionId}-${Date.now()}`
        })
        
        await testPatient.save()
        // Clean up the test patient immediately so as to not flood database with pseudo-patients
        await Patient.deleteOne({ _id: testPatient._id })
        break
        
      case 'update_patient':
        const patientToUpdate = await Patient.findOne()
        if (patientToUpdate) {
          patientToUpdate.status = `Updated by connection ${connectionId} at ${new Date().toISOString()}`
          await patientToUpdate.save()
        }
        break
    }
    
    const endTime = Date.now()
    const responseTime = endTime - startTime
    
    console.log(`Connection ${connectionId}: ${randomOperation} completed in ${responseTime}ms`)
    
    return {
      connectionId,
      success: true,
      responseTime,
      operationType: randomOperation,
      timestamp: new Date()
    }
    
  } catch (error: any) {
    const endTime = Date.now()
    const responseTime = endTime - startTime
    
    console.log(`Connection ${connectionId}: Failed after ${responseTime}ms - ${error.message}`)
    
    return {
      connectionId,
      success: false,
      responseTime,
      operationType: 'error',
      error: error.message,
      timestamp: new Date()
    }
  }
}

async function runConcurrentConnectionTest(numConnections: number = 20) {
  console.log('Concurrent Connection Test')
  console.log('=====================================================')
  console.log(`Testing ${numConnections} concurrent connections`)
  
  const startTime = Date.now()
  
  // Creating array of connection test promises
  const connectionPromises: Promise<ConnectionTestResult>[] = []
  
  for (let i = 1; i <= numConnections; i++) {
    connectionPromises.push(testSingleConnection(i))
  }
  
  try {
    // Running all connections concurrently
    console.log(`Launching ${numConnections} concurrent connections...`)
    const results = await Promise.allSettled(connectionPromises)
    
    const endTime = Date.now()
    const totalTestTime = endTime - startTime
    
    // Result Summary
    const successful: ConnectionTestResult[] = []
    const failed: ConnectionTestResult[] = []
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        if (result.value.success) {
          successful.push(result.value)
        } else {
          failed.push(result.value)
        }
      } else {
        failed.push({
          connectionId: index + 1,
          success: false,
          responseTime: 0,
          operationType: 'promise_rejected',
          error: result.reason?.message || 'Promise rejected',
          timestamp: new Date()
        })
      }
    })
    
    // Generate comprehensive report
    console.log('\nCONCURRENT CONNECTION TEST RESULTS')
    console.log('=====================================')
    console.log(`Total test duration: ${totalTestTime}ms`)
    console.log(`Total connections tested: ${numConnections}`)
    console.log(`Successful connections: ${successful.length}`)
    console.log(`Failed connections: ${failed.length}`)
    console.log(`Success rate: ${((successful.length / numConnections) * 100).toFixed(2)}%`)
    
    if (successful.length > 0) {
      const avgResponseTime = successful.reduce((sum, result) => sum + result.responseTime, 0) / successful.length
      const maxResponseTime = Math.max(...successful.map(r => r.responseTime))
      const minResponseTime = Math.min(...successful.map(r => r.responseTime))
      
      console.log('\nPERFORMANCE METRICS')
      console.log('====================')
      console.log(`Average response time: ${avgResponseTime.toFixed(2)}ms`)
      console.log(`Fastest response: ${minResponseTime}ms`)
      console.log(`Slowest response: ${maxResponseTime}ms`)
      
      // Operation type breakdown
      const operationTypes = successful.reduce((acc, result) => {
        acc[result.operationType] = (acc[result.operationType] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      console.log('\nOPERATION BREAKDOWN')
      console.log('=====================')
      Object.entries(operationTypes).forEach(([op, count]) => {
        console.log(`${op}: ${count} operations`)
      })
    }
    
    if (failed.length > 0) {
      console.log('\nFAILED CONNECTIONS')
      console.log('====================')
      failed.forEach(failure => {
        console.log(`Connection ${failure.connectionId}: ${failure.error}`)
      })
    }
    
    // Connection pool analysis
    const connectionState = mongoose.connection.readyState
    const connectionStates = {
      0: 'disconnected',
      1: 'connected', 
      2: 'connecting',
      3: 'disconnecting'
    }
    
    console.log('\nCONNECTION POOL STATUS')
    console.log('========================')
    console.log(`Connection state: ${connectionStates[connectionState as keyof typeof connectionStates]}`)
    console.log(`Database name: ${mongoose.connection.name}`)
    console.log(`Host: ${mongoose.connection.host}:${mongoose.connection.port}`)
    
    // Recommendations based on results
    console.log('\nRECOMMENDATIONS')
    console.log('==================')
    
    if (failed.length === 0) {
      console.log('All connections succeeded.')
      console.log('Database is able to handle this load comfortably.')
    } else if (failed.length < numConnections * 0.05) {
      console.log('Few failures detected.')
    } else if (failed.length < numConnections * 0.1) {
      console.log('Some connections failed')
    }
    
    if (successful.length > 0) {
      const avgTime = successful.reduce((sum, r) => sum + r.responseTime, 0) / successful.length
      if (avgTime > 1000) {
        console.log('Average response time is high (>1s)')
      } else if (avgTime > 500) {
        console.log('Response time could be better (<500ms ideal)')
      }
    }
    
    return {
      totalConnections: numConnections,
      successful: successful.length,
      failed: failed.length,
      successRate: (successful.length / numConnections) * 100,
      averageResponseTime: successful.length > 0 ? 
        successful.reduce((sum, r) => sum + r.responseTime, 0) / successful.length : 0,
      totalTestTime,
      results: [...successful, ...failed]
    }
    
  } catch (error: any) {
    console.error('Concurrent connection test failed:', error.message)
    throw error
  } finally {
    // Cleaning up any remaining test data
    try {
      await Patient.deleteMany({ 
        $or: [
          { name: { $regex: /^(Alex|Sarah|Michael|Emma|James|Lisa|David|Anna|Chris|Maria) (Smith|Johnson|Brown|Davis|Wilson)$/ } },
          { status: { $regex: /^Test patient for connection \d+$/ } },
          { opd: { $regex: /^TEST-\d+-\d+$/ } }
        ]
      })
      console.log('Cleaned up test data successfully')
    } catch (cleanupError) {
      console.log('Could not clean up some test data:', cleanupError)
    }
  }
}

async function runProgressiveLoadTest() {
  console.log('\nPROGRESSIVE LOAD TEST')
  console.log('========================')
  console.log('Testing system scalability for deployment')
  
  const testSizes = [5, 10, 20, 30, 50]
  const results: any[] = []
  
  for (const size of testSizes) {
    console.log(`\nTesting with ${size} concurrent connections...`)
    console.log(`(Simulating ${size} number of doctors accessing patient data simultaneously)`)
    
    try {
      const result = await runConcurrentConnectionTest(size)
      results.push(result)
      
      console.log(`${size} connections: ${result.successRate.toFixed(1)}% success, ${result.averageResponseTime.toFixed(0)}ms avg`)
      
      if (result.successRate >= 100) {
        console.log(`Can handle ${size} simultaneous doctor logins`)
      } else if (result.successRate >= 95) {
        console.log(`Can handle for ${size} concurrent medical staff`)
      } else if (result.successRate >= 90) {
        console.log(`Good but needs to optimized for ${size} users`)
      } else {
        console.log(`Struggling with just ${size} concurrent medical staff`)
      }
      
      // Added wait to simulate irl latenccy and not to overwhelm
      if (size < testSizes[testSizes.length - 1]) {
        console.log('Waiting 2 seconds for system recovery...')
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
      
    } catch (error) {
      console.log(`Test with ${size} connections failed:`, error)
      break // Stop testing if critical failure
    }
  }
  
  // Final analysis
  console.log('\nREADINESS ANALYSIS')
  console.log('=========================================')
  
  const perfectResults = results.filter(r => r.successRate === 100)
  const goodResults = results.filter(r => r.successRate >= 95)
  
  if (perfectResults.length >= 3) {
    console.log('EXCELLENT: system ready for large deployment')
  } else if (goodResults.length >= 3) {
    console.log('GOOD: system ready for medium hospital deployment')
  } else {
    console.log('NEEDS OPTIMIZATION')
  }
}

async function main() {
  try {
    console.log('Database Concurrent Connection Testing Suite')
    console.log('=====================================================')
    console.log('Testing database performance')
    console.log('Simulating multiple doctors accessing patient data')
    
    //  A basic concurrent test
    console.log('\nBasic Concurrent Connection Test (20 connections)')
    console.log('Simulating 20 medical staff accessing simultaneously')
    await runConcurrentConnectionTest(20)
    
    // Running progressively increasing load testing
    console.log('\nProgressive Load Testing')
    console.log('Testing scalability from 5 to 50 concurrent medical users')
    await runProgressiveLoadTest()
    
    console.log('\nConcurrent connection testing completed')
    console.log('Results summary available above for deployment planning')
    
  } catch (error) {
    console.error('Test suite failed:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Database connection closed')
    process.exit(0)
  }
}

main()