const ApiError = require('../error/apiError.js');
const mongoose = require('mongoose');

const handleError = (err) => {
    if(err instanceof ApiError) 
        return err
    else if(err instanceof mongoose.Error && err.errors)
        return new ApiError(400, err.errors[Object.keys(err.errors)[0]].message)
    if (err.message)
        return new ApiError(500, err.message)
    return new ApiError(500, "Internal Server Error")
};

module.exports = handleError;