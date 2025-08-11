import dotenv from 'dotenv'
import path from 'path'
import mongoose from 'mongoose'

dotenv.config({ path: path.resolve(__dirname, '../.env') })                                         // LOAD ENV VARIABLES (.env) FROM PROJECT ROOT

declare global {                                                                                    // GLOBAL TYPE DEFINATION FOR MONGOOSE CACHING
  var mongoose: {
    conn: mongoose.Mongoose | null
    promise: Promise<mongoose.Mongoose> | null
  } | undefined
}

console.log('MongoDB Connection Debug Info:')                                                       // DEBUG INFORMATION
console.log('Current directory:', __dirname)
console.log('Environment file path:', path.resolve(__dirname, '../.env'))
console.log('MONGODB_URI available:', !!process.env.MONGODB_URI)
console.log('Node environment:', process.env.NODE_ENV || 'development')

if (!process.env.MONGODB_URI) {                                                                     // VALIDATE EXISTANCE OF MONGODB URI
  console.error('MONGODB_URI not found in environment variables')
  console.error('Please ensure .env file exists in project root with MONGODB_URI defined')
  throw new Error('Missing MONGODB_URI environment variable')
}

const MONGODB_URI: string = process.env.MONGODB_URI

let cached = global.mongoose || { conn: null, promise: null }                                       // INITIALIZE MONGOOSE CAHCHING TO PREVENT CONFLICTING CONNECTIONS

if (!global.mongoose) {
  global.mongoose = cached
}

async function connectDB() {                                                                        // RETURN EXISITING CONNECTION IF FOUND
  if (cached.conn) {
    console.log('Using existing MongoDB connection')
    return cached.conn
  }

  if (!cached.promise) {                                                                            // CREATE NEW CONNECTION IF NONE FOUND
    const options = {
      bufferCommands: false,      // Disable command buffering
      maxPoolSize: 10,            // Maximum number of connections (10 set for now)
      serverSelectionTimeoutMS: 5000,  // Timeout for server selection
      socketTimeoutMS: 45000,     // Socket timeout
      family: 4,                  // Use IPv4
      retryWrites: true,          // Retry failed writes
      w: 'majority'               // Write concern for data safety
    }

    console.log('Creating new MongoDB connection...')
    console.log('Database:', MONGODB_URI.split('/').pop()?.split('?')[0])
    console.log('Connection options:', {
      maxPoolSize: options.maxPoolSize,
      serverSelectionTimeoutMS: options.serverSelectionTimeoutMS,
      socketTimeoutMS: options.socketTimeoutMS
    })
    
    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
      console.log('MongoDB connection established successfully!')
      
      const db = mongoose.connection.db                                                             // CREATE LOG FILES FOR DEBUGGING
      console.log('   Connected to database:', db?.databaseName)
      console.log('   Connection ready state:', mongoose.connection.readyState)
      
      return mongoose
    }).catch((error) => {
      console.error('MongoDB connection failed:', error.message)
      cached.promise = null
      throw error
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    console.error('Failed to establish MongoDB connection:', error)
    throw error
  }

  return cached.conn
}

export async function disconnectDB() {                                                             // FUNCTION: GRACEFULLY DISCONNECT MONGODB
  try {
    if (cached.conn) {
      await cached.conn.connection.close()
      cached.conn = null
      cached.promise = null
      console.log('MongoDB connection closed successfully')
    } else {
      console.log('No active MongoDB connection to close')
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error)
    throw error
  }
}

export async function checkDBHealth() {                                                            // FUNCTION: CHECK CONNECTION HEALTH
  try {
    if (!cached.conn) {
      console.log('No active MongoDB connection')
      return { connected: false, status: 'No connection' }
    }

    const adminDB = cached.conn.connection.db?.admin()
    const result = await adminDB?.ping()
    
    return {
      connected: true,
      status: 'Healthy',
      readyState: cached.conn.connection.readyState,
      database: cached.conn.connection.db?.databaseName,
      ping: result
    }
  } catch (error) {
    console.error('Database health check failed:', error)
    return {
      connected: false,
      status: 'Unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export default connectDB