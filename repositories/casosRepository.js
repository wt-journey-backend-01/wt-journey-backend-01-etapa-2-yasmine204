const { v4: uuidv4 } = require('uuid');

const casos = [ ];

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