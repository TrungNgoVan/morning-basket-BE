'use strict'
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const { getNextSequenceValue } = require('../helpers/mongoHelper')

const Schema = mongoose.Schema

const customerStatus = {
    PENDING: 'pending',
    ACTIVE: 'active',
    INACTIVE: 'inactive',
}

const CustomerSchema = new Schema({
    id: {
        type: Number,
        default: null,
    },
    name: {
        type: String,
        default: 'default',
    },
    email: {
        type: String,
        default: 'default@gmail.com',
    },
    phoneNumber: {
        type: String,
        default: '0987654321',
    },
    password: {
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
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

CustomerSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: new Date() })
    next()
})

// ! ENCODE PASSWORD CUSTOMER
// * Encode before save customer (use pre method)
CustomerSchema.pre('save', async function (next) {
    try {
        // Generate a salt
        const salt = await bcryptjs.genSalt(10)
        // Generate a password hash (salt + hash)
        const passwordHashed = await bcryptjs.hash(this.password, salt)
        // Re-assign password hashed
        this.password = passwordHashed
        if (!this.id) {
            this.id = await getNextSequenceValue('customer')
        }
        next()
    } catch (err) {
        next(err)
    }
})

CustomerSchema.methods.isValidPassword = async function (newPassword) {
    try {
        return await bcryptjs.compare(newPassword, this.password)
    } catch (err) {
        throw new Error(err)
    }
}

const Customer = mongoose.model('Customer', CustomerSchema)

module.exports = Customer
