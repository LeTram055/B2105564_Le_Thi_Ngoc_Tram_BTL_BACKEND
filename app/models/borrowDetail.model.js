const mongoose = require('mongoose');

const BorrowDetailsSchema = new mongoose.Schema({
    borrowId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BorrowTracking",
        required: [true, "Mượn sách id không được để trống"],
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: [true, "Sách id không được để trống"],
    },
    quantity: {
        type: Number,
        required: [true, "Số lượng sách không được để trống"],
        min: 1,
    },
    price: {
        type: Number,
        required: [true, "Giá tiền không được để trống"],
        min: 0,
    },
});

const BorrowDetails = mongoose.model("BorrowDetails", BorrowDetailsSchema);
module.exports = BorrowDetails;
