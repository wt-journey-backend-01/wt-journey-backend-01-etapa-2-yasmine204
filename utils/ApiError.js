class ApiError extends Error {
    constructor(message, statusCode = 500, errors = []) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.errors = errors;
    }
}

module.exports = ApiError;