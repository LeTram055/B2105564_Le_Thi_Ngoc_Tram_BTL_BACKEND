const mongoose = require('mongoose');
const validator = require('validator')

const UserSchema = new mongoose.Schema({
    lastName: {
        type: String,
        required: [true, "Họ không được để trống"],
    },
    firstName: {
        type: String,
        required: [true, "Tên không được để trống"],
    },
    dateOfBirth: {
        type: Date,
        required: [true, "Ngày sinh không được để trống"],
    },
    gender: {
        type: String,
        required: [true, "Giới tính không được để trống"],
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
    password: {
        type: String,
        required: [true, "Mật khẩu không được để trống"],
        min: [8, "Mật khẩu phải chứa ít nhất 6 ký tự"],
    },
    email: {
        type: String,
        unique: [true, "Email đã tồn tại"],
        required: [true, "Email không được để trống"],
    }
});

UserSchema.path('email').validate({
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

const User = mongoose.model("User", UserSchema);
module.exports = User;