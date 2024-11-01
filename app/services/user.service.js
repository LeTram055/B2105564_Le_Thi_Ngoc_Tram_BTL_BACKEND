const modelUser = require("../models/user.model");

exports.create = async (user) => {
    const result = await modelUser.create(user);
    return result;
};

exports.getAll = async () => {
    const result = await modelUser.find({});
    return result;
};

exports.getById = async (id) => {
    const result = await modelUser.findOne({ _id: id });
    return result;
};

exports.getByEmail = async (email) => {
    const result = await modelUser.findOne({ email });
    return result;
};

exports.delete = async (id) => {
    const result = await modelUser.deleteOne({ _id: id });
    return result;
}

exports.update = async ({id, data}) => {
    const isExist = await this.getById(id);
    let result = await modelUser.findOneAndUpdate({ _id: id }, data);
    return result;
};