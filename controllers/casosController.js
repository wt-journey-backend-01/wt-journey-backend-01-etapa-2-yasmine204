const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');
const { casosSchema } = require('../utils/casosValidation');
const isValidUuid = require('../utils/uuidValidation');
const ApiError = require('../utils/ApiError');
const formatZodError = require('../utils/formatZodError');

const getCasos = (req, res, next) => {
    try {
        let casos = casosRepository.findAll();
        const { agente_id, status, q } = req.query;

        if(agente_id) {
            casos = casos.filter(caso => caso.agente_id === agente_id);
        }

        if(status) {
            casos = casos.filter(caso => caso.status.toLowerCase() === status.toLowerCase());
        }

        if (q && q.trim() !== '') {
            const term = q.toLowerCase();
            casos = casos.filter(caso =>
                caso.titulo.toLowerCase().includes(term) ||
                caso.descricao.toLowerCase().includes(term)
            );
        }

        res.status(200).json(casos);
    }
    catch(error) {
        next(new ApiError(error.message, 400));
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
        next(new ApiError(error.message, 400));
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
            status: status, 
            agente_id
        };

        const data = casosSchema.parse(dataReceived);
        const newCaso = casosRepository.create(data);

        res.status(201).json(newCaso);
    } 
    catch (error) {
        if(formatZodError(error, next)) return;

        next(new ApiError(error.message));
    }
};

const updateCompletelyCaso = (req, res, next) => {
    try {
        const { id } = req.params;

        if (!isValidUuid(id)) {
        return next(new ApiError('ID inválido.', 400));
        }

        const data = casosSchema.parse(req.body);

        if(!isValidUuid(data.agente_id)) {
            return next(new ApiError('ID de agente inválido.', 400));
        }

        const agenteExists = agentesRepository.findById(data.agente_id);
        if(!agenteExists) {
            return next(new ApiError('Agente não encontrado.', 404));
        }

        const updated = casosRepository.updateCompletely(id, data);

        if (!updated) {
            return next(new ApiError('Caso não encontrado.', 404));
        }

        res.status(200).json(updated);
    } 
    catch (error) {
        if(formatZodError(error, next)) return;

        next(new ApiError(error.message));
    }
};

const partiallyUpdateCaso = (req, res, next) => {
    try {
        const { id } = req.params;

        if(!isValidUuid(id)) {
            return next(new ApiError('ID inválido.', 400));
        }

        const partiallyData = casosSchema.partial().parse(req.body);

        if('agente_id' in partiallyData) {
            if(!isValidUuid(partiallyData.agente_id)) {
                return next(new ApiError('ID de agente inválido', 400));
            }

            const agenteExists = agentesRepository.findById(partiallyData.agente_id);
            if(!agenteExists) {
                return next(new ApiError('Agente não encontrado para associar ao caso.', 404))
            }
        }

        const updated = casosRepository.partiallyUpdate(id, partiallyData);

        if (!updated) {
            return next(new ApiError('Caso não encontrado.', 404));
        }

        res.status(200).json(updated);
    } 
    catch (error) {
        if(formatZodError(error, next)) return;

        next(new ApiError(error.message));
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

const getAgenteByCasoId = (req, res, next) => {
    try {
        const { id } = req.params;

        if(!isValidUuid(id)) {
            return next(new ApiError('ID de caso inválido.', 400));
        }

        const caso = casosRepository.findById(id);
        if(!caso) {
            return next(new ApiError('Caso não encontrado.', 404));
        }

        const agente = agentesRepository.findById(caso.agente_id);
        if(!agente) {
            return next(new ApiError('Agente não encontrado.', 404));
        }

        res.status(200).json(agente);
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
    deleteCaso,
    getAgenteByCasoId
}