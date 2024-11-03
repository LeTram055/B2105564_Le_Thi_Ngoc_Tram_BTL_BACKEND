const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const ApiError = require('../error/apiError.js');
const serviceBook = require("../services/book.service.js")

// Cấu hình multer để lưu ảnh vào thư mục "uploads"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'app/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });


exports.getAll = async (req, res, next) => {
    try {
        let books = await serviceBook.getAll();
        books = await Promise.all(books.map(async (book) => {
            
            return book;
        }));

        res.status(200).json({
            message: "Get all book successfully",
            data: books,
        });
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!(mongoose.Types.ObjectId.isValid(id))) {
            throw new ApiError(400, "Book id is not valid");
        }
        const book = await serviceBook.getById(id);
        if (!book)
            throw new ApiError(400, "Book not exist");
        
        
        res.status(200).json({
            message: "Get book successfully",
            data: book,
        });
    } catch (err) {
        next(err);
    }
};

exports.create = [upload.single('image'), async (req, res, next) => {
    try {
        const data = req.body;

        if (req.file) {
            // Lưu URL của hình ảnh vào trường image trong database
            data.image = `/uploads/${req.file.filename}`;
        }

        const result = await serviceBook.create(data);
        res.status(201).json({
            message: "Create book successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
}];

exports.delete = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!(mongoose.Types.ObjectId.isValid(id))) {
            throw new ApiError(400, "Book id is not valid");
        }

        const book = await serviceBook.getById(id);

        if (book.image) {
            const imagePath = path.join(__dirname, '..', book.image);
            fs.unlink(imagePath, (err) => {
                if (err) console.error("Failed to delete image:", err);
            });
        }

        //delete book
        const result = await serviceBook.delete(book._id);


        if (result.deletedCount)
            res.status(200).json({
                message: "Delete book successfully",
                data: result,
            });
        else
            res.status(400).json({
                message: "Delete book failed!",
                data: result,
            });
    } catch (err) {
        next(err);
    }
};

exports.update = [upload.single('image'), async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!(mongoose.Types.ObjectId.isValid(id))) {
            throw new ApiError(400, "Book id is not valid");
        }

        const existingBook = await serviceBook.getById(id);
        
        const data = req.body;
        if (req.file) {
            // Lưu URL của ảnh mới vào database
            data.image = `/uploads/${req.file.filename}`;

            // Xóa ảnh cũ nếu tồn tại
            if (existingBook.image) {
                const oldImagePath = path.join(__dirname, '..', existingBook.image);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error("Failed to delete old image:", err);
                });
            }
        } else {
            // Nếu không có file mới, giữ nguyên đường dẫn ảnh cũ
            data.image = existingBook.image;
        }

        const result = await serviceBook.update({ id: id, data });
        res.status(200).json({
            message: "Update book successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
}];