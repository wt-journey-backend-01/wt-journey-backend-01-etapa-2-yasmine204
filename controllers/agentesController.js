const repository = require('../repositories/agentesRepository');
const { agentesSchema } = require('../utils/agentesValidation');
const isValidUuid = require('../utils/uuidValidation');
const ApiError = require('../utils/ApiError');
const formatZodError = require('../utils/formatZodError');

const getAgentes = (req, res, next) => {
    try {
        let agentes = repository.findAll();
        const { cargo, sort } = req.query;

        if(cargo) {
            agentes = agentes.filter(agente => 
                agente.cargo.toLowerCase() === cargo.toLowerCase());
        }

        if(sort) {
            const sortClean = sort.replace(/\s+/g, '');
            const decreasing = sortClean.startsWith('-');
            const field = decreasing ? sortClean.slice(1) : sortClean;

            if(field === 'dataDeIncorporacao') {
                agentes = [...agentes].sort((a, b) => {
                    const dateA = new Date(a.dataDeIncorporacao).getTime();
                    const dateB = new Date(b.dataDeIncorporacao).getTime();

                    return decreasing ? dateB - dateA : dateA - dateB;
                });
            }
        }

        res.status(200).json(agentes);
    } 
    catch (error) {
        return next(new ApiError(error.message, 400));
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
        return next(new ApiError(error.message, 400));
    }
};

const createAgente = (req, res, next) => {
    try {
        const {nome, dataDeIncorporacao, cargo} = req.body;  

        const dataReceived = {
            nome: nome,
            dataDeIncorporacao: dataDeIncorporacao,
            cargo: cargo
        };

        const data = agentesSchema.parse(dataReceived);
        const newAgente = repository.create(data);

        res.status(201).json(newAgente);

    } 
    catch (error) {
        if(formatZodError(error, next)) return;

        return next(new ApiError(error.message));
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
    } 
    catch (error) {
        if(formatZodError(error, next)) return;

        return next(new ApiError(error.message));
    }
};

const partiallyUpdateAgente = (req, res, next) => {
    try {
        const { id } = req.params;

        if(!isValidUuid(id)) {
            return next(new ApiError('ID inválido.', 400));
        }

        const partiallyData = agentesSchema.partial().parse(req.body);
        const updated = repository.partiallyUpdate(id, partiallyData);

        if (!updated) {
            return next(new ApiError('Agente não encontrado.', 404));
        }

        res.status(200).json(updated);
    } 
    catch (error) {
        if(formatZodError(error, next)) return;

        return next(new ApiError(error.message));
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
            return next(new ApiError(error.message, 400));
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