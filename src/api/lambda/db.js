import { Pool } from 'pg'
import dotenv from 'dotenv'

// Load environment variables if not already loaded
if (!process.env.LOCAL_PG_USER && import.meta.url === process.argv[1]) {
  dotenv.config({ path: '.env.local' })
}

// Determine if we're running locally or in Lambda
const isLocal = process.env.NODE_ENV !== 'production'

// Log all environment variables for debugging
console.log('DB Connection Environment Variables:')
console.log('PG_USER:', process.env.PG_USER)
console.log('PG_DB:', process.env.PG_DB)

// Set up connection config based on environment
const connectionConfig = {
  host: isLocal ? 'localhost' : process.env.PG_HOST,
  user: isLocal ? process.env.LOCAL_PG_USER || 'postgres' : process.env.PG_USER,
  database: isLocal ? process.env.LOCAL_PG_DB || 'postgres' : process.env.PG_DB,
  password: isLocal ? process.env.LOCAL_PG_PASSWORD || 'postgres' : process.env.PG_PASSWORD,
  port: process.env.PG_PORT || 5432,
  ssl: isLocal ? false : process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
}

// Log connection info (without password)
console.log(`Database connection: ${isLocal ? 'LOCAL' : 'PRODUCTION'} mode`)
console.log(
  `Connecting to: ${connectionConfig.host}:${connectionConfig.port}/${connectionConfig.database}`,
)

// Create connection pool with optimized settings
const pool = new Pool({
  ...connectionConfig,
  // Connection pool settings
  max: isLocal ? 10 : 1, // More connections for local development, minimal for Lambda
  idleTimeoutMillis: 120000, // Longer timeout to maintain connections
  connectionTimeoutMillis: isLocal ? 30000 : 5000, // Different timeouts for local vs Lambda
})

// Add connection error handler
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

// Create a client immediately to warm up the connection
let client
const warmUpConnection = async () => {
  try {
    client = await pool.connect()
    console.log('Database connection established successfully')
    client.release()
  } catch (err) {
    console.error('Error establishing database connection:', err)
  }
}

// Warm up connection when module is loaded
warmUpConnection()

// Export functions and pool
export const query = async (text, params) => {
  try {
    const start = Date.now()
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (err) {
    console.error('Error executing query:', err)
    throw err
  }
}
