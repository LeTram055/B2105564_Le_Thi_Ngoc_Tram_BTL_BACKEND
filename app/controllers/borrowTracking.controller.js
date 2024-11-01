const ApiError = require("../error/apiError.js");
const serviceBorrowTracking = require("../services/borrowTracking.service.js");
const serviceBorrowDetail = require("../services/borrowDetail.service.js");

exports.create = async (req, res, next) => {
    const { userId, expectedReturnDate, bookDetails } = req.body;

    try {
        // Tạo `borrowTracking` với `price: null`
        const borrowTracking = await serviceBorrowTracking.create({
            userId: userId,
            expectedReturnDate: expectedReturnDate,
            price: null,
        });

        let totalPrice = 0;

        // Lấy thông tin giá sách từ `bookDetails` và tính tổng giá
        const borrowDetails = await Promise.all(
            bookDetails.map(async (detail) => {
                const book = await Book.findById(detail.bookId);
                const bookPrice = book.price * detail.quantity;
                totalPrice += bookPrice;

                // Tạo bản ghi chi tiết mượn sách với `borrowId`
                return await serviceBorrowDetail.create({
                    borrowId: borrowTracking._id,
                    bookId: detail.bookId,
                    quantity: detail.quantity,
                    price: book.price,
                });
            })
        );

        // Cập nhật lại `borrowTracking` với `totalPrice`
        borrowTracking.price = totalPrice;
        await borrowTracking.save();

        res.status(201).json({
            message: "Borrow request created successfully",
            data: { borrowTracking, borrowDetails },
        });
    } catch (error) {
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
