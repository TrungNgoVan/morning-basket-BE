const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectIdType = Schema.Types.ObjectId;

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
        type: String
    },
    email: {
        type: String
    },
    phoneNumber: {
        type: String
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

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
