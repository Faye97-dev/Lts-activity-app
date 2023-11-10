import { hash } from "bcrypt";
import { db } from "db";
import { users } from "db/schema";

// todo add types 
export async function registerNewUser(data: any) {
    const hashedPassword = await hash(data.password, 10) // todo fixe salt
    let payload: any = {
        email: data.email,
        lastName: data.lastName,
        password: hashedPassword,
        firstName: data.firstName,
        roleId: "2cccc336-1e82-40e7-95e4-1055362b9fcd", // todo fixme
        // whatsappPhone , departmentId , phone // todo fixme
    }
    if (data?.departmentId)
        payload.departmentId = data?.departmentId

    const user = await db.insert(users).values(payload).returning();
    const { password, ...result } = user?.[0]
    return result
}
