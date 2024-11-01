const express = require('express');
const cors = require('cors');
const path = require('path');

const ApiError = require('./app/error/apiError.js');
const middleware = require('./app/middleware/handleError.js');

const app = express();


app.use(cors());
app.use(express.json());

// Middleware phục vụ hình ảnh từ thư mục "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//routes
const UserRouter = require('./app/routes/user.route.js');
const EmployeeRouter = require('./app/routes/employee.route.js');
const AuthRouter = require('./app/routes/auth.route.js');
const BookRouter = require('./app/routes/book.route.js')
const PublisherRouter = require('./app/routes/publisher.route.js')
const CartRouter = require('./app/routes/cart.route.js')
const BorrowTrackingRouter = require('./app/routes/borrowTracking.route.js')
//const BorrowDetailRouter = require('./app/routes/borrowDetail.route.js')


app.get("/", (req, res) => {
    res.json({ message: "Hello, World!" });
});

app.use('/api', AuthRouter);
app.use("/api/users", UserRouter);
app.use("/api/employees", EmployeeRouter);
app.use("/api/books", BookRouter);
app.use("/api/publishers", PublisherRouter);
app.use("/api/carts", CartRouter);
app.use("/api/borrowTrackings", BorrowTrackingRouter);
//app.use("/api/borrowDetails", BorrowDetailRouter);

app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});
app.use((err, req, res, next) => {
    const { statusCode, message } = middleware.handleError(err);
    return res.status(statusCode).json({
        message
    });
});

module.exports = app;