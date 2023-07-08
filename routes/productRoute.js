'use strict'

const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

router.route('/')
    .get(productController.getProducts)
    .post(productController.addProduct)

module.exports = router;
