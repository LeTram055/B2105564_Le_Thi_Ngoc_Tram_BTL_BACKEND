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
            throw new ApiError(400, "No cart IDs provided");
        }

        // Tìm tất cả các `Cart` dựa trên mảng `cartIds`
        const cartItems = await Cart.find({ _id: { $in: cartIds } }).populate("bookId userId");
        
        if (!cartItems.length) throw new ApiError(404, "Cart items not found or empty");

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
                if (!book) throw new ApiError(404, "Book not found");

                // Kiểm tra số lượng sách còn lại
                if (book.quantity < item.quantity) {
                    throw new ApiError(400, "Not enough books in stock");
                }

                // Trừ số lượng sách trong kho
                book.quantity -= item.quantity;
                await book.save();

                return await serviceBorrowDetail.create({
                    borrowId: borrowTracking._id,
                    bookId: item.bookId._id,
                    quantity: item.quantity,
                    price: item.bookId.price,
                });
            })
        );

        res.status(201).json({
            message: "Borrow request created successfully",
            data: { borrowTracking, borrowDetails },
        });
    } catch (error) {
        console.error("Error occurred:", error);
        next(error);
    }
};


exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const borrowTracking = await serviceBorrowTracking.getById(id);

        if (!borrowTracking) throw new ApiError(404, "Borrow tracking not found");
        const borrowDetails = await serviceBorrowDetail.getAllByBorrowId(id);

        res.status(200).json({
            message: "Borrow tracking retrieved successfully",
            data: {borrowTracking, borrowDetails},
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllByUserId = async (req, res, next) => {
    try {
        const { userId } = req.params;

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
            message: "All borrow trackings by user retrieved successfully",
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
            message: "All borrow trackings retrieved successfully",
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

        // Xử lý cập nhật các ngày dựa vào trạng thái
        if (status === "Đã mượn") {
            data.borrowDate = new Date(); // Cập nhật ngày mượn là ngày hiện tại
        } else if (status === "Đã trả") {
            data.actualReturnDate = new Date(); // Cập nhật ngày trả thực tế là ngày hiện tại
        }

        // Gọi service để cập nhật yêu cầu mượn với thông tin mới
        const updatedBorrowTracking = await serviceBorrowTracking.update({ id, data });

        if (!updatedBorrowTracking) throw new ApiError(404, "Borrow tracking not found");

        res.status(200).json({
            message: "Borrow tracking updated successfully",
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

        if (!result.deletedCount) throw new ApiError(404, "Borrow tracking not found");

        res.status(200).json({
            message: "Borrow tracking deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
