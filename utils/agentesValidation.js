const { z } = require('zod');

const agentesSchema = z.object({
    nome: z.string({ required_error: 'Nome é obrigatório' }).min(1, 'Nome não pode estar vazio.'),
    dataDeIncorporacao: z
    .string({ required_error: 'Data de incorporação é obrigatória.' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato deve ser YYYY-MM-DD.')
    .refine((dateStr) => {
        const date = new Date(dateStr);
        
        if(Number.isNaN(date.getTime())) return false;

        const today = new Date;
        today.setHours(0, 0, 0, 0);

        return date <= today;
    }, {
        message: 'Data de incoporação não pode ser inválida ou estar no futuro.'
    }),
    cargo: z.enum(['inspetor', 'delegado', 'escrivão', 'agente'], { 
        required_error: 'Cargo é obrigatório',
        invalid_type_error: 'Cargo deve ser "inspetor", "delegado", "escrivão" ou "agente"'
    })
}).strict();

module.exports = { agentesSchema };