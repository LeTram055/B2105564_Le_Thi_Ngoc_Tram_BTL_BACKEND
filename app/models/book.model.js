const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Tên sách không được để trống"],
    },
    image: {
        type: String,
        required: [true, "Hình ảnh không được để trống"],
    },
    price: {
        type: Number,
        required: [true, "Giá sách không được để trống"],
    },
    quantity: {
        type: Number,
        required: [true, "Số lượng sách không được để trống"],
    },
    publishYear: {
        type: Number,
        required: [true, "Năm xuất bản không được để trống"],
    },
    publisherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Publisher",
        required: [true, "Nhà xuất bản không được để trống"],
    },
    author: {
        type: String,
        required: [true, "Tác giả không được để trống"],
    },
    description: {
        type: String,
        default: "Không có mô tả",
    },
});

const Book = mongoose.model("Book", BookSchema);
module.exports = Book;