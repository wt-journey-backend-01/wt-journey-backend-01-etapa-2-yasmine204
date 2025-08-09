function normalizeText (q) {
    const term = q
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    
    return term;
}

module.exports = normalizeText;