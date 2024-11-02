const modelUser = require("../models/user.model");

const serviceUser = {
    create: async (user) => {
        return await modelUser.create(user);
    },
    getAll: async () => {
        return await modelUser.find({});
    },
    getById: async (id) => {
        return await modelUser.findOne({ _id: id });
    },
    getByEmail: async (email) => {
        return await modelUser.findOne({ email: email });
    },
    delete: async (id) => {
        return await modelUser.deleteOne({ _id: id });
    },
    update: async ({ id, data }) => {
        const isExist = await serviceUser.getById(id);
        return isExist ? await modelUser.findOneAndUpdate({ _id: id }, data) : await serviceUser.create(data);
    }
};

module.exports = serviceUser;
