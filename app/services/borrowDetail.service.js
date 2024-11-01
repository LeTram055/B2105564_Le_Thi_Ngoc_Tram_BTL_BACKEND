const modelBorrowDetail = require("../models/borrowDetail.model.js");

exports.create = async (detailData) => {
    const result = await modelBorrowDetail.create(detailData);
    return result;
};

exports.getById = async (id) => {
    const result = await modelBorrowDetail.findOne({ _id: id }).populate("bookId");
    return result;
};

exports.getAllByBorrowId = async (borrowId) => {
    const result = await modelBorrowDetail.find({ borrowId }).populate("bookId");
    return result;
};

exports.update = async ({ id, data }) => {
    const result = await modelBorrowDetail.findOneAndUpdate({ _id: id }, data, { new: true });
    return result;
};

exports.delete = async (id) => {
    const result = await modelBorrowDetail.deleteOne({ _id: id });
    return result;
};

exports.deleteAllByBorrowId = async (borrowId) => {
        const result = await BorrowDetail.deleteMany({ borrowId });
        return result;
};
