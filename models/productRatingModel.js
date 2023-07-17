'use strict'

const mongoose = require('mongoose')
const { getNextSequenceValue } = require('../helpers/mongoHelper')

const Schema = mongoose.Schema;

const ProductRatingSchema = new Schema({
    id: {
        type: String,
        default: null
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
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
})

ProductRatingSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: new Date() })
    next()
})

ProductRatingSchema.pre('save', async function (next) {
    try {
        if (!this.id) {
            this.id = await getNextSequenceValue("rating");
        }
        next();
    } catch (err) {
        next(err)
    }
})

const ProductRating = mongoose.model('ProductRating', ProductRatingSchema)

module.exports = ProductRating
