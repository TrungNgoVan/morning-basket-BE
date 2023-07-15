'use strict'

const Joi = require('@hapi/joi');

const schemas = {
    authSignUpSchema: Joi.object().keys({
        name: Joi.string().min(2).required(),
        email: Joi.string().email(),
        phoneNumber: Joi.string().pattern(/^[0-9]{10}$/),
        password: Joi.string().min(6).required()
    }).xor('email', 'phoneNumber').with('email', 'password').with('phoneNumber', 'password'),

    authSignInSchema: Joi.object().keys({
        email: Joi.string().email(),
        phoneNumber: Joi.string().pattern(/^[0-9]{10}$/),
        password: Joi.string().min(6).required()
    }).xor('email', 'phoneNumber').with('email', 'password').with('phoneNumber', 'password'),

    idSchema: Joi.object().keys({
        param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),

    productIdSchema: Joi.object().keys({
        param: Joi.string().regex(/^[0-9]{1,3}$/).required()
    }),

    customerSchema: Joi.object().keys({
        name: Joi.string().min(2).required(),
        email: Joi.string().email(),
        phoneNumber: Joi.string().pattern(/^[0-9]{10}$/),
        password: Joi.string().min(6).required()
    }).xor('email', 'phoneNumber').with('email', 'password').with('phoneNumber', 'password'),

    customerOptionalSchema: Joi.object().keys({
        firstName: Joi.string().min(2),
        lastName: Joi.string().min(2),
        email: Joi.string().email()
    })
}

const validateBody = (schema) => {
    return (req, res, next) => {
        const validateResult = schema.validate(req.body);
        if (validateResult.error) {
            return res.status(400).json({
                error: validateResult.error
            })
        } else {
            if (!req.value) req.value = {};
            if (!req.value['params']) req.value.params = {};
            req.value.body = validateResult.value;
            next();
        }
    }
}

const validateParam = (schema, name) => {
    return (req, res, next) => {
        const validateResult = schema.validate({ param: req.params[name] });
        if (validateResult.error) {
            return res.status(400).json({
                error: validateResult.error
            })
        } else {
            // check if not exist then create by empty object
            if (!req.value) req.value = {};
            if (!req.value['params']) req.value.params = {};
            // update value of params 'name' in value.params
            req.value.params[name] = req.params[name];
            next();
        }
    }
}

module.exports = {
    schemas,
    validateParam,
    validateBody
}
