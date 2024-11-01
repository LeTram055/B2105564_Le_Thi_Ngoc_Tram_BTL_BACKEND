const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    position: {
        type: String,
        default: "Customer care staff",
    },
    address: {
        type: String,
        required: [true, "Address is required"],
    },
    phone: {
        type: String,
        match: [/^(09|08|03|07|05)[0-9]{8}$/, "Phone is not valid"],
        required: [true, "Phone is required"],
    },
    email: {
        type: String,
        unique: [true, "Email is already taken"],
        required: [true, "Email is required"],
    }
});

EmployeeSchema.path('email').validate({
    validator: function(value) {
        if (validator.isEmail(value))
            return true 
        return false
    },
    message: function(props) {
        if (!validator.isEmail(props.value))
            return "Email is not valid"
        return "An error has occurred"
    },
})

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;