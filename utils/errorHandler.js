function errorHandler(err, req, res, next) {
    const status = err.statusCode || 500;
    
    const response = {
        status,
        message: err.message || 'Erro interno do servidor.',
        errors: Array.isArray(err.errors) ? err.errors : []
    };

    res.status(status).json(response);
}

module.exports = errorHandler;