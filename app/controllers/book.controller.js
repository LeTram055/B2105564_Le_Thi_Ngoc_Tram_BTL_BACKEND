const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const ApiError = require('../error/apiError.js');
const serviceBook = require("../services/book.service.js")
const borrowDetail = require("../models/borrowDetail.model.js")

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
            message: "Sách đã được lấy thành công",
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
            throw new ApiError(400, "Mã sách không hợp lệ");
        }
        const book = await serviceBook.getById(id);
        if (!book)
            throw new ApiError(400, "Sách không tồn tại");
        
        
        res.status(200).json({
            message: "Sách đã được lấy thành công",
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
            message: "Sách đã được tạo thành công",
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
            throw new ApiError(400, "Mã sách không hợp lệ");
        }

        const borrowDetails = await borrowDetail.find({ bookId: id });
        if (borrowDetails.length) {
            return res.status(400).json({
                message: "Không thể xóa sách này vì có người đang mượn",
            });
        }

        const book = await serviceBook.getById(id);

        if (book.image) {
            const imagePath = path.join(__dirname, '..', book.image);
            fs.unlink(imagePath, (err) => {
                if (err) console.error("Thất bại khi xóa hình:", err);
            });
        }

        //delete book
        const result = await serviceBook.delete(book._id);


        if (result.deletedCount)
            res.status(200).json({
                message: "Sách đã được xóa thành công",
                data: result,
            });
        else
            res.status(400).json({
                message: "Xóa sách thất bại!",
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
            throw new ApiError(400, "Sách không tồn tại");
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
                    if (err) console.error("Thất bại khi xóa ảnh cũ:", err);
                });
            }
        } else {
            // Nếu không có file mới, giữ nguyên đường dẫn ảnh cũ
            data.image = existingBook.image;
        }

        const result = await serviceBook.update({ id: id, data });
        res.status(200).json({
            message: "Sách đã được cập nhật thành công",
            data: result,
        });
    } catch (err) {
        next(err);
    }
}];