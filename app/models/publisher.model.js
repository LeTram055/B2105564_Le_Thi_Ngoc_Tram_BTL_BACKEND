const mongoose = require('mongoose')

const PublisherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Tên nhà xuất bản không được để trống"],
    },
    address: {
        type: String,
        required: [true, "Địa chỉ không được để trống"],
    },
})

const Publisher = mongoose.model("Publisher", PublisherSchema);
module.exports = Publisher;