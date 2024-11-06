const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Mã người dùng không được để trống"],
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: [true, "Mã sách không được để trống"],
    },
    quantity: {
        type: Number,
        default: 0,
    },
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;