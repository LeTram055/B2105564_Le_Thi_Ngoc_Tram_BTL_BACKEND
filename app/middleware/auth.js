const jwt = require('jsonwebtoken');
const ApiError = require('../error/apiError.js');

const jwtSecret = process.env.JWT_SECRET;
const adminRole = "admin";
const userRole = "user";
const employeeRole = "employee";

const getRole = (token) => {
    if (!token) return null;
    const decoded = jwt.verify(token, jwtSecret);
    return decoded.role;
};

const checkRole = (role, allowedRoles, next) => {
    if (!role) throw new ApiError(401, "Hết phiên đăng nhập, vui lòng đăng nhập hoặc đăng ký");
    if (!allowedRoles.includes(role)) throw new ApiError(403, "Tài khoản của bạn không có quyền truy cập, vui lòng đăng nhập với tài khoản có quyền truy cập");
    return next();
};

// Xác thực cho `admin` quyền
exports.adminAuth = async (req, res, next) => {
    try {
        const role = getRole(req.cookies.jwt);
        return checkRole(role, [adminRole], next);
    } catch (err) {
        next(err);
    }
};

// Xác thực cho `user` quyền
exports.userAuth = async (req, res, next) => {
    try {
        const role = getRole(req.cookies.jwt);
        return checkRole(role, [userRole], next);
    } catch (err) {
        next(err);
    }
};

// Xác thực cho `employee` quyền
exports.employeeAuth = async (req, res, next) => {
    try {
        const role = getRole(req.cookies.jwt);
        return checkRole(role, [employeeRole], next);
    } catch (err) {
        next(err);
    }
};

// Xác thực cho `employee` hoặc `admin` quyền
exports.employeeOrAdminAuth = async (req, res, next) => {
    try {
        const role = getRole(req.cookies.jwt);
        return checkRole(role, [employeeRole, adminRole], next);
    } catch (err) {
        next(err);
    }
};

// Xác thực cho `user`, `employee`, hoặc `admin` quyền
exports.userEmployeeOrAdminAuth = async (req, res, next) => {
    try {
        const role = getRole(req.cookies.jwt);
        return checkRole(role, [userRole, employeeRole, adminRole], next);
    } catch (err) {
        next(err);
    }
};
