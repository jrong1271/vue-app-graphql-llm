// load-env.js
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

console.log('Environment variables loaded:')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('PG_USER:', process.env.PG_USER)
