const modelEmployee = require("../models/employee.model");

const serviceEmployee = {
    create: async (employee) => {
        return await modelEmployee.create(employee);
    },
    getAll: async () => {
        return await modelEmployee.find({});
    },
    getById: async (id) => {
        return await modelEmployee.findOne({ _id: id });
    },
    getByEmail: async (email) => {
        return await modelEmployee.findOne({ email: email });
    },
    delete: async (id) => {
        return await modelEmployee.deleteOne({ _id: id });
    },
    update: async ({ id, data }) => {
        const isExist = await serviceEmployee.getById(id);
        return isExist ? await modelEmployee.findOneAndUpdate({ _id: id }, data) : await serviceEmployee.create(data);
    }
};

module.exports = serviceEmployee;
