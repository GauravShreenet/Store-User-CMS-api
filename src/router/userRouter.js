import express from 'express';
import { v4 as uuidv4} from 'uuid';
import { responder } from '../middleware/response.js';
import { newUserValidation } from '../middleware/joiValidation.js';
import { insertUser } from '../model/user/UserModel.js';
import { hashPassword } from '../utils/bcrypt.js';
import { createNewSession } from '../model/session/SessionSchema.js';
import { sendEmailVerificationLinkEmail } from '../utils/nodemailer.js';

let router = express.Router();

router.post("/", newUserValidation, async(req, res, next)=> {
    try {
        const { password } = req.body;
        //encrypt passowrd
        req.body.password = hashPassword(password);

        const user = await insertUser(req.body);
        if(user?._id) {
            const c = uuidv4();
            const token = await createNewSession({ token: c, associate: user.email })
            if(token?._id) {
                const url = `${process.env.CLIENT_ROOT_DOMAIN}/verify-email?email=${user.email}&c=${c}`
                console.log(url)
                sendEmailVerificationLinkEmail({
                    email: user.email,
                    url,
                    fName: user.fName,
                })
            }
        }
        user?._id ?
            responder.SUCCESS({
                res,
                status: "success",
                message: "Check your inpox/span to verify your email"
            }) :
            responder.ERROR({
                res,
                status: "error",
                errorCode: 200,
                message: "Unable to create new user, try again later"
            })
    } catch (error) {
        if(error.message.includes("E11000 duplicate key error")) {
            error.errorCode = 200
            error.message = "The email already exist"
        }
        next(error)
    }
})

router.get("/", (req, res, next) => {
    try {
        responder.SUCCESS({
            res,
            message: 'Here is the user data',
        })
    } catch (error) {
        next(error)
    }
})

export default router;