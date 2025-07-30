const ApiError = require('./ApiError');

const errorHandler = (err, req, res, next) => {
    console.log(err.stack);

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            errors: err.errors || []
        });
    }
    
    res.status(500).json({
        status: 'error',
        message: 'Erro interno no servidor.'
    });
};

module.exports = errorHandler;