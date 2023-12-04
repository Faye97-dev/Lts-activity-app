import { hash } from "bcrypt"
import { db } from "db"
import { users } from "db/schema"
import { uuid } from "uuidv4"

import { AddUserType } from "@/validators/departments.schema"

type registerUserType = AddUserType & { departmentId?: string }

export async function registerNewUser(data: registerUserType) {
  const hashedPassword = await hash(data.password, 10) // todo improve

  let payload: registerUserType & { id: string } = {
    id: uuid(), // todo improve
    email: data.email,
    roleId: data.roleId,
    lastName: data.lastName,
    password: hashedPassword,
    firstName: data.firstName,
    // ** optional fields
    phone: data?.phone,
    whatsappPhone: data?.whatsappPhone,
  }

  // todo check if email already exists

  if (data?.departmentId) payload.departmentId = data?.departmentId

  const user = await db.insert(users).values(payload).returning()
  const { password, ...result } = user?.[0]
  return result
}
