// load-env.js
require('dotenv').config({ path: '.env.local' });

console.log('Environment variables loaded:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('LOCAL_PG_USER:', process.env.LOCAL_PG_USER);
console.log('LOCAL_PG_PASSWORD:', process.env.LOCAL_PG_PASSWORD ? '[REDACTED]' : 'undefined');
console.log('LOCAL_PG_DB:', process.env.LOCAL_PG_DB);
console.log('PG_USER:', process.env.PG_USER);