'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ObjectIdType = Schema.Types.ObjectId

const customerStatus = {
    PENDING: 'pending',
    ACTIVE: 'active',
    INACTIVE: 'inactive',
}

const CustomerSchema = new Schema({
    _id: {
        type: ObjectIdType,
    },
    id: {
        type: Number,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    googleId: {
        type: String,
    },
    googleAccessToken: {
        type: String,
    },
    googleRefreshToken: {
        type: String,
    },
    status: {
        type: String,
        enum: Object.values(customerStatus),
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
})

const Customer = mongoose.model('Customer', CustomerSchema)

module.exports = Customer
