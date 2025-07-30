const { v4: uuidv4 } = require('uuid');

const casos = [
    {
        id: uuidv4(),
        titulo: "homicídio",
        descricao: "Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.",
        status: "aberto",
        agente_id: uuidv4()
    },
    {
        id: uuidv4(),
        titulo: "roubo",
        descricao: "Uma loja de eletrônicos foi assaltada no centro às 15:20 do dia 18/02/2023. Dois suspeitos armados fugiram em uma moto.",
        status: "solucionado",
        agente_id: uuidv4()
    },
    {
        id: uuidv4(),
        titulo: "tráfico de drogas",
        descricao: "Foram encontrados entorpecentes em uma residência no bairro Novo Horizonte durante uma operação no dia 02/06/2022.",
        status: "aberto",
        agente_id: uuidv4()
    }
];

const findAll = () => casos;

const findById = (id) => casos.find((caso) => caso.id === id);

const create = (data) => {
    const newCaso = {
        id: uuidv4(),
        ...data,
        agente_id: uuidv4()
    };
    
    casos.push(newCaso);
    return newCaso;
};

const updateCompletely = (id, data) => {
    const index = casos.findIndex((caso) => caso.id === id);
    
    if(index !== -1) {
        casos[index] = {
            id: id,
            ...data,
            agente_id: casos[index].agente_id 
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