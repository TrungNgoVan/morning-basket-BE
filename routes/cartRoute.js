'use strict'

const express = require('express')
const router = express.Router()

const CartController = require('../controllers/cartController')

const {
    schemas,
    validateParam,
    validateBody,
} = require('../helpers/routeHelper')

router
    .route('/')
    .get(
        CartController.getCarts
    )
    .post(
        validateBody(schemas.cartSchema),
        CartController.createCart
    )

router
    .route('/:cartID')
    .get(
        validateParam(schemas.idNumberSchema, 'cartID'),
        CartController.getCartByID
    )
    .patch(
        validateParam(schemas.idNumberSchema, 'cartID'),
        validateBody(schemas.cartOptionalSchema),
        CartController.updateCart
    )
    .delete(
        validateParam(schemas.idNumberSchema, 'cartID'),
        CartController.deleteCart
    )

module.exports = router;
