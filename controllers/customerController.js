'use strict'
const Customer = require('../models/customerModel')
const Orders = require('../models/orderModel')
const { AUTH_TOKEN_STORAGE_KEY } = require('../configs')
const {
    encodeAToken,
    decodeAToken,
} = require('../middlewares/authenticateToken')

/* eslint-disable no-unused-vars */

const getCustomerByToken = async (req, res, next) => {
    try {
        const token = req.cookies.access_token
        const decoded = decodeAToken(token)
        const customer = await Customer.findById(decoded.sub)
        return customer
    } catch (err) {
        next(err)
    }
}

const addInfoPaying = async (req, res, next) => {
    try {
        const customer = await getCustomerByToken(req, res, next)
        const infoPaying = req.body
        customer.infoPaying.push(infoPaying)
        await customer.save()
        return res.status(200).json({
            message: 'ADD_INFO_PAYING:SUCCESS',
        })
    } catch (err) {
        next(err)
    }
}

const createCustomer = async (req, res, next) => {
    try {
        const { name, email, phoneNumber, password } = req.value.body
        // Check if there is a customer with same email or same phoneNumber
        const foundCustomer = await Customer.findOne({
            $or: [{ email }, { phoneNumber }],
        })
        if (!foundCustomer) {
            // Create a new user
            const newCustomer = new Customer({
                name,
                email,
                phoneNumber,
                password,
            })
            await newCustomer.save()
            // Encode a token
            const token = encodeAToken(newCustomer._id)
            res.setHeader('Authorization', token)
            return res.status(201).json({
                message: 'CUSTOMER_CREATE:SUCCESS',
            })
        } else if (foundCustomer.email === email) {
            return res.status(403).json({
                error: {
                    message: 'CUSTOMER_CREATE:EMAIL_EXIST',
                },
            })
        } else if (foundCustomer.phoneNumber === phoneNumber) {
            return res.status(403).json({
                error: {
                    message: 'CUSTOMER_CREATE:PHONE_EXIST',
                },
            })
        }
    } catch (err) {
        next(err)
    }
}

const deleteCustomer = async (req, res, next) => {
    try {
        const { customerID } = req.value.params
        const customer = await Customer.findOneAndDelete({ id: customerID })
        if (!customer) {
            return res.status(404).json({
                error: {
                    message: 'CUSTOMER_DELETE:NOT_FOUND',
                },
            })
        } else {
            return res.status(200).json({
                message: 'CUSTOMER_DELETE:SUCCESS',
            })
        }
    } catch (err) {
        next(err)
    }
}

const getCustomers = async (req, res, next) => {
    try {
        const customers = await Customer.find({})
        return res.status(200).json({
            customers,
        })
    } catch (err) {
        next(err)
    }
}

const getCustomerInfoPaying = async (req, res, next) => {
    try {
        const customer = await getCustomerByToken(req, res, next)
        const infoPaying = customer.infoPaying
        return res.status(200).json({
            infoPaying,
        })
    } catch (err) {
        next(err)
    }
}

const getCustomerOrders = async (req, res, next) => {
    try {
        const customer = await getCustomerByToken(req, res, next)
        const customerID = customer.id
        const orders = await Orders.find({ customerId: customerID })
        return res.status(200).json({
            message: '',
            orders,
        })
    } catch (err) {
        next(err)
    }
}

const getInfoCustomer = async (req, res, next) => {
    try {
        const token = req.cookies[AUTH_TOKEN_STORAGE_KEY]
        const decoded = decodeAToken(token)
        const customer = await Customer.findById(decoded.sub)

        const retCustomer = (({
            id,
            name,
            phoneNumber,
            email,
            createdAt,
            updatedAt,
        }) => ({ id, name, phoneNumber, email, createdAt, updatedAt }))(
            customer
        )
        return res.status(200).json({
            customer: retCustomer,
        })
    } catch (err) {
        next(err)
    }
}

