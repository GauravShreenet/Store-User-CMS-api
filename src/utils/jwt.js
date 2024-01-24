import jwt from 'jsonwebtoken';
import { createNewSession } from '../model/session/SessionSchema';
import { updateUser } from '../model/user/UserModel';

export const createAccessJWT = async (email) => {
    const accessJWT = jwt.sign({email}, process.env.ACCESSJWT_SECRET, {
        expiresIn: "15m"
    })

    await createNewSession({
        token: accessJWT,
        associate: email
    })

    return accessJWT;
}

export const verifyAccessJWT = (accessJWT) => {
    return jwt.verify(accessJWT, process.env.ACCESSJWT_SECRET)
}

export const createRefreshJWT = async(email) => {
    const refreshJWT = jwt.sign({email}, process.env.REFRESHJWT_SECRET, {
        expiresIn: "30d"
    })

    await updateUser({email}, {
        refreshJWT
    })

    return refreshJWT
}

export const verifyRefreshJWT = (refreshJWT) => {
    return jwt.verify(refreshJWT, process.env.REFRESHJWT_SECRET)
}

export const getJwts = async(email) => {
    return {
        accessJWT: await createAccessJWT(email),
        refreshJWT: await createRefreshJWT(email),
    }
}

