'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const mongoClient = require('mongoose');
const logger = require('morgan');
const { error } = require('console');

// import router
const productRouter = require('./routes/productRoute');

// setup connect mongodb by mongoose
mongoClient.connect('mongodb://127.0.0.1:27017/morning-basket', { useNewUrlParser: true }) // return promise
    .then(() => {
        console.log('Connect db successfully ✅');
    })
    .catch((err) => {
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
