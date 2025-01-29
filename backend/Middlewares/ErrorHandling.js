const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    console.log(err);

    let message;

    if (err.name === 'TypeError' || err.name === 'CastError') {
        message = "Invalid request";
        error = errorResponseHelper(message, 400); //BAD REQUEST
    }

    if (err.code === 11000) {
        message = "At least one unique field already exist in another document"; //CUANDO TRATO DE CREAR UN USUARIO CON NAME Y/O EMAIL QUE YA TIENE OTRO USUARIO
        error = errorResponseHelper(message, 400);
    }

    if (err.name === 'ValidationError') {
        message = Object.values(err.errors).map(value => value.message);
        error = errorResponseHelper(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        code: error.statusCode || error.name || 500,
        message: error.message || "Server error!"
    })
}

function errorResponseHelper(message, statusCode) {
    let error = {
        statusCode: statusCode,
        message: message
    }
    return error;
}

export default errorHandler;