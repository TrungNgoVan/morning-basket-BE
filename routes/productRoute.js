'use strict'

const express = require('express')
const router = express.Router()

const productController = require('../controllers/productController')

const {
    schemas,
    validateParam,
    validateBody,
} = require('../helpers/routeHelper')

router
    .route('/')
    .get(productController.getAllProducts)
    .post(productController.createProduct)

router
    .route('/:productID')
    .get(
        validateParam(schemas.idNumberSchema, 'productID'),
        productController.getProductById
    )
    .post(
        validateParam(schemas.idNumberSchema, 'productID'),
        validateBody(schemas.productSchema),
        productController.createProduct
    )
    .patch(
        validateParam(schemas.idNumberSchema, 'productID'),
        validateBody(schemas.productOptionalSchema),
        productController.updateProduct
    )
    .delete(
        validateParam(schemas.idNumberSchema, 'productID'),
        productController.deleteProduct
    )

module.exports = router
