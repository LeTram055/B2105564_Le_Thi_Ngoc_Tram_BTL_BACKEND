const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');


const EmployeeSchema = new Schema({
    name: {
        type: String,
        required: [true, "Tên nhân viên không được để trống"],
    },
    password: {
        type: String,
        required: [true, "Mật khẩu không được để trống"],
    },
    position: {
        type: String,
        default: "Chăm sóc khách hàng",
    },
    address: {
        type: String,
        required: [true, "Địa chỉ không được để trống"],
    },
    phone: {
        type: String,
        match: [/^(09|08|03|07|05)[0-9]{8}$/, "Số điện thoại không hợp lệ"],
        required: [true, "Số điện thoại không được để trống"],
    },
    email: {
        type: String,
        unique: [true, "Email đã tồn tại"],
        required: [true, "Email không được để trống"],
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
            return "Email không hợp lệ"
        return "Một lỗi đã xảy ra"
    },
})

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;