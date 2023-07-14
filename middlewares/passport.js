'use strict'
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;

const Customer = require('../models/customerModel');

// Config dotenv
// const dotenv = require('dotenv');
// dotenv.config();
const { JWT_SECRET } = require('../configs/index')

// import methods of package 'passport-jwt'
const { ExtractJwt } = require('passport-jwt')

// Passport-jwt
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'), // * Token format: Bearer + token 
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        const customer = await Customer.findById(payload.sub);
        if (!customer) {
            return done(null, false);
        }
        done(null, customer);
    } catch (err) {
        done(err, false);
    }
}))

// Passport-local 
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const customer = await Customer.findOne({ email: email });
        if (!customer) {
            return done(null, false);
        }
        // After authenticating the customer by Email or PhoneNumber, 
        // Next verify the password the customer provided is the same as in the database
        const isCorrectPassword = await customer.isValidPassword(password); // method in customer model.
        if (!isCorrectPassword) {
            return done(null, false);
        }
        done(null, customer);
    } catch (err) {
        done(err, false);
    }
}));

passport.serializeUser((customer, done) => {
    done(null, customer._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, customer) => {
        done(err, customer);
    });
});
