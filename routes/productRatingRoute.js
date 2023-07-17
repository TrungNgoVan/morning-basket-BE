'use strict'

const express = require('express')
const router = express.Router()

const ProductRatingController = require('../controllers/productRatingController')

const {
    schemas,
    validateParam,
    validateBody,
} = require('../helpers/routeHelper')

router
    .route('/')
    .get(
        ProductRatingController.getProductRatings
    )
    .post(
        validateBody(schemas.productRatingSchema),
        ProductRatingController.createProductRating
    )

router
    .route('/:productRatingID')
    .get(
        validateParam(schemas.idNumberSchema, 'productRatingID'),
        ProductRatingController.getProductRatingById
    )
    .patch(
        validateParam(schemas.idNumberSchema, 'productRatingID'),
        validateBody(schemas.productRatingOptionalSchema),
        ProductRatingController.updateProductRating
    )
    .delete(
        validateParam(schemas.idNumberSchema, 'productRatingID'),
        ProductRatingController.deleteProductRating
    )

module.exports = router;
