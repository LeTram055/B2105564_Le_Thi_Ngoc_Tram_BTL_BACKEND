const modelBorrowTracking = require("../models/borrowTracking.model");

exports.create = async (borrowData) => {
    const result = await modelBorrowTracking.create(borrowData);
    return result;
};

exports.getById = async (id) => {
    const result = await modelBorrowTracking.findOne({ _id: id }).populate("userId employeeId borrowDetails.bookId");
    return result;
};

exports.getAllByUserId = async (userId) => {
    const result = await modelBorrowTracking.find({ userId }).populate("employeeId borrowDetails.bookId");
    return result;
};

exports.getAll = async () => {
    const result = await modelBorrowTracking.find().populate("userId employeeId borrowDetails.bookId");
    return result;
};


exports.update = async ({ id, data }) => {
    
    const result = await modelBorrowTracking.findOneAndUpdate({ _id: id }, data, { new: true });
    
    return result;
};

exports.delete = async (id) => {
    const result = await modelBorrowTracking.deleteOne({ _id: id });
    return result;
};
