import OrderSchema from './OrderSchema.js'

export const insertOrder = (obj) => {
    return OrderSchema(obj).save();
}

export const updateOrder = (filter, update) => {
    return OrderSchema.findOneAndUpdate(filter, update);
}

export const updateOrderById = ({_id, ...rest}) => {
    return OrderSchema.findByIdAndUpdate(_id, rest);
}

export const findOrder = (filter) => {
    return OrderSchema.findOne(filter);
}

export const getOrders = (filter) => {
    return OrderSchema.find(filter).sort({ createdAt: -1 });
}

