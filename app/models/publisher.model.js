const mongoose = require('mongoose')

const PublisherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    address: {
        type: String,
        required: [true, "Address is required"],
    },
})

const Publisher = mongoose.model("Publisher", PublisherSchema);
module.exports = Publisher;