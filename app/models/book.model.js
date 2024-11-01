const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    image: {
        type: String,
        required: [true, "Image is required"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
    },
    publishYear: {
        type: Number,
        required: [true, "Publishing Year is required"],
    },
    publisherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Publisher",
        required: [true, "Publisher id is required"],
    },
    author: {
        type: String,
        required: [true, "Author is required"],
    },
    description: {
        type: String,
        default: "Không có mô tả",
    },
});

const Book = mongoose.model("Book", BookSchema);
module.exports = Book;