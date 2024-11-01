const mongoose = require('mongoose');
const ApiError = require('../error/apiError.js');
const serviceEmployee = require("../services/employee.service.js")
const bcrypt = require("bcrypt");

exports.getAll = async (req, res, next) => {
    try {
        const result = await serviceEmployee.getAll();
        res.status(200).json({
            message: "Get all employee successfully",
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
            throw new ApiError(400, "Employee id is not valid");
        }
        const result = await serviceEmployee.getById(id);
        if (!result)
            throw new ApiError(400, "Employee not exist");
        res.status(200).json({
            message: "Get employee successfully",
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
            throw new ApiError(400, 'The employee\'s email already exists.');
        const data = req.body;
        data.password = await bcrypt.hash(password, 10);
        const result = await serviceEmployee.create(data);
        res.status(201).json({
            message: "Create employee successfully",
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
            throw new ApiError(400, "Employee id is not valid");
        }
        const result = await serviceEmployee.delete(id);
        if (result.deletedCount)
            res.status(200).json({
                message: "Delete employee successfully",
                data: result,
            });
        else
            res.status(400).json({
                message: "Employee id not exist",
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
            throw new ApiError(400, "Employee id is not valid");
        }
        const data = req.body;
        if (data.password)
            data.password = await bcrypt.hash(data.password, 10);
        const result = await serviceEmployee.update({id: id, data});
        res.status(200).json({
            message: "Update employee successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};