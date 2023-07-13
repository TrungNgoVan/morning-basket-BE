'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ObjectIdType = Schema.Types.ObjectId

const ProductRatingSchema = new Schema({
    _id: {
        type: ObjectIdType,
    },
    id: {
        type: String,
    },
    productId: {
        type: Number,
    },
    customerId: {
        type: Number,
    },
    rating: {
        type: Number,
    },
    comment: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
})

const ProductRating = mongoose.model('ProductRating', ProductRatingSchema)

module.exports = ProductRating
