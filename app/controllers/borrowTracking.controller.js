const ApiError = require("../error/apiError.js");
const serviceBorrowTracking = require("../services/borrowTracking.service.js");
const serviceBorrowDetail = require("../services/borrowDetail.service.js");
const Cart = require("../models/cart.model.js");
const serviceBook = require("../services/book.service.js");

exports.create = async (req, res, next) => {
    const { cartIds, totalPrice } = req.body;

    try {
        
        // Kiểm tra nếu không có `cartIds`
        if (!cartIds || !cartIds.length) {
            throw new ApiError(400, "Không có giỏ hàng để mượn");
        }

        // Tìm tất cả các `Cart` dựa trên mảng `cartIds`
        const cartItems = await Cart.find({ _id: { $in: cartIds } }).populate("bookId userId");
        
        if (!cartItems.length) throw new ApiError(404, "Giỏ hàng không tồn tại");

        const userId = cartItems[0].userId._id;

        // Tạo `borrowTracking`
        const borrowTracking = await serviceBorrowTracking.create({
            userId: userId,
            status: "Đang xử lý",
            price: totalPrice,
            requestDate: new Date(),
        });

        // Tạo borrowDetails cho mỗi sách trong giỏ hàng
        const borrowDetails = await Promise.all(
            cartItems.map(async (item) => {
                const book = await serviceBook.getById(item.bookId._id);
                if (!book) throw new ApiError(404, "Sách không tồn tại");

                // Kiểm tra số lượng sách còn lại
                if (book.quantity < item.quantity) {
                    throw new ApiError(400, "Không đủ sách trong kho");
                }

                // Trừ số lượng sách trong kho
                book.quantity -= item.quantity;
                await book.save();

                return await serviceBorrowDetail.create({
                    borrowId: borrowTracking._id,
                    bookId: item.bookId._id,
                    quantity: item.quantity,
                    price: (item.bookId.price)*(item.quantity),
                });
            })
        );

        res.status(201).json({
            message: "Yêu cầu mượn sách đã được tạo thành công",
            data: { borrowTracking, borrowDetails },
        });
    } catch (error) {
        next(error);
    }
};


exports.getById = async (req, res, next) => {
    try {
        const { borrowId } = req.params;
        
        const borrowTracking = await serviceBorrowTracking.getById(borrowId);
       

        if (!borrowTracking) throw new ApiError(404, "Theo dõi mượn không tồn tại");
        const borrowDetails = await serviceBorrowDetail.getAllByBorrowId(borrowId);
        
        
        res.status(200).json({
            message: "Theo dõi mượn được tìm thấy thành công",
            data: {borrowTracking, borrowDetails},
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllByUserId = async (req, res, next) => {
    try {
        const { userId } = req.params;
        
        if (!userId) throw new ApiError(400, "Nguời dùng không hợp lệ");
        // Lấy tất cả các borrowTracking của user dựa trên userId
        const borrowTrackings = await serviceBorrowTracking.getAllByUserId(userId);
        
        // Lấy chi tiết mượn cho từng borrowTracking
        const borrowTrackingsWithDetails = await Promise.all(
            borrowTrackings.map(async (tracking) => {
                const borrowDetails = await serviceBorrowDetail.getAllByBorrowId(tracking._id);
                return { ...tracking.toObject(), borrowDetails }; // Convert tracking to plain object and add details
            })
        );

        res.status(200).json({
            message: "Tất cả theo dõi mượn đã được lấy thành công",
            data: borrowTrackingsWithDetails,
        });
    } catch (error) {
        next(error);
    }
};


exports.getAll = async (req, res, next) => {
    try {
        // Lấy tất cả các borrowTracking
        const borrowTrackings = await serviceBorrowTracking.getAll();

        // Lấy chi tiết mượn cho từng borrowTracking
        const borrowTrackingsWithDetails = await Promise.all(
            borrowTrackings.map(async (tracking) => {
                const borrowDetails = await serviceBorrowDetail.getAllByBorrowId(tracking._id);
                return { ...tracking.toObject(), borrowDetails }; // Convert tracking to plain object and add details
            })
        );

        res.status(200).json({
            message: "Tất cả theo dõi mượn đã được lấy thành công",
            data: borrowTrackingsWithDetails,
        });
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, employeeId } = req.body;

        // Tạo đối tượng data để chứa thông tin cần cập nhật
        const data = { status, employeeId };

        // Lấy chi tiết mượn dựa vào borrowId
        const borrowDetails = await serviceBorrowDetail.getAllByBorrowId(id);

        // Xử lý cập nhật các ngày dựa vào trạng thái
        if (status === "Đã mượn") {
            data.borrowDate = new Date();
            data.expectedReturnDate = new Date(new Date().setDate(new Date().getDate() + 30)); // Cập nhật ngày trả dự kiến là 30 ngày sau
        } else if (status === "Đã trả") {
            data.actualReturnDate = new Date(); 
        } else if (status === "Đã hủy") {
            // Tăng lại số lượng sách cho từng sách trong borrowDetails
            await Promise.all(borrowDetails.map(async (detail) => {
                const book = await serviceBook.getById(detail.bookId);
                if (book) {
                    book.quantity += detail.quantity; 
                    await book.save(); 
                }
            }));
        }
        // Gọi service để cập nhật yêu cầu mượn với thông tin mới
        const updatedBorrowTracking = await serviceBorrowTracking.update({ id, data });

        if (!updatedBorrowTracking) throw new ApiError(404, "Theo dõi mượn không tồn tại");

        res.status(200).json({
            message: "Theo dõi mượn cập nhật thành công",
            data: updatedBorrowTracking,
        });
    } catch (error) {
        next(error);
    }
};


exports.delete = async (req, res, next) => {
    try {
        const { id } = req.params;

        await serviceBorrowDetail.deleteAllByBorrowId(id);
        const result = await serviceBorrowTracking.delete(id);

        if (!result.deletedCount) throw new ApiError(404, "Theo dõi mượn không tồn tại");

        res.status(200).json({
            message: "Theo dõi mượn đã được xóa thành công",
        });
    } catch (error) {
        next(error);
    }
};