const getCustomerByID = async (req, res, next) => {
    // enforce new user to old user
    try {
        const { customerID } = req.value.params
        const customer = await Customer.findOne({ id: customerID })
        if (!customer) {
            return res.status(404).json({
                error: {
                    message: 'CUSTOMER_GET:NOT_FOUND',
                },
            })
        } else {
            return res.status(200).json({
                customer,
            })
        }
    } catch (err) {
        next(err)
    }
}

const replaceCustomer = async (req, res, next) => {
    try {
        const { customerID } = req.value.params
        const customer = await Customer.findOne({ id: customerID })
        if (!customer) {
            return res.status(404).json({
                error: {
                    message: 'CUSTOMER_REPLACE:NOT_FOUND',
                },
            })
        } else {
            const newCustomer = req.value.body
            await Customer.findOneAndUpdate({ id: customerID }, newCustomer)
            return res.status(200).json({
                message: 'CUSTOMER_REPLACE:SUCCESS',
            })
        }
    } catch (err) {
        next(err)
    }
}

const updateCustomer = async (req, res, next) => {
    // number of fields
    try {
        const { customerID } = req.value.params
        const customer = await Customer.findOne({ id: customerID })
        if (!customer) {
            return res.status(404).json({
                error: {
                    message: 'CUSTOMER_UPDATE:NOT_FOUND',
                },
            })
        } else {
            const newCustomer = req.value.body
            await Customer.findOneAndUpdate({ id: customerID }, newCustomer)
            return res.status(200).json({
                message: 'CUSTOMER_UPDATE:SUCCESS',
            })
        }
    } catch (err) {
        next(err)
    }
}

const secret = async (req, res, next) => {
    return res.status(200).json({
        resource: true,
    })
}

const signin = async (req, res, next) => {
    const token = encodeAToken(req.user._id)
    // set header token
    // res.setHeader('Authorization', token)
    // save token in cookies
    res.cookie(AUTH_TOKEN_STORAGE_KEY, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: req.value.body.remember_me
            ? 30 * 24 * 60 * 60 * 1000
            : undefined,
    })
    return res.status(200).json({
        message: 'CUSTOMER_SIGNIN:SUCCESS',
        // name: req.user.name,
        // token: token,
    })
}

const signup = async (req, res, next) => {
    const { name, email, phoneNumber, password } = req.value.body
    // Check if there is a customer with same email or same phoneNumber
    const foundCustomer = await Customer.findOne({
        $or: [{ email }, { phoneNumber }],
    })
    if (!foundCustomer) {
        // Create a new user
        const newCustomer = new Customer({
            name,
            email,
            phoneNumber,
            password,
        })
        await newCustomer.save()
        return res.status(201).json({
            message: 'CUSTOMER_SIGNUP:SUCCESS',
        })
    } else if (foundCustomer.email === email) {
        return res.status(403).json({
            error: {
                message: 'CUSTOMER_SIGNUP:EMAIL_EXIST',
            },
        })
    } else if (foundCustomer.phoneNumber === phoneNumber) {
        return res.status(403).json({
            error: {
                message: 'CUSTOMER_SIGNUP:PHONE_EXIST',
            },
        })
    }
}

const signout = async (req, res, next) => {
    try {
        res.cookie(AUTH_TOKEN_STORAGE_KEY, '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 0,
            overwrite: true,
        })
        return res.status(200).json({
            message: 'CUSTOMER_SIGNOUT:SUCCESS',
        })
    } catch (err) {
        console.log(err)
        next(err)
    }
}
/* eslint-disable no-unused-vars */

module.exports = {
    addInfoPaying,
    createCustomer,
    deleteCustomer,
    getCustomerByID,
    getCustomerInfoPaying,
    getInfoCustomer,
    getCustomers,
    getCustomerOrders,
    replaceCustomer,
    secret,
    signout,
    signin,
    signup,
    updateCustomer,
}
