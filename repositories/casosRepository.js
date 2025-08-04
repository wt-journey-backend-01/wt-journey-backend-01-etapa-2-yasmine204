const { v4: uuidv4 } = require('uuid');

const casos = [
    {
        id: "321e4567-e89b-12d3-a456-426614174000",
        titulo: "homicídio",
        descricao: "Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.",
        status: "aberto",
        agente_id: "123e4567-e89b-12d3-a456-426614174000"
    },
    {
        id: "654e3210-b98a-76c5-d432-123456789abc",
        titulo: "roubo a banco",
        descricao: "Assalto registrado às 14:20 do dia 21/08/2020 em agência bancária do centro, com reféns e violência.",
        status: "aberto",
        agente_id: "987f6543-a21b-34c5-b678-987654321000"
    }
];

const findAll = () => casos;

const findById = (id) => casos.find((caso) => caso.id === id);

const create = (data) => {
    const newCaso = {
        id: uuidv4(),
        ...data,
    };
    
    casos.push(newCaso);
    return newCaso;
};

const updateCompletely = (id, data) => {
    const index = casos.findIndex((caso) => caso.id === id);
    
    if(index !== -1) {
        casos[index] = {
            id: id,
            ...data
    };

        return casos[index];
    }

    return null;
};

const partiallyUpdate = (id, data) => {
    const index = casos.findIndex((caso) => caso.id === id);
    
    if(index !== -1) {
        casos[index] = { ...casos[index], ...data };

        return casos[index];
    }

    return null;
};

const remove = (id) => {
    const index = casos.findIndex((caso) => caso.id === id);

    if(index !== -1) {
        casos.splice(index, 1);

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