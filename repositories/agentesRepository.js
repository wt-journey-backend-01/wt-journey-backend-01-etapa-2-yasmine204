const { v4: uuidv4 } = require('uuid');

const agentes = [ ];

const findAll = () => agentes;

const findById = (id) => agentes.find((agente) => agente.id === id);

const create = (data) => {
    const newAgente = {
            id: uuidv4(),
            ...data,
        };
        
        agentes.push(newAgente);
        return newAgente;
};

const updateCompletely = (id, data) => {
    const index = agentes.findIndex((agente) => agente.id === id);
    
    if(index !== -1) {
        agentes[index] = {
            id: id,
            ...data 
    };

        return agentes[index];
    }

    return null;
};

const partiallyUpdate = (id, data) => {
    const index = agentes.findIndex((agente) => agente.id === id);
    
    if(index !== -1) {
        agentes[index] = { ...agentes[index], ...data };

        return agentes[index];
    }

    return null;
};

const remove = (id) => {
    const index = agentes.findIndex((agente) => agente.id === id);

    if(index !== -1) {
        agentes.splice(index, 1);

        return true;
    }

    return false;
};

module.exports = {
    findAll,
    findById,
    create,
    updateCompletely,
    partiallyUpdate,
    remove
};