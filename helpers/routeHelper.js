'use strict'

const Joi = require('@hapi/joi')

const schemas = {
    //! Authenticate Schema
    authSignUpSchema: Joi.object()
        .keys({
            name: Joi.string().min(2).required(),
            email: Joi.string().email(),
            phoneNumber: Joi.string().pattern(/^[0-9]{10}$/),
            password: Joi.string().min(6).required(),
        })
        // .or('email', 'phoneNumber')
        .with('email', 'password')
        .with('phoneNumber', 'password'),

    authSignInSchema: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().min(6).required(),
        remember_me: Joi.boolean()
    }),
    //! ID Schema
    // id mongodb
    idSchema: Joi.object().keys({
        param: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
    }),
    // id number (1,2,3,...)
    idNumberSchema: Joi.object().keys({
        param: Joi.string()
            .regex(/^[0-9]{1,3}$/)
            .required(),
    }),

    //! Body Schema
    // Customer
    customerSchema: Joi.object()
        .keys({
            id: Joi.number().allow(null).required(),
            name: Joi.string().min(2).required(),
            email: Joi.string().email(),
            phoneNumber: Joi.string().pattern(/^[0-9]{10}$/),
            password: Joi.string().min(6).required(),
            createdAt: Joi.date().default(Date.now),
            updatedAt: Joi.date().default(Date.now),
        })
        .xor('email', 'phoneNumber')
        .with('email', 'password')
        .with('phoneNumber', 'password')
        .options({ stripUnknown: true }),

    customerOptionalSchema: Joi.object().keys({
        id: Joi.number().allow(null),
        name: Joi.string().min(2),
        email: Joi.string().email(),
        phoneNumber: Joi.string().pattern(/^[0-9]{10}$/),
        password: Joi.string().min(6),
        createdAt: Joi.date().default(Date.now),
        updatedAt: Joi.date().default(Date.now),
    }),
    // Product
    productSchema: Joi.object().keys({
        id: Joi.number().allow(null).required(),
        barcode: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().positive().required(),
        quantity: Joi.number().positive().required(),
        photo: Joi.string().allow(null, ''),
        tags: Joi.array().items(Joi.string()),
        createdAt: Joi.date().default(Date.now),
        updatedAt: Joi.date().default(Date.now),
    }),
    productOptionalSchema: Joi.object().keys({
        id: Joi.number().allow(null),
        barcode: Joi.string(),
        name: Joi.string(),
        description: Joi.string(),
        price: Joi.number().positive(),
        quantity: Joi.number().positive(),
        photo: Joi.string().allow(null, ''),
        tags: Joi.array().items(Joi.string()),
        createdAt: Joi.date().default(Date.now),
        updatedAt: Joi.date().default(Date.now),
    }),
    // Order
    orderSchema: Joi.object()
        .keys({
            customerId: Joi.number().required().allow(null),
            items: Joi.array()
                .items(
                    Joi.object({
                        itemId: Joi.number().required().allow(null),
                        name: Joi.string().required(),
                        quantity: Joi.number().required(),
                        price: Joi.number().required(),
                    })
                )
                .required(),
            totalPrice: Joi.number().required(),
            shippingAddress: Joi.string().required(),
            billingAddress: Joi.string().required().allow(null),
            addressNote: Joi.string().required().allow(null),
            status: Joi.string()
                .valid(
                    'pending',
                    'placed',
                    'shipped',
                    'completed',
                    'cancelled',
                    'refunded'
                )
                .optional()
                .default('pending'),
            paymentMethod: Joi.string()
                .valid('credit', 'debit', 'cash')
                .required(),
            orderedAt: Joi.date(),
            createdAt: Joi.date().default(Date.now),
            updatedAt: Joi.date().default(Date.now),
        })
        .options({ stripUnknown: true }),
    orderOptionalSchema: Joi.object()
        .keys({
            customerId: Joi.number().allow(null),
            items: Joi.array().items(
                Joi.object({
                    itemId: Joi.number().allow(null),
                    name: Joi.string(),
                    quantity: Joi.number(),
                    price: Joi.number(),
                })
            ),
            totalPrice: Joi.number(),
            shippingAddress: Joi.string(),
            billingAddress: Joi.string(),
            status: Joi.string().valid(
                'pending',
                'placed',
                'shipped',
                'completed',
                'cancelled',
                'refunded'
            ),
            orderedAt: Joi.date(),
            createdAt: Joi.date().default(Date.now),
            updatedAt: Joi.date().default(Date.now),
        })
        .options({ stripUnknown: true }),
    // Cart
    cartSchema: Joi.object().keys({
        id: Joi.number().required().allow(null),
        customerId: Joi.number().required(),
        items: Joi.array().items(
            Joi.object({
                itemId: Joi.number().required(),
                name: Joi.string().required(),
                quantity: Joi.number().required(),
                price: Joi.number().required(),
            })
        ),
        totalPrice: Joi.number().required(),
        status: Joi.string()
            .valid('new', 'active', 'completed', 'expired', 'empty')
            .required(),
        createdAt: Joi.date().default(Date.now),
        updatedAt: Joi.date().default(Date.now),
    }),
    cartOptionalSchema: Joi.object().keys({
        id: Joi.number().allow(null),
        customerId: Joi.number(),
        items: Joi.array().items(
            Joi.object({
                itemId: Joi.number(),
                name: Joi.string(),
                quantity: Joi.number(),
                price: Joi.number(),
            })
        ),
        totalPrice: Joi.number(),
        status: Joi.string().valid(
            'new',
            'active',
            'completed',
            'expired',
            'empty'
        ),
        createdAt: Joi.date().default(Date.now),
        updatedAt: Joi.date().default(Date.now),
    }),
    // Product rating
    productRatingSchema: Joi.object().keys({
        id: Joi.string().allow(null).required(),
        productId: Joi.number().required(),
        customerId: Joi.number().required(),
        rating: Joi.number().required(),
        comment: Joi.string().required(),
        createdAt: Joi.date().default(Date.now),
        updatedAt: Joi.date().default(Date.now),
    }),
    productRatingOptionalSchema: Joi.object().keys({
        id: Joi.string().allow(null),
        productId: Joi.number().required(),
        customerId: Joi.number().required(),
        rating: Joi.number().required(),
        comment: Joi.string().required(),
        createdAt: Joi.date().default(Date.now),
        updatedAt: Joi.date().default(Date.now),
    }),
    // Contact
    contactSchema: Joi.object().keys({
        id: Joi.number().allow(null),
        name: Joi.string().min(2).required(),
        mail: Joi.string().email(),
        message: Joi.string().required(),
    }),
}

