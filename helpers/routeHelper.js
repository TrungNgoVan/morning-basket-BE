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
        .xor('email', 'phoneNumber')
        .with('email', 'password')
        .with('phoneNumber', 'password'),

    authSignInSchema: Joi.object()
        .keys({
            email: Joi.string().email(),
            phoneNumber: Joi.string().pattern(/^[0-9]{10}$/),
            password: Joi.string().min(6).required(),
        })
        .xor('email', 'phoneNumber')
        .with('email', 'password')
        .with('phoneNumber', 'password'),
    //! ID Schema 
    // id mongodb
    idSchema: Joi.object()
        .keys({
            param: Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required(),
        }),
    // id number (1,2,3,...)
    idNumberSchema: Joi.object()
        .keys({
            param: Joi.string()
                .regex(/^[0-9]{1,3}$/)
                .required(),
        }),

    //! Body Schema
    // Customer
    customerSchema: Joi.object()
        .keys({
            name: Joi.string().min(2).required(),
            email: Joi.string().email(),
            phoneNumber: Joi.string().pattern(/^[0-9]{10}$/),
            password: Joi.string().min(6).required(),
        })
        .xor('email', 'phoneNumber')
        .with('email', 'password')
        .with('phoneNumber', 'password')
        .options({ stripUnknown: true }),

    customerOptionalSchema: Joi.object()
        .keys({
            name: Joi.string().min(2),
            email: Joi.string().email(),
            phoneNumber: Joi.string().pattern(/^[0-9]{10}$/),
            password: Joi.string().min(6),
        }),
    // Product
    productSchema: Joi.object()
        .keys({
            barcode: Joi.string().required(),
            name: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number().positive().required(),
            quantity: Joi.number().positive().required(),
            photo: Joi.string().allow(null, ''),
            tags: Joi.array().items(Joi.string()),
        }),
    productOptionalSchema: Joi.object().keys({
        barcode: Joi.string(),
        name: Joi.string(),
        description: Joi.string(),
        price: Joi.number().positive(),
        quantity: Joi.number().positive(),
        photo: Joi.string().allow(null, ''),
        tags: Joi.array().items(Joi.string()),
    }),
    // Order
    orderSchema: Joi.object()
        .keys({
            customerId: Joi.number().required(),
            items: Joi.array().items(
                Joi.object({
                    itemId: Joi.number().required(),
                    name: Joi.string().required(),
                    quantity: Joi.number().required(),
                    price: Joi.number().required(),
                })
            ).required(),
            totalPrice: Joi.number().required(),
            shippingAddress: Joi.string().required(),
            billingAddress: Joi.string().required(),
            status: Joi.string().valid('pending', 'placed', 'shipped', 'completed', 'cancelled', 'refunded').required(),
            orderedAt: Joi.date(),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        })
        .options({ stripUnknown: true }),
    orderOptionalSchema: Joi.object()
        .keys({
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
            shippingAddress: Joi.string(),
            billingAddress: Joi.string(),
            status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered'),
            orderedAt: Joi.date(),
            createdAt: Joi.date(),
            updatedAt: Joi.date(),
        })
        .options({ stripUnknown: true }),

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

module.exports = {
    schemas,
    validateParam,
    validateBody,
}
