import Joi from 'joi';
import { responder } from './response.js';

const SHORTSTR = Joi.string().max(100).allow(null, "");
const SHORTSTRREQ = SHORTSTR.required();
const NUM = Joi.number().allow(null, "");
const NUMREQ = NUM.required();
const LONGSTR = Joi.string().max(500).allow(null, "");
const LONGSTRREQ = LONGSTR.required();
const EMAIL = Joi.string().email({minDomainSegments: 2}).max(100).allow(null, "");
const EMAILREQ = EMAIL.required();

const joiValidation = ({schema, req, res, next}) => {
    try {
        const { error } = schema.validate(req.body);
        if(error) {
            return responder.ERROR({
                res,
                message: error.message
            })
        }
        next();
    } catch (error) {
        next(error)
    }
}

export const newUserValidation = (req, res, next) => {
    const schema = Joi.object({
        fName: SHORTSTRREQ,
        lName: SHORTSTRREQ,
        email: EMAILREQ,
        phone: NUM,
        address: SHORTSTR,
        password: SHORTSTRREQ,
    })

    joiValidation({ schema, req, res, next })
}

export const resetPasswordValidation = (req, res, next) => {
    const schema = Joi.object({
        otp: SHORTSTRREQ,
        email: EMAILREQ,
        passowrd: SHORTSTRREQ,
    })

    joiValidation({ schema, req, res, next })
}

export const newCartItemValidation = (req, res, next) => {
    const schema = Joi.object({
        userId: SHORTSTRREQ,
        name: SHORTSTRREQ,
        productId: SHORTSTRREQ,
        slug: SHORTSTRREQ,
        sku: SHORTSTRREQ,
        size: SHORTSTRREQ,
        color: SHORTSTRREQ,
        qty: NUMREQ,
        thumbnail: SHORTSTRREQ,
    })

    joiValidation({ schema, req, res, next })
}

export const newOrderValidation = (req, res, next) => {
    const schema = Joi.object({
        userId: SHORTSTRREQ,
        fName: SHORTSTRREQ,
        lName: SHORTSTRREQ,
        address: SHORTSTRREQ,
        phone: NUM,
        email: EMAILREQ,
        orderTotal: NUMREQ,
        cartItem: Joi.array().items(
            Joi.object({
                name: SHORTSTRREQ,
                productId: SHORTSTRREQ,
                slug: SHORTSTRREQ,
                price: NUMREQ,
                size: SHORTSTRREQ,
                color: SHORTSTRREQ,
                qty: NUMREQ,
                thumbnail: SHORTSTRREQ,
            })
        )        
    })

    joiValidation({ schema, req, res, next })
}