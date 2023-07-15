'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const mongoClient = require('mongoose')
const logger = require('morgan')
/* eslint-disable no-unused-vars */
const dotenv = require('dotenv').config()
// const { error } = require('console');
const passport = require('passport')
// const session = require('express-session')
const crypto = require('crypto')
const cors = require('cors')
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
/* eslint-disable no-unused-vars */

// setup connect mongodb by mongoose
// Client
// mongoClient.connect('mongodb://127.0.0.1:27017/morning-basket', { useNewUrlParser: true }) // return promise
//     .then(() => {
//         console.log('Connect db successfully ✅');
//     })
//     .catch((err) => {
//         console.error(`Connect db failed with error ${err} ❌`);
//     })

// Cloud
/* eslint-disable no-undef */
const credentials = process.env.MONGODB_CERT
mongoClient
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        ssl: process.env.MONGODB_SSL_ENABLED,
        sslKey: credentials,
        sslCert: credentials,
        dbName: process.env.MONGODB_DB_NAME,
    })
    .then(() => {
        console.log('Connect db successfully ✅')
    })
    .catch((err) => {
        console.error(`Connect db failed with error ${err} ❌`)
    })

// Create app object
const app = express()
const secret = crypto.randomBytes(64).toString('hex')

// Use middleware
app.use(cors(corsOptions))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(
    require('express-session')({
        secret: secret,
        resave: true,
        saveUninitialized: true,
    })
)
app.use(passport.initialize())
app.use(passport.session())

// Router

app.use('/products', productRouter)
app.use('/customers', customerRouter)

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
    logger(`Server listening on port ${server.address().port}`)
    console.log(`Server listening on port ${server.address().port}`)
})
/* eslint-disable no-undef */
