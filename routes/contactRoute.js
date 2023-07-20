'use strict'

const express = require('express')
const router = express.Router()

const ContactController = require('../controllers/contactController')

const {
    schemas,
    validateParam,
    validateBody,
} = require('../helpers/routeHelper')

router
    .route('/')
    .get(ContactController.getContacts)
    .post(validateBody(schemas.contactSchema), ContactController.createContact)

router
    .route('/:contactID')
    .delete(
        validateParam(schemas.idNumberSchema, 'contactID'),
        ContactController.deleteContact
    )

module.exports = router
