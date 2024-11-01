const modelCart = require("../models/cart.model.js");

exports.create = async (cart) => {
    const result = await modelCart.create(cart);
    return result;
}

exports.getById = async ({cartId, userId, productId}) => {
    let result = null;
    if (cartId) 
        result = await modelCart.findOne({ _id: cartId }).populate("productId userId");
    else if (userId && productId)
        result = await modelCart.findOne({ userId, productId }).populate("productId userId");
    return result
}

exports.getAll = async (userId) => {
    const result = await modelCart.find({ userId }).populate("productId userId");
    return result;
};

exports.update = async (userId, productId, data) => {
    const result = await modelCart.findOneAndUpdate({
        userId,
        productId
    }, data, { new: true });
    return result
}

exports.delete = async ({cartId, userId, productId}) => {
    let result = null;
    if (cartId) 
        result = await modelCart.deleteOne({ _id: cartId });
    else if (userId && productId)
        result = await modelCart.deleteOne({
            userId,
            productId
        
        });
    return result;
}

exports.deleteAll = async (userId) => {
    const result = await modelCart.deleteMany({ userId });
    return result;
}