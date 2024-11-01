class ApiError extends Error {
    constructor(statusCode, message) {
        super();
        if(!statusCode) {
            statusCode = 500;
            message = "Internal Server Error";
        }
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ApiError;