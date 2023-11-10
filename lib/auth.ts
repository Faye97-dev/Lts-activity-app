import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hash } from 'bcrypt'
import { db } from 'db';

export const authConfig = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith@test.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const email = (credentials?.email || "") as string
                const password = (credentials?.password || "") as string
                const user = await db.query.users.findFirst({
                    where: (users, { eq }) => eq(users.email, email),
                    with: { role: true }
                });

                if (user) {
                    const passwordIsValid = await compare(password, user.password)
                    return passwordIsValid ? user : null
                }

                return null
            }
        })
    ],
    callbacks: {
        //   async session({session, user}) {
        //     session.user.id = user.id
        //     return session
        //   },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const adminPaths = ["/bo/department", "/bo/activity"]
            const managerPaths = ["/dashboard"]
            const userPaths = ["/activity"]
            let paths = ["/profile"]

            const isProtected = paths.some((path) => nextUrl.pathname.startsWith(path))
            // todo handle role autorization 

            if (isProtected && !isLoggedIn) {
                const redirectUrl = new URL("api/auth/signin", nextUrl.origin)
                // redirectUrl.searchParams.append("callbackUrl", nextUrl.href) // todo fixme
                return Response.redirect(redirectUrl)
            }

            return true
        },
    },
    pages: {
        // signIn: '/auth/signin',
        // signOut: '/auth/signout',
    }
} satisfies NextAuthConfig


export const {
    handlers: { GET, POST },
    auth, signOut
} = NextAuth(authConfig);