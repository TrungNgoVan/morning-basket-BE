'use strict'

const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

router.route('/:productID')
    .get(productController.getProductById)
    .patch(productController.updateProduct)
    .delete(productController.deleteProduct)

router.route('/')
    .get(productController.getProducts)
    .post(productController.createProduct)

module.exports = router;
