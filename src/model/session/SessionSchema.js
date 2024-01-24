import mongoose from 'mongoose';

const userSession = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    associate: {
        type: String,
        default: "",
    }
},
    {
        timestamps: true
    }
)

const SessionSchema = mongoose.model("Session", userSession)

//function to run CRUD for session
export const createNewSession = (obj) => {
    return SessionSchema(obj).save();
}

export const deleteSession = (filter) => {
    return SessionSchema.findOneAndDelete(filter)
}

export const getSession = (filter) => {
    return SessionSchema.findOne(filter)
}