import { Pool } from 'pg'

const isLocal = process.env.NODE_ENV !== 'production'

const connectionConfig = {
  host: isLocal ? 'localhost' : process.env.PG_HOST,
  user: isLocal ? 'postgres' : process.env.PG_USER,
  database: 'postgres',
  password: isLocal ? 'postgres' : process.env.PG_PASSWORD,
  port: 5432,
  ssl: isLocal ? false : process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
}

// Log connection info (without password)
console.log(`Database connection: ${isLocal ? 'LOCAL' : 'PRODUCTION'} mode`)
console.log(
  `Connecting to: ${connectionConfig.host}:${connectionConfig.port}/${connectionConfig.database}`,
)

const pool = new Pool({
  ...connectionConfig,
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
