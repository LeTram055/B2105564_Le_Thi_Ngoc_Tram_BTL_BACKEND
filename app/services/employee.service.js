const model = require("../models/employee.model");

exports.create = async (employee) => {
    const result = await model.Employee.create(employee);
    return result;
};

exports.getAll = async () => {
    const result = await model.Employee.find({});
    return result;
};

exports.getById = async (id) => {
    const result = await model.Employee.findOne({ _id: id });
    return result;
};

exports.getByEmail = async (email) => {
    const result = await model.Employee.findOne({ email });
    return result;
};


exports.delete = async (id) => {
    const result = await model.Employee.deleteOne({ _id: id });
    return result;
}

exports.update = async ({id, data}) => {
    const isExist = await this.getById(id);
    let result = null;
    if (!isExist)
        result = await this.create(data);
    else
        result = await model.Employee.findOneAndUpdate({ _id: id }, data);
    return result;
};