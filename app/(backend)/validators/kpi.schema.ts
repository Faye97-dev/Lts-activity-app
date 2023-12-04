import * as z from 'zod'

export const kpisSchema = z.object({
    activity_id: z.string().optional(),
    department_id: z.string().optional(),
});
export type KpisSchemaType = z.infer<typeof kpisSchema>;