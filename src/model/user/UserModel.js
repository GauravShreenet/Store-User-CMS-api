import UserSchema from './UserSchema.js';

//posting user
export const insertUser = (obj) => {
    return UserSchema(obj).save();
}

//update the users profile
export const updateUser = (filter, update) => {
    return UserSchema.findOneAndUpdate(filter, update);
}

//getting the particular user detail
export const getAUser = (filter) => {
    return UserSchema.findOne(filter);
}


export const getUserPasswordById = (_id) => {
    return UserSchema.findById(_id, {password: 1})
}