'use strict'

const express = require('express')
const router = express.Router()

const productController = require('../controllers/productController')
const { authenticateToken } = require('../middlewares/authenticateToken')

const {
    schemas,
    validateParam,
    // validateBody,
} = require('../helpers/routeHelper')

router
    .route('/')
    .get(productController.getAllProducts)
    .post(productController.createProduct)

router
    .route('/:productId')
    .get(
        validateParam(schemas.productIdSchema, 'productId'),
        authenticateToken,
        productController.getProductById
    )
    .patch(
        validateParam(schemas.productIdSchema, 'productId'),
        productController.updateProduct
    )
    .delete(
        validateParam(schemas.productIdSchema, 'productId'),
        productController.deleteProduct
    )

module.exports = router
