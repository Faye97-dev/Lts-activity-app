import * as z from "zod"

export const addActivitySchema = z.object({
  name: z.string().min(2),
  startDate: z.string(),
  endDate: z.string(),
  totalTarget: z.string(),
  manager: z.string().optional(),
  departmentId: z.string(),
})
export type AddActivityType = z.infer<typeof addActivitySchema>

export const updateActivitySchema = z.object({
  name: z.string().min(2).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  totalTarget: z.string().optional(),
  manager: z.string().optional(),
  totalCreated: z.string().optional(),
  comment: z.string().optional(),
})
export type UpdateActivityType = z.infer<typeof updateActivitySchema>
