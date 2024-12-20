const mongoose = require('mongoose');
const ApiError = require('../error/apiError.js');
const serviceEmployee = require("../services/employee.service.js")
const bcrypt = require("bcrypt");

exports.getAll = async (req, res, next) => {
    try {
        const result = await serviceEmployee.getAll();
        res.status(200).json({
            message: "Nhân viên đã được lấy thành công",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params
        if (!(mongoose.Types.ObjectId.isValid(id))) {
            throw new ApiError(400, "Mã nhân viên không hợp lệ");
        }
        const result = await serviceEmployee.getById(id);
        if (!result)
            throw new ApiError(400, "Nhân viên không tồn tại");
        res.status(200).json({
            message: "Nhân viên đã được lấy thành công",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (await serviceEmployee.getByEmail(email))
            throw new ApiError(400, 'Email đã đăng ký.');
        const data = req.body;
        data.password = await bcrypt.hash(password, 10);
        const result = await serviceEmployee.create(data);
        res.status(201).json({
            message: "Nhân viên đã được tạo thành công",
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
            throw new ApiError(400, "Mã nhân viên không hợp lệ");
        }
        const result = await serviceEmployee.delete(id);
        if (result.deletedCount)
            res.status(200).json({
                message: "Nhân viên đã được xóa thành công",
                data: result,
            });
        else
            res.status(400).json({
                message: "Mã nhân viên không tồn tại",
                data: result,
            });
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!(mongoose.Types.ObjectId.isValid(id))) {
            throw new ApiError(400, "Mã nhân viên không hợp lệ");
        }
        const data = req.body;
        if (data.password)
            data.password = await bcrypt.hash(data.password, 10);
        const result = await serviceEmployee.update({id: id, data});
        res.status(200).json({
            message: "Nhân viên đã được cập nhật thành công",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

// Thêm vào controller employee.controller.js

exports.changePassword = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;

        if (!(mongoose.Types.ObjectId.isValid(id))) {
            throw new ApiError(400, "Mã nhân viên không hợp lệ");
        }

        const employee = await serviceEmployee.getById(id);
        if (!employee) {
            throw new ApiError(400, "Nhân viên không tồn tại");
        }

        // Kiểm tra mật khẩu cũ
        const isOldPasswordValid = await bcrypt.compare(oldPassword, employee.password);
        if (!isOldPasswordValid) {
            throw new ApiError(400, "Mật khẩu cũ không chính xác");
        }

        // Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu mới
        const updatedEmployee = await serviceEmployee.updatePassword(id, hashedPassword);

        res.status(200).json({
            message: "Mật khẩu đã được thay đổi thành công",
            data: updatedEmployee,
        });
    } catch (err) {
        next(err);
    }
};
