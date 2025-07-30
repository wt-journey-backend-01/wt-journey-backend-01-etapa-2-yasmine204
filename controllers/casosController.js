const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');
const { casosSchema } = require('../utils/casosValidation');
const isValidUuid = require('../utils/uuidValidation');
const ApiError = require('../utils/ApiError');

const getCasos = (req, res, next) => {
    try {
        const casos = casosRepository.findAll();
        
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
            return next(new ApiError('ID inválido.', 400));
        }

        const caso = casosRepository.findById(id);

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
        const { titulo, descricao, status, agente_id } = req.body;

        if(!isValidUuid(agente_id)) {
            return next(new ApiError('ID de agente inválido.', 400));
        }

        const agenteExists = agentesRepository.findById(agente_id);
        if(!agenteExists) {
            return next(new ApiError('Agente não encontrado para associar ao caso.', 404))
        }

        const dataReceived = {
            titulo,
            descricao,
            status: status.toLowerCase(), 
            agente_id
        };

        const data = casosSchema.parse(dataReceived);
        const newCaso = casosRepository.create(data);

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
        return next(new ApiError('ID inválido.', 400));
        }

        const data = casosSchema.parse(req.body);
        const updated = casosRepository.updateCompletely(id, data);

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
            return next(new ApiError('ID inválido.', 400));
        }

        const parciallyData = casosSchema.partial().parse(req.body);
        const updated = casosRepository.partiallyUpdate(id, parciallyData);

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
            return next(new ApiError('ID inválido.', 400));
        }

        const deleted = casosRepository.remove(id);

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