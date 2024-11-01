const modelEmployee = require("../models/employee.model");

exports.create = async (employee) => {
    const result = await modelEmployee.create(employee);
    return result;
};

exports.getAll = async () => {
    const result = await modelEmployee.find({});
    return result;
};

exports.getById = async (id) => {
    const result = await modelEmployee.findOne({ _id: id });
    return result;
};

exports.getByEmail = async (email) => {
    const result = await modelEmployee.findOne({ email });
    return result;
};


exports.delete = async (id) => {
    const result = await modelEmployee.deleteOne({ _id: id });
    return result;
}

exports.update = async ({id, data}) => {
    const isExist = await this.getById(id);
    let result = null;
    if (!isExist)
        result = await this.create(data);
    else
        result = await modelEmployee.findOneAndUpdate({ _id: id }, data);
    return result;
};