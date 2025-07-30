const { z } = require('zod');

const agentesSchema = z.object({
    nome: z.string({ required_error: 'Nome é obrigatório' }),
    dataDeIncorporacao: z
    .string({ required_error: 'Data de incorporação é obrigatória.' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato deve ser YYYY-MM-DD.'),
    cargo: z.enum(['inspetor', 'delegado', 'escrivão', 'agente'], { 
        required_error: 'Cargo é obrigatório',
        invalid_type_error: 'Cargo deve ser "inspetor", "delegado", "escrivão" ou "agente"'
    })
});

module.exports = { agentesSchema };