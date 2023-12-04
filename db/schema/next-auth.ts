import { boolean, integer, pgTable, primaryKey, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

export const users = pgTable("user", {
  name: text("name"),
  image: text("image"),
  id: text("id").notNull().primaryKey(), // todo fixme change to auto increment
  emailVerified: timestamp("emailVerified", { mode: "date" }),

  firstName: varchar("first_name", { length: 256 }).notNull(),
  lastName: varchar("last_name", { length: 256 }).notNull(),
  password: varchar("password", { length: 256 }).notNull(),
  whatsappPhone: varchar("whatsapp_phone", { length: 256 }),
  email: varchar("email", { length: 256 }).notNull().unique(),
  isActive: boolean("is_active").default(true),
  phone: varchar("phone", { length: 256 }),
  departmentId: uuid("department_id"),
  roleId: uuid("role_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
})

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  }),
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
)
