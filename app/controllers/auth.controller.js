const ApiError = require('../error/apiError.js');
const bcrypt = require("bcrypt");
const jwt = require('../services/auth.service.js')
const serviceUser = require("../services/user.service.js")
const serviceEmployee = require("../services/employee.service.js")
const emailValidator = require("email-validator");

const adminRole = "admin"
const employeeRole = "employee"
const userRole = "user"

exports.register = async (req, res, next) => {
    try {
        const data = req.body;
        if (await serviceUser.getByEmail(data.email) || await serviceEmployee.getByEmail(data.email))
            throw new ApiError(400, 'The user\'s email already exists.');
        data.password = await bcrypt.hash(data.password, 10);
        const user = await serviceUser.create(data);
        const token = jwt.createJWT(
            {
                response: res,
                data: {
                    id: user.id, 
                    email: user.email, 
                    role: userRole,
                },
            }
        )
        res.status(200).json({
            message: "Register successfully",
            data: user,
            token,
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (emailValidator.validate(email) === false) {
            throw new ApiError(400, "Email is invalid");
        }
        const user = await serviceUser.getByEmail(email);
        const employee = await serviceEmployee.getByEmail(email)
        // Lấy mật khẩu hash từ user hoặc employee
        const hashPassword = user ? user.password : employee.password;

        // So sánh mật khẩu đã nhập với mật khẩu đã lưu
        const correctPassword = await bcrypt.compare(password, hashPassword);
        if (!correctPassword)
            throw new ApiError(400, "Password is wrong")

        let role;
        if (user) {
            role = userRole;
        } else if (employee) {
            role = (email === "admin123@gmail.com") ? adminRole : employeeRole; // Nếu là employee, kiểm tra email để đặt role
        }
        
        const data = {
            id: user ? user.id : employee.id, 
            email: user ? user.email : employee.email, 
            role: role,
        }
        const token = jwt.createJWT(
            {
                response: res,
                data
            }
        )

        res.status(200).json({
            message: "Login successfully",
            data,
            token,
        });
    } catch (err) {
        next(err);
    }
};

exports.logout = async (req, res, next) => {
    try {
        jwt.resetJWT({ response: res })
        res.status(200).json({
            message: "Log out successfully",
        });
    } catch (err) {
        next(err);
    }
};