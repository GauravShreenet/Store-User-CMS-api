import express from 'express';
import { v4 as uuidv4} from 'uuid';
import { responder } from '../middleware/response.js';
import { newUserValidation, resetPasswordValidation } from '../middleware/joiValidation.js';
import { getAUser, insertUser, updateUser } from '../model/user/UserModel.js';
import { comparePassword, hashPassword } from '../utils/bcrypt.js';
import { createNewSession, deleteSession } from '../model/session/SessionSchema.js';
import { passwordUpdateNotification, sendEmailVerificationLinkEmail, sendEmailVerifiedNotification, sendOptEmail } from '../utils/nodemailer.js';
import { getJwts } from '../utils/jwt.js';
import { refreshAuth, userAuth } from '../middleware/authMiddleWare.js';
import { otpGenerator } from '../utils/randomGenerator.js';

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

router.post("/verify-email", async(req, res, next) => {
    try {
        const { associate, token  } = req.body
        if (associate && token){
            const session = await deleteSession({ token, associate })

            if (session?._id) {
                const user = await updateUser({ email: associate }, { status: "active" })

                if(user?._id) {
                    sendEmailVerifiedNotification( {email: associate}, {fname: user.fName})
                    return responder.SUCCESS({
                        res,
                        message: "Your email has been verified. You may sign in now"
                    })
                }
            }
        }
        responder.ERROR({
            res,
            message: "Invalid or Expired Link"
        })
    } catch (error) {
        next(error)
    }
})

router.post("/sign-in", async(req, res, next) => {
    try {
        const { email, password } = req.body;
        if(email && password) {
            const user = await getAUser({ email })
            if(user?.status === "inactive") {
                return responder.ERROR({
                    res,
                    message: "Please verify your email. Your account has not been verified",
                })
            }
            if(user?._id){
                const isPasswordMatched = comparePassword(password, user.password)

                if(isPasswordMatched) {
                    const jwts = await getJwts(email)
                    return responder.SUCCESS({
                        res,
                        message: "Login Successfully",
                        jwts,
                    })
                }
            }
        }
        responder.ERROR({
            res,
            mesage: 'Invalid Login'
        })
    } catch (error) {
        next(error)
    }
})

router.get("/", userAuth, (req, res, next) => {
    try {
        responder.SUCCESS({
            res,
            message: 'Here is the user data',
            user: req.userInfo
        })
    } catch (error) {
        next(error)
    }
})

router.get("/accessjwt", refreshAuth)

router.post("/logout", async (req, res, next)=>{
    try{
        const { accessJWT, _id } = req.body;
        accessJWT && (await deleteSession({
            token: accessJWT,
        }))

        await updateUser({ _id }, { refreshJWT: "" })

        responder.SUCCESS({
            res,
            message: "User logged out successfully"
        })
    }
    catch(error){
        next(error)
    }
})

router.post("/request-otp", async (req, res, next) => {
    try {
        const { email } = req.body
        if(email.includes("@")) {
            const user = await getAUser({ email })

            if(user?._id) {
                const otp = otpGenerator()
                const otpSession = await createNewSession({
                    token: otp,
                    associate: email
                })
                if (otpSession?._id) {
                    sendOptEmail({
                        fName: user.fName,
                        email,
                        otp
                    })
                }
            }
        }
        
        responder.SUCCESS({
            res,
            message: "If your email is found in the system, we will send otp to your email please check your Junk/Spam folder too"
        })
    } catch (error) {
        next(error)
    }
})

router.patch("/", resetPasswordValidation, async (req, res, next) => {
    try {
        const { email, otp, password } = req.body

        const session = await deleteSession({
            token: otp,
            associate: email,
        })

        if (session?._id) {
            const hashPass = hashPassword(password)

            const user = await updateUser({ email }, { password: hashPass })

            if(user?._id) {
                passwordUpdateNotification({
                    fName: user.fName,
                    email,
                })

                return responder.SUCCESS({
                    res,
                    message: "Your password has been updated, you may login now"
                })
            }
        }

        responder.ERROR({
            res,
            message: "Invalid token, unable to rest your password, try again later"
        })
    } catch (error) {
        next(error)
    }
})

export default router;