import cartSchema from "./cartSchema.js"

export const insertCartItem = async (obj) => {
    //check if the item already exist
    const existingItem = await cartSchema.findOne({
        productId: obj.productId,
        color: obj.color,
        size: obj.size,
    })

    if(existingItem) {
        existingItem.qty += obj.qty;
        await existingItem.save()
        return existingItem
    }else{
        return cartSchema(obj).save();
    }
}

export const updateCartItem = (filter, update) => {
    return cartSchema.findOneAndUpdate(filter, update);
}

export const updateCartItemById = ({_id, ...rest}) => {
    return cartSchema.findByIdAndUpdate(_id, rest);
}

export const findCartItem = (filter) => {
    return cartSchema.findOne(filter);
}

export const getCartItem = (filter) => {
    return cartSchema.find(filter)
}

export const deleteCartItems = (filter) => {
    return cartSchema.findOneAndDelete( filter )
}

export const deleteAllCartItems = (filter) => {
    return cartSchema.deleteMany( filter )
}