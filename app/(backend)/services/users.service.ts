import { db } from "db";
import { hash } from "bcrypt";
import { users } from "db/schema";
import { uuid } from 'uuidv4';

// todo add types 
export async function registerNewUser(data: any) {
    const hashedPassword = await hash(data.password, 10) // todo fix salt
    let payload: any = {
        id: uuid(), // todo fixme
        email: data.email,
        roleId: data.roleId,
        lastName: data.lastName,
        password: hashedPassword,
        firstName: data.firstName,
        // ** optional fields
        phone: data?.phone,
        whatsappPhone: data?.whatsappPhone,
    }
    // todo check if mail already exists
    if (data?.departmentId)
        payload.departmentId = data?.departmentId

    const user = await db.insert(users).values(payload).returning();
    const { password, ...result } = user?.[0]
    return result
}
