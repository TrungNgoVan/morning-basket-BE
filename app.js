'use strict'
/* eslint-disable no-unused-vars */

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const logger = require('morgan')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const crypto = require('crypto')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fs = require('fs')
const path = require('path')

/* eslint-disable no-undef */
const { env } = require('./configs/index')

const corsOptions = {
    origin: [env.FRONTEND_URL],
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

// import router
const productRouter = require('./routes/productRoute')
const customerRouter = require('./routes/customerRoute')
const orderRouter = require('./routes/orderRoute')
const cartRouter = require('./routes/cartRoute')
const productRatingRouter = require('./routes/productRatingRoute')
const contactRouter = require('./routes/contactRoute')

// Decode the Base64 encoded certificate and write to temporary directory
const tmpDir = '/tmp'
const certPath = path.join(tmpDir, 'mongodb.pem')
try {
    fs.writeFileSync(certPath, Buffer.from(env.MONGODB_CERT_BASE64, 'base64'))
    console.log(`Certificate written to ${certPath}`)
} catch (err) {
    console.error('Failed to write certificate file', err)
    process.exit(1)
}

const conn = mongoose
    .connect(env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        tls: env.MONGODB_SSL_ENABLED === 'true',
        tlsCertificateKeyFile: certPath,
        dbName: env.MONGODB_DB_NAME,
    })
    .then((m) => {
        console.log('Connect db successfully ✅')
        return m.connection.getClient()
    })
    .catch((err) => {
        console.error(`Connect db failed with error ${err} ❌`)
    })
const mongoStore = MongoStore.create({
    clientPromise: conn,
    dbName: env.MONGODB_DB_NAME,
})

// Create app object
const app = express()
const secret = crypto.randomBytes(64).toString('hex')

// Use middleware
app.use(cors(corsOptions))
app.use(logger('dev'))
app.use(
    session({
        secret: secret,
        resave: true,
        saveUninitialized: true,
        store: mongoStore,
    })
)
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
// Router

var rootRouter = express.Router()
rootRouter.use('/products', productRouter)
rootRouter.use('/customers', customerRouter)
rootRouter.use('/orders', orderRouter)
rootRouter.use('/carts', cartRouter)
rootRouter.use('/productRatings', productRatingRouter)
rootRouter.use('/contact', contactRouter)

app.use(env.ROUTE_PREFIX, rootRouter)

app.use('/', (req, res, next) => {
    return res.status(200).json({
        message: 'Server is OK',
    })
})

// Error handle function
app.use((err, req, res, next) => {
    return res.status(err.status || 500).json({
        error: {
            message: err.message,
        },
    })
})

let server = app.listen(env.PORT || 3000, () => {
    logger(`Stage: ${env.STAGE}`)
    logger(`Server listening on port ${server.address().port}`)
    console.log(`Stage: ${env.STAGE}`)
    console.log(`Server listening on port ${server.address().port}`)
})

module.exports = app
/* eslint-disable no-undef */
