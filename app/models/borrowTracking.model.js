const mongoose = require('mongoose');

const BorrowTrackingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Người đọc không được để trống"], // Người đọc yêu cầu mượn sách
    },
    requestDate: {
        type: Date,
        default: Date.now, // Ngày người đọc đăng ký mượn, mặc định là thời gian hiện tại khi yêu cầu mượn được tạo
    },
    borrowDate: {
        type: Date,
        default: null, // Ngày mượn chính thức khi trạng thái là "Borrowed"
    },
    expectedReturnDate: {
        type: Date,
        default: null, // Ngày dự kiến trả sách
    },
    actualReturnDate: {
        type: Date,
        default: null, // Ngày trả thực tế
    },
    status: {
        type: String,
        enum: ["Đang xử lý", "Đã xác nhận", "Đã mượn", "Đã hủy", "Đã trả"], // Trạng thái
        default: "Đang xử lý",
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee", // Nhân viên xử lý yêu cầu mượn
        default: null, // Lúc đầu là null, sẽ được cập nhật khi nhân viên xác nhận
    },
    price: {
        type: Number,
        default: 0, // Tổng giá tiền mượn sách
    },
});

const BorrowTracking = mongoose.model("BorrowTracking", BorrowTrackingSchema);
module.exports = BorrowTracking;
