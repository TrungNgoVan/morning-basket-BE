'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { getNextSequenceValue } = require('../helpers/mongoHelper')

const orderStatus = {
    PENDING: 'pending',
    PLACED: 'placed',
    SHIPPED: 'shipped',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
}

const orderPaymentMethod = {
    CREDIT: 'credit',
    DEBIT: 'debit',
    CASH: 'cash',
}

const OrderSchema = new Schema({
    id: {
        type: Number,
        default: null,
    },
    customerId: {
        type: Number,
    },
    items: [
        {
            itemId: {
                type: Number,
            },
            name: {
                type: String,
            },
            quantity: {
                type: Number,
            },
            price: {
                type: Number,
            },
        },
    ],
    totalPrice: {
        type: Number,
    },
    shippingAddress: {
        type: String,
    },
    billingAddress: {
        type: String,
    },
    addressNote: {
        type: String,
    },
    status: {
        type: String,
        enum: Object.values(orderStatus),
    },
    paymentMethod: {
        type: String,
        enum: Object.values(orderPaymentMethod),
    },
    orderedAt: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

OrderSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: new Date() })
    next()
})

OrderSchema.pre('save', async function (next) {
    try {
        if (!this.id) {
            this.id = await getNextSequenceValue('order')
        }
        next()
    } catch (err) {
        next(err)
    }
})

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order
