const mongoose = require('mongoose');
const ApiError = require('../error/apiError.js');
const servicePublisher = require("../services/publisher.service.js")
const Book = require("../models/book.model.js");

exports.getAll = async (req, res, next) => {
    try {
        const result = await servicePublisher.getAll();
        res.status(200).json({
            message: "Nhà xuất bản đã được lấy thành công",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await servicePublisher.getById(id);
        if (!result)
            throw new ApiError(400, "Nhà xuất bản không tồn tại");
        res.status(200).json({
            message: "Nhà xuất bản đã được lấy thành công",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const data = req.body;
        
        const result = await servicePublisher.create(data);
        res.status(201).json({
            message: "Nhà xuất bản đã được tạo thành công",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!(mongoose.Types.ObjectId.isValid(id))) {
            throw new ApiError(400, "Nhà xuất bản id không hợp lệ");
        }
        // Kiểm tra xem có sách nào liên quan đến publisher này không
        const relatedBooks = await Book.findOne({ publisherId: id });
        if (relatedBooks) {
            // Nếu có sách liên quan, trả về thông báo lỗi
            return res.status(400).json({
                message: "Không thể xóa nhà xuất bản này vì có sách liên quan đến nó",
            });
        }
        const result = await servicePublisher.delete(id);
        if (result.deletedCount)
            res.status(200).json({
                message: "Nhà xuất bản đã được xóa thành công",
                data: result,
            });
        else
            throw new ApiError(400, "Nhà xuất bản không tồn tại");
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!(mongoose.Types.ObjectId.isValid(id))) {
            throw new ApiError(400, "Nhà xuất bản id không hợp lệ");
        }
        const data = req.body;
        
        const result = await servicePublisher.update({id: id, data});
        res.status(200).json({
            message: "Nhà xuất bản đã được cập nhật thành công",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};