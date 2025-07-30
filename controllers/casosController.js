const repository = require('../repositories/casosRepository');
const { casosSchema } = require('../utils/casosValidation');

class ApiError extends Error {
    constructor(message, statusCode = 500, errors = []) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.errors = errors;
    }
}

function isValidUuid(id) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

const getCasos = (req, res, next) => {
    try {
        const casos = repository.findAll();
        
        res.status(200).json(casos);
    }
    catch(error) {
        next(new ApiError('Erro ao listar casos.'));
    }
};

const getCasoById = (req, res, next) => {
    try {
        const { id } = req.params;

        if(!isValidUuid(id)) {
            return next(new ApiError('ID inválido.', 404));
        }

        const caso = repository.findById(id);

        if(!caso) {
            return next(new ApiError('Caso não encontrado.', 404));
        }

        res.status(200).json(caso);
    } 
    catch (error) {
        next(new ApiError('Erro ao listar caso.'));
    }
};

const createCaso = (req, res, next) => {
    try {
        const { titulo, descricao, status } = req.body;
        const dataReceived = {
            titulo,
            descricao,
            status: status.toLowerCase()
        };
        const data = casosSchema.parse(dataReceived);
        const newCaso = repository.create(data);

        res.status(201).json(newCaso);
    } 
    catch (error) {
        next(new ApiError(error.message, 400));
    }
};

const updateCompletelyCaso = (req, res, next) => {
    try {
        const { id } = req.params;

        if (!isValidUuid(id)) {
        return next(new ApiError('ID inválido.', 404));
        }

        const data = casosSchema.parse(req.body);
        const updated = repository.updateCompletely(id, data);

        if (!updated) {
            return next(new ApiError('Caso não encontrado.', 404));
        }

        res.status(200).json(updated);
    } 
    catch (error) {
        next(new ApiError(error.message, 400));
    }
};

const partiallyUpdateCaso = (req, res, next) => {
    try {
        const { id } = req.params;

        if(!isValidUuid(id)) {
            return next(new ApiError('ID inválido.', 404));
        }

        const parciallyData = casosSchema.partial().parse(req.body);
        const updated = repository.partiallyUpdate(id, parciallyData);

        if (!updated) {
            return next(new ApiError('Caso não encontrado.', 404));
        }

        res.status(200).json(updated);
    } 
    catch (error) {
        next(new ApiError(error.message, 400));
    }
};

const deleteCaso = (req, res, next) => {
    try {
        const { id } = req.params;

        if (!isValidUuid(id)) {
            return next(new ApiError('ID inválido.', 404));
        }

        const deleted = repository.remove(id);

        if (!deleted) {
            return next(new ApiError('Caso não encontrado.', 404));
        }

        res.status(204).send();
    } 
    catch (error) {
        next(new ApiError(error.message, 400));
    }
};

module.exports = {
    getCasos,
    getCasoById,
    createCaso,
    updateCompletelyCaso,
    partiallyUpdateCaso,
    deleteCaso
}