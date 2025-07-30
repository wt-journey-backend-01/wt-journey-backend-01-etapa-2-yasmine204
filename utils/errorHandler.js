const errorHandler = (err, req, res, next) => {
    console.log(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erro interno no servidor.';
    const errors = err.errors || [];

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        errors
    });
};

module.exports = errorHandler;