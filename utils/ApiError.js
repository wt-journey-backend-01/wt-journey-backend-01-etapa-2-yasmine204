class ApiError extends Error {
    constructor(message, statusCode = 500, errors = null) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        
        if(Array.isArray(errors) || errors === null || typeof errors === 'object') {
            this.errors = errors;
        }
        else {
            this.errors = [errors];
        }
    }
}

module.exports = ApiError;