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

/* eslint-disable no-undef */
const stage = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev'
require('dotenv').config(`${__dirname}/.env.${stage}`)

const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

// import router
const productRouter = require('./routes/productRoute')
const customerRouter = require('./routes/customerRoute')
const orderRouter = require('./routes/orderRoute')
const cartRouter = require('./routes/cartRoute')
const productRatingRouter = require('./routes/productRatingRoute')

console.log(process.env.MONGODB_URI)
const credentials = process.env.MONGODB_CERT
const conn = mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        tls: process.env.MONGODB_SSL_ENABLED,
        tlsCertificateKeyFile: credentials,
        // sslCert: credentials,
        dbName: process.env.MONGODB_DB_NAME,
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
    dbName: process.env.MONGODB_DB_NAME,
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
// Router

app.use('/products', productRouter)
app.use('/customers', customerRouter)
app.use('/orders', orderRouter)
app.use('/carts', cartRouter)
app.use('productRatings', productRatingRouter)

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

let server = app.listen(process.env.PORT || 3000, () => {
    logger(`Stage: ${stage}`)
    logger(`Server listening on port ${server.address().port}`)
    console.log(`Stage: ${stage}`)
    console.log(`Server listening on port ${server.address().port}`)
})
/* eslint-disable no-undef */
