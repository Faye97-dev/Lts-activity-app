import { Role, User } from "db/schema"
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            token: User & { role: Role }
        } & DefaultSession["user"]
    }
}