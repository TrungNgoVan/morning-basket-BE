'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const mongoClient = require('mongoose');
const logger = require('morgan');
const { error } = require('console');

// import router
const productRouter = require('./routes/productRoute');

// setup connect mongodb by mongoose
const credentials = "mongodbcloud-X509-cert-950696746832105764.pem";
mongoClient.connect('mongodb+srv://morning-basket.hzzrn2x.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', {
    useNewUrlParser: true,  // return promise
    ssl: true,
    sslKey: credentials,
    sslCert: credentials
}).then(() => {
    console.log('Connect db successfully ✅');
}).catch((err) => {
    console.error(`Connect db failed with error ${err} ❌`);
})

// Create app object
const app = express();

// Use middleware
app.use(logger('dev'));
app.use(bodyParser.json());

// Router

app.use('/products', productRouter)

app.use('/', (req, res, next) => {
    return res.status(200).json({
        message: 'Server is OK'
    })
})

// Error handle function

app.use((err, req, res, next) => {
    return res.status(err.status || 500).json({
        error: {
            message: err.message
        }
    })
});

app.listen(3000, () => {
    console.log('http://localhost:3000');
})
