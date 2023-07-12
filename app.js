'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const mongoClient = require('mongoose');
const logger = require('morgan');
const { error } = require('console');
const cors = require('cors');
const corsOptions = {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
// import router
const productRouter = require('./routes/productRoute');

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
const credentials = "mongodbcloud-X509-cert-950696746832105764.pem";
mongoClient.connect('mongodb+srv://morning-basket.hzzrn2x.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', {
    useNewUrlParser: true,
    ssl: true,
    sslKey: credentials,
    sslCert: credentials,
    dbName: "morningbasket"
}).then(() => {
    console.log('Connect db successfully ✅');
}).catch((err) => {
    console.error(`Connect db failed with error ${err} ❌`);
})

// Create app object
const app = express();

// Use middleware
app.use(cors(corsOptions));
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
