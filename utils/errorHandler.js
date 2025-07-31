function errorHandler(err, req, res, next) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Erro interno do servidor' });
}

module.exports = errorHandler;