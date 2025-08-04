const { ZodError } = require('zod');
const ApiError = require('./ApiError');

function formatZodError (error, next) {
    if(error instanceof ZodError && Array.isArray(error.issues)) {
        const formattedErrors = {};
        error.issues.forEach(e => {
            const field = e.path.join('.');
            formattedErrors[field] = e.message;
        });

        return next(new ApiError('Parâmetros inválidos', 400, formattedErrors));
    }

    return null;
}

module.exports = formatZodError;