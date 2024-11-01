const modelPublisher = require("../../models/publisher.model.js");

exports.create = async (user) => {
    const result = await modelPublisher.create(user);
    return result;
};

exports.getAll = async () => {
    const result = await modelPublisher.find({});
    return result;
};

exports.getById = async (id) => {
    const result = await modelPublisher.findOne({ _id: id });
    return result;
};

exports.getByEmail = async (email) => {
    const result = await modelPublisher.findOne({ email: email });
    return result;
}

exports.delete = async (id) => {
    const result = await modelPublisher.deleteOne({ _id: id });
    return result;
}

exports.update = async ({id, data}) => {
    const isExist = await this.getById(id);
    let result = null;
    if (!isExist)
        result = await this.create(data);
    else
        result = await modelPublisher.findOneAndUpdate({ _id: id }, data);
    return result;
};