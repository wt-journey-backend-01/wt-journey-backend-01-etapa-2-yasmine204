const repository = require('../repositories/agentesRepository');
const { agentesSchema } = require('../utils/agentesValidation');
const isValidUuid = require('../utils/uuidValidation');
const ApiError = require('../utils/ApiError');

const getAgentes = (req, res, next) => {
    try {
        const agentes = repository.findAll();

        res.status(200).json(agentes);
    } 
    catch (error) {
        next(new ApiError('Erro ao listar agentes.'));
    }
};

const getAgentesById = (req, res, next) => {
    try {
        const { id } = req.params; 
        
        if(!isValidUuid(id)) {
            return next(new ApiError('ID inválido', 400));
        }

        const agente = repository.findById(id);

        if(!agente) {
            return next(new ApiError('Agente não encontrado.', 404));
        }

        res.status(200).json(agente);
    } 
    catch (error) {
        next(new ApiError('Erro ao listar agente.'));
    }
};

const createAgente = (req, res, next) => {
    try {
        const {nome, dataDeIncorporacao, cargo} = req.body;  

        const dataReceived = {
            nome: nome,
            dataDeIncorporacao: dataDeIncorporacao,
            cargo: cargo.toLowerCase()
        };

        const data = agentesSchema.parse(dataReceived);
        const newAgente = repository.create(data);

        res.status(201).json(newAgente);

    } 
    catch (error) {
        next(new ApiError(error.message, 400));
    }
};

const updateCompletelyAgente = (req, res, next) => {
    try {
        const { id } = req.params;

        if(!isValidUuid(id)) {
            return next(new ApiError('ID inválido.', 400));
        }

        const data = agentesSchema.parse(req.body);
        const updated = repository.updateCompletely(id, data);

        if(!updated) {
            return next(new ApiError('Agente não encontrado', 404));
        }

        res.status(200).json(updated);
    } catch (error) {
        next(new ApiError(error.message, 400));
    }
};

const partiallyUpdateAgente = (req, res, next) => {
    try {
        const { id } = req.params;

        if(!isValidUuid(id)) {
            return next(new ApiError('ID inválido.', 400));
        }

        const parciallyData = agentesSchema.partial().parse(req.body);
        const updated = repository.partiallyUpdate(id, parciallyData);

        if (!updated) {
            return next(new ApiError('Agente não encontrado.', 404));
        }

        res.status(200).json(updated);
    } 
    catch (error) {
        next(new ApiError(error.message, 400));
    }
};

const deleteAgente = (req, res, next) => {
    try {
            const { id } = req.params;
    
            if (!isValidUuid(id)) {
                return next(new ApiError('ID inválido.', 400));
            }
    
            const deleted = repository.remove(id);
    
            if (!deleted) {
                return next(new ApiError('Agente não encontrado.', 404));
            }
    
            res.status(204).send();
        } 
        catch (error) {
            next(new ApiError(error.message, 400));
        }
};
 
module.exports = {
    getAgentes,
    getAgentesById,
    createAgente,
    updateCompletelyAgente,
    partiallyUpdateAgente,
    deleteAgente
};