import * as z from 'zod';

export const addDepartmentSchema = z.object({
    departmentName: z.string().min(2),
    departmentSlug: z.string().min(2),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    roleId: z.string(),
    password: z.string(),
    phone: z.string().optional(),
    whatsappPhone: z.string().optional()
});
export type AddDepartmentType = z.infer<typeof addDepartmentSchema>;

export const addUserSchema = addDepartmentSchema.omit({ departmentName: true, departmentSlug: true });
export type AddUserType = z.infer<typeof addUserSchema>;

export const updateUserSchema = addUserSchema.omit({ roleId: true });
export type UpdateUserType = z.infer<typeof updateUserSchema>;

export const updateDepartmentSchema = z.object({
    departmentName: z.string().min(2),
    departmentSlug: z.string().min(2),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    whatsappPhone: z.string().optional(),
    userId: z.string()
});
export type UpdateDepartmentType = z.infer<typeof updateDepartmentSchema>;