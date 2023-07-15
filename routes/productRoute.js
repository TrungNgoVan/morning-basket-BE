'use strict'

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authenticateToken');
const productController = require('../controllers/productController');
const { schemas, validateParam, validateBody } = require('../helpers/routeHelper')


router.route('/:productID')
    .get(
        validateParam(schemas.idSchema, 'productID'),
        authenticateToken,
        productController.getProductByID
    )
    .patch(
        validateParam(schemas.idSchema, 'productID'),
        productController.updateProduct
    )
    .delete(
        validateParam(schemas.idSchema, 'productID'),
        productController.deleteProduct
    )

router.route('/')
    .get(productController.getProducts)
    .post(
        productController.createProduct
    )

module.exports = router;
