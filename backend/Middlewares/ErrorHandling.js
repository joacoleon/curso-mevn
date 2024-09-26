const errorHandler = (err, req, res, next) => {
    let error = {...err};
    error.message = err.message;
    error.name = err.name;

    let message;

    if (err.name === 'CastError'){
        message = "Resource not found";
        error = errorResponseHelper(message, 404);
    }

    if (err.code === 11000){
        message = "Duplicate field value entered";
        error = errorResponseHelper(message, 400);
    }

    if  (err.name === 'ValidationError'){
        message = Object.values(err.errors).map(value => value.message);
        error = errorResponseHelper(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        code: error.statusCode,
        message: error.message || "Server error!"
    })
}

function errorResponseHelper(message, statusCode){
    let error = {
        statusCode: statusCode,
        message: message
    }
    return error;
}

export default errorHandler;