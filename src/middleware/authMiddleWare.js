
import { createAccessJWT, verifyAccessJWT, verifyRefreshJWT } from "../utils/jwt.js"
import { getSession } from "../model/session/SessionSchema.js"
import { getAUser } from "../model/user/UserModel.js"
import { responder } from "./response.js"

export const userAuth = async(req, res, next) => {
    try {
        const { authorization } = req.headers

        const decoded = verifyAccessJWT(authorization)
        

        if(decoded?.email) {
            const token = await getSession({ token: authorization, associate: decoded.email })
            if(token?._id) {
                const user = await getAUser({ email: decoded.email })
                if(user?.status === "active") {
                    user.password = undefined
                    req.userInfo = user
                    return next()
                }
            }
        }

        responder.ERROR({
            res,
            message: 'User unauthorize',
            errorCode: 401
        })
    } catch (error) {
        if(error.message.includes("jwt expired")){
            return responder.ERROR({
                res,
                errorCode: 403,
                message: "jwt expired"
            })
        }
        next(error)
    }
}

export const refreshAuth = async(req, res, next) => {
    console.log("first")
    try {
        const { authorization } = req.headers //refreshJWT
        
        const decoded = await verifyRefreshJWT(authorization)

        if(decoded?.email) {
            const user = await getAUser({
                email: decoded.email,
                refreshJWT: authorization,
            })
            
            if(user?._id && user?.status === 'active') {
                const accessJWT = await createAccessJWT(decoded.email)
                console.log(accessJWT)
                return responder.SUCCESS({
                    res,
                    message: "Here is the jwt",
                    accessJWT,
                })
            }
        }

        responder.ERROR({
            res,
            errorCode: 401,
            message: "Unauthorized TEST"
        })
    } catch (error) {
        
        next(error)
    }
}