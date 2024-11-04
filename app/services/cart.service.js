const modelCart = require("../models/cart.model.js");

exports.create = async (cart) => {
    const result = await modelCart.create(cart);
    return result;
}

exports.getById = async ({cartId, userId, bookId}) => {
    let result = null;
    if (cartId) 
        result = await modelCart.findOne({ _id: cartId }).populate("bookId userId");
    else if (userId && bookId)
        result = await modelCart.findOne({ userId, bookId }).populate("bookId userId");
    return result
}

exports.getAll = async (userId) => {
    const result = await modelCart.find({ userId }).populate("bookId userId");
    return result;
};

exports.update = async (userId, bookId, data) => {
    const result = await modelCart.findOneAndUpdate({
        userId,
        bookId
    }, data, { new: true });
    return result
}

exports.delete = async ({cartId, userId, bookId}) => {
    let result = null;
    if (cartId) 
        result = await modelCart.deleteOne({ _id: cartId });
    else if (userId && bookId)
        result = await modelCart.deleteOne({
            userId,
            bookId
        
        });
    return result;
}

exports.deleteAll = async (userId) => {
    const result = await modelCart.deleteMany({ userId });
    return result;
}