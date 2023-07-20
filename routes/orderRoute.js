'use strict'

const express = require('express')
const router = express.Router()

const OrderController = require('../controllers/orderController')

const {
    schemas,
    validateParam,
    validateBody,
} = require('../helpers/routeHelper')

router
    .route('/')
    .get(OrderController.getOrders)
    .post(validateBody(schemas.orderSchema), OrderController.createOrder)

router
    .route('/:orderID')
    .get(
        validateParam(schemas.idNumberSchema, 'orderID'),
        OrderController.getOrderByID
    )
    .patch(
        validateParam(schemas.idNumberSchema, 'orderID'),
        validateBody(schemas.orderOptionalSchema),
        OrderController.updateOrder
    )
    .delete(
        validateParam(schemas.idNumberSchema, 'orderID'),
        OrderController.deleteOrder
    )

module.exports = router
