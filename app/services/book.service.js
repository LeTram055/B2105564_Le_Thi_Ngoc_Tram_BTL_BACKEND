const ApiError = require("../../error/apiError.js");
const modelBook = require("../../models/book.model.js");

exports.getPublisher = async (id) => {
    const book = await modelBook.findById(id).populate("publisherId").select("publisherId")
    return book.publisherId
}

exports.create = async (book) => {
    const result = await modelBook.create(book);
    return result;
};

exports.getAll = async () => {
    const result = await modelBook.find({}).populate("publisherId");
    return result;
};

exports.getById = async (id) => {
    const result = await modelBook.findOne({ _id: id }).populate("publisherId");
    return result;
};

exports.delete = async (id) => {
    const result = await modelBook.deleteOne({ _id: id });
    return result;
}

exports.update = async ({id, data}) => {
    const isExist = await this.getById(id);
    let result = null;
    if (!isExist)
        throw new ApiError(400, "Book is not exits")
    else
        result = await modelBook.findOneAndUpdate({ _id: id }, data, {new: true});
    return result;
};