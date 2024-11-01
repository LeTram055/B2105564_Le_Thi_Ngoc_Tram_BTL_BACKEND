const mongoose = require('mongoose');

const BorrowDetailsSchema = new mongoose.Schema({
    borrowId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BorrowTracking",
        required: [true, "Borrow id is required"],
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: [true, "Book id is required"],
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: 1,
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: 0,
    },
});

const BorrowDetails = mongoose.model("BorrowDetails", BorrowDetailsSchema);
module.exports = BorrowDetails;