const validateBody = (schema) => {
    return (req, res, next) => {
        const validateResult = schema.validate(req.body)
        if (validateResult.error) {
            return res.status(400).json({
                error: validateResult.error,
            })
        } else {
            if (!req.value) req.value = {}
            if (!req.value['params']) req.value.params = {}
            req.value.body = validateResult.value
            next()
        }
    }
}

const validateParam = (schema, name) => {
    return (req, res, next) => {
        const validateResult = schema.validate({ param: req.params[name] })
        if (validateResult.error) {
            return res.status(400).json({
                error: validateResult.error,
            })
        } else {
            // check if not exist then create by empty object
            if (!req.value) req.value = {}
            if (!req.value['params']) req.value.params = {}
            // update value of params 'name' in value.params
            req.value.params[name] = req.params[name]
            next()
        }
    }
}

const validateSignInBody = (req, res, next) => {
    const { username, password, remember_me } = req.body
    const isEmail = username.includes('@')
    const isPhoneNumber = !isEmail
    if (isEmail) {
        req.value = { body: { email: username, password, remember_me } }
    } else if (isPhoneNumber) {
        req.value = { body: { phoneNumber: username, password, remember_me } }
    } else {
        return res
            .status(400)
            .json({ message: 'CUSTOMER_SIGNIN:USERNAME_INVALID' })
    }
    next()
}

module.exports = {
    schemas,
    validateParam,
    validateBody,
    validateSignInBody,
}
