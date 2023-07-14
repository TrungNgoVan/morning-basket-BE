'use strict'
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const Schema = mongoose.Schema;

const customerStatus = {
    NEW: 'New',
    ACTIVE: 'Active',
    INACTIVE: 'Inactive'
}

const CustomerSchema = new Schema({
    id: {
        type: Number
    },
    name: {
        type: String,
        default: "default"
    },
    email: {
        type: String,
        default: "default@gmail.com"
    },
    phoneNumber: {
        type: String,
        default: "0987654321"
    },
    password: {
        type: String
    },
    googleId: {
        type: String
    },
    googleAccessToken: {
        type: String
    },
    googleRefreshToken: {
        type: String
    },
    status: {
        type: String,
        enum: Object.values(customerStatus),
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

CustomerSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: new Date() });
    next();
})

// ! ENCODE PASSWORD CUSTOMER
// * Encode before save customer (use pre method)
CustomerSchema.pre('save', async function (next) {
    try {
        // Generate a salt
        const salt = await bcryptjs.genSalt(10);
        console.log('Salt ', salt);
        // Generate a password hash (salt + hash)
        const passwordHashed = await bcryptjs.hash(this.password, salt);
        // Re-assign password hashed
        console.log('Old password', this.password);
        console.log('Password hashed', passwordHashed);
        this.password = passwordHashed;
        next();
    } catch (err) {
        next(err);
    }
})


CustomerSchema.methods.isValidPassword = async function (newPassword) {
    try {
        return await bcryptjs.compare(newPassword, this.password);
    } catch (err) {
        throw new Error(err);
    }
}

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;

