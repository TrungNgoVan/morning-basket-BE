'use strict'

const stage = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev'
require('dotenv').config({ path: `${__dirname}/../.env.${stage}` })

// const crypto = require('crypto');
// const JWT_SECRET = crypto.randomBytes(64).toString('hex');
const JWT_SECRET = 'testSecret'

module.exports = {
    JWT_SECRET,
    env: {
        STAGE: stage,
        MONGODB_URI: process.env.MONGODB_URI,
        MONGODB_SSL_ENABLED: process.env.MONGODB_SSL_ENABLED,
        MONGODB_CERT: process.env.MONGODB_CERT,
        MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
        PORT: process.env.PORT,
        FRONTEND_URL: process.env.FRONTEND_URL,
        ROUTE_PREFIX: process.env.ROUTE_PREFIX,
    },
}
