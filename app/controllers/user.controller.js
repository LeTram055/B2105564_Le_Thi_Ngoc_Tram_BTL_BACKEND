const mongoose = require('mongoose');
const ApiError = require('../error/apiError.js');
const serviceUser = require("../services/user.service.js")
const bcrypt = require("bcrypt");


exports.getAll = async (req, res, next) => {
    try {
        const result = await serviceUser.getAll();
        res.status(200).json({
            message: "Người đoc đã được lấy thành công",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!(mongoose.Types.ObjectId.isValid(id))) {
            throw new ApiError(400, "Mã không hợp lệ");
        }
        const result = await serviceUser.getById(id);
        if (!result)
            throw new ApiError(400, "Người đọc không tồn tại");
        res.status(200).json({
            message: "Người đọc đã được lấy thành công",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (await serviceUser.getByEmail(email))
            throw new ApiError(400, 'Email đã tồn tại.');
        const data = req.body;
        data.password = await bcrypt.hash(password, 10);
        const result = await serviceUser.create(data);
        res.status(201).json({
            message: "Người đọc đã được tạo thành công",
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
            throw new ApiError(400, "Mã không hợp lệ");
        }
        const result = await serviceUser.delete(id);
        if (result.deletedCount)
            res.status(200).json({
                message: "Người đọc đã được xóa thành công",
                data: result,
            });
        else
            res.status(400).json({
                message: "Mã không hợp lệ",
                data: result,
            });
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!util.isObjectId(id)) {
            throw new ApiError(400, "Mã không hợp lệ");
        }
        if(!(await serviceUser.getById(id))) {
            throw new ApiError(400, "Mã không hợp lệ");
        }
        const data = req.body;
        if (data.password)
            data.password = await bcrypt.hash(data.password, 10);
        const result = await serviceUser.update({id: id, data});
        res.status(200).json({
            message: "Người đọc đã được cập nhật thành công",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;

        if (!(mongoose.Types.ObjectId.isValid(id))) {
            throw new ApiError(400, "Mã người dùng không hợp lệ");
        }

        const user = await serviceUser.getById(id);
        if (!user) {
            throw new ApiError(400, "Người dùng không tồn tại");
        }

        // Kiểm tra mật khẩu cũ
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            throw new ApiError(400, "Mật khẩu cũ không chính xác");
        }

        // Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu mới
        const updatedUser = await serviceUser.updatePassword(id, hashedPassword);

        res.status(200).json({
            message: "Mật khẩu đã được thay đổi thành công",
            data: updatedUser,
        });
    } catch (err) {
        next(err);
    }
};