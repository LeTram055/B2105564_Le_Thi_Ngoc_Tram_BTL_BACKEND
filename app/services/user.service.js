const model = require("../../models/user.model");

exports.create = async (user) => {
    const result = await model.User.create(user);
    return result;
};

exports.getAll = async () => {
    const result = await model.User.find({});
    return result;
};

exports.getById = async (id) => {
    const result = await model.User.findOne({ _id: id });
    return result;
};

exports.getByEmail = async (email) => {
    const result = await model.User.findOne({ email });
    return result;
};

exports.delete = async (id) => {
    const result = await model.User.deleteOne({ _id: id });
    return result;
}

exports.update = async ({id, data}) => {
    const isExist = await this.getById(id);
    let result = await model.User.findOneAndUpdate({ _id: id }, data);
    return result;
};