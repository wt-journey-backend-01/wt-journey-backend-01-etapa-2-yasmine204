const { ZodError } = require('zod');
const ApiError = require('./ApiError');

function formatZodError (error, next) {
    if(error instanceof ZodError && Array.isArray(error.issues)) {
        const formattedErrors = error.issues.map(e => {
            if(e.code === 'invalid_type') {
                return { [e.path.join('.')]: `O campo ${e.path.join('.')} é obrigatório.` };
            }
            
            return { [e.path.join('.')]: e.message };
        });

        next(new ApiError('Parâmetros inválidos', 400, formattedErrors));
        return true;
    }

    return false;
}

module.exports = formatZodError;