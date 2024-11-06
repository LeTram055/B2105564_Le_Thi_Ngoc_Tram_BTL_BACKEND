const mongoose = require('mongoose');
const ApiError = require('../error/apiError.js');
const serviceCart = require("../services/cart.service.js")
const serviceBook = require("../services/book.service.js")

exports.extractCart = async (cart) => {
    const book = await serviceBook.getById(cart._doc.bookId._doc._id)
    cart._doc.bookId._doc = book

    cart._doc.quantity = Math.min(cart._doc.quantity, cart._doc.bookId._doc.quantity)

    // if quantity == 0 => delete cart
    if (cart._doc.quantity === 0) {
        await serviceCart.delete({
            userId: cart._doc.userId._doc._id,
            bookId: cart._doc.bookId._doc._id
        })
        return null
    }
    return cart
}

exports.getAll = async (req, res, next) => {
    const { userId } = req.params
    try {
        if (!(mongoose.Types.ObjectId.isValid(userId))) {
            throw new ApiError(400, "User id is not valid");
        }
        let carts = await serviceCart.getAll(userId)
        
        carts = await Promise.all(carts.map(async (cart) => {
            return this.extractCart(cart)
        }));

        // filter cart is null
        carts = carts.filter(cart => cart !== null)

        res.status(200).json({
            message: "Get all cart successfully",
            data: carts,
        });
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    const { id } = req.params
    try {
        if (!(util.isObjectId(id))) {
            throw new ApiError(400, "Cart id is not valid");
        }
        const cart = await serviceCart.getById({
            cartId: id
        })
        if (!cart)
            throw new ApiError(400, "Cart not exist");
        const result = await this.extractCart(cart)
        if (result)
            res.status(200).json({
                message: "Get cart successfully",
                data: result,
            });
        else {
            throw new ApiError(400, "Cart not exist");
        }
    } catch (err) {
        next(err);
    }
};

exports.add = async (req, res, next) => {
    const { userId, bookId } = req.params
    
    if (!(mongoose.Types.ObjectId.isValid(userId) && mongoose.Types.ObjectId.isValid(bookId))) {
        throw new ApiError(400, "User id or Book id is not valid");
    }


    // call api book to get quantity
    const book = await serviceBook.getById(bookId)
    if (!book) {
        
        throw new ApiError(400, "Book not exist");
    }

    // get cart, if cart not exist => create cart with quantiy = 0
    let cart = await serviceCart.getById({ userId, bookId })
    if (!cart)
        cart = await serviceCart.create({ userId, bookId, quantity: 0 })
    
    const quantity = Math.min(req.body.quantity + cart.quantity, book.quantity)

    try {
        const result = await serviceCart.update(userId, bookId, { quantity });
        res.status(200).json({
            message: "Thêm vào giỏ hàng thành công",
            data: result,
        });
    } catch (err) {
        next(err);
    }
}

exports.update = async (req, res, next) => {
    const { userId, bookId } = req.params

    // check userId, bookId
    if (!(mongoose.Types.ObjectId.isValid(userId) && mongoose.Types.ObjectId.isValid(bookId))) {
        throw new ApiError(400, "Mã người dùng hoặc mã sách không hợp lệ");
    }

    // call api book to get quantity
    const book = await serviceBook.getById(bookId)
    if (!book)
        throw new ApiError(400, "Sách không tồn tại");

    // get cart, if cart not exist => create cart with quantiy = 0
    let cart = await serviceCart.getById({ userId, bookId })
    if (!cart)
        cart = await serviceCart.create({ userId, bookId, quantity: 0 })

    const quantity = Math.min(req.body.quantity, book.quantity)
    // quantity == 0 => delete cart
    if (quantity === 0) {
        try {
            const result = await serviceCart.delete({ userId, bookId });
            if (result.deletedCount)
                res.status(200).json({
                    message: "Sách đã được xóa khỏi giỏ hàng",
                    data: result,
                });
            else
                res.status(400).json({
                    message: "Giỏ hàng không tồn tại",
                    data: result,
                });
        } catch (err) {
            next(err);
        }
    } else {
        try {
            const result = await serviceCart.update(userId, bookId, { quantity });
            res.status(200).json({
                message: "Cập nhật giỏ hàng thành công",
                data: result,
            });
        } catch (err) {
            next(err);
        }
    }
};

exports.delete = async (req, res, next) => {
    const { userId, bookId } = req.params

    // check userId, bookId
    if (!(mongoose.Types.ObjectId.isValid(userId) && mongoose.Types.ObjectId.isValid(bookId))) {
        throw new ApiError(400, "Mã người dùng hoặc mã sách không hợp lệ");
    }

    try {
        const result = await serviceCart.delete({ userId, bookId });
        if (result)
            res.status(200).json({
                message: "Xóa khỏi giỏ hàng thành công",
                data: result,
            });
        else
            res.status(400).json({
                message: "Giỏ hàng không tồn tại",
                data: result,
            });
    } catch (err) {
        next(err);
    }
};