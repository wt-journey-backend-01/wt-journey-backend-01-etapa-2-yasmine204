const { z } = require('zod');

const casosSchema = z.object({
    titulo: z.string({ required_error: 'Título é obrigatório.' }),
    descricao: z.string({ required_error: 'Descrição é obrigatória.' }),
    status: z.enum(['aberto', 'solucionado'], {
        required_error: 'Status é obrigatório.',
        invalid_type_error: 'Status deve ser "aberto" ou "solucionado".'
    }),
});

module.exports = { casosSchema };