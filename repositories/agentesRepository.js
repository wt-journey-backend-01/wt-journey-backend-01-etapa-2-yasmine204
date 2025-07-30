const { v4: uuidv4 } = require('uuid');

const agentes = [
    {
        id: "123e4567-e89b-12d3-a456-426614174000",
        nome: "Rommel Carneiro",
        dataDeIncorporacao: "1992-10-04",
        cargo: "delegado"
    },
    {
        id: "987f6543-a21b-34c5-b678-987654321000",
        nome: "Ana Beatriz Souza",
        dataDeIncorporacao: "2005-03-15",
        cargo: "inspetor"
    }
];

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