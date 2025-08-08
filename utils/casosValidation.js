const { z } = require('zod');

const casosSchema = z.object({
    titulo: z.string({ required_error: 'Título é obrigatório.' }).min(1, 'Título não pode estar vazio.'),
    
    descricao: z.string({ required_error: 'Descrição é obrigatória.' }).min(1, 'Descrição não pode estar vazia'),
    
    status: z
    .string({ required_error: 'Status é obrigatório.' })
    .refine((val) => ['aberto', 'solucionado'].includes(val), {
        message: 'Status deve ser aberto ou solucionado.'
    }),

    agente_id: z
    .string({ required_error: 'O ID do agente é obrigatório.' })
});

module.exports = { casosSchema };                                                                                                                                                                                                                                                                         