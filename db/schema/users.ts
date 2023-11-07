import { relations } from "drizzle-orm"
import {
    boolean,
    pgEnum,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core"

export const zoneTypeEnum = pgEnum("zone_type", [
    "wilaya",
    "moughataa",
    "commune",
])

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    firstName: varchar("first_name", { length: 256 }).notNull(),
    lastName: varchar("last_name", { length: 256 }).notNull(),
    password: varchar("password", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    isActive: boolean("is_active").default(true),
    roleId: uuid("role_id").notNull(),
    zoneType: zoneTypeEnum("zone_type"),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
})

export const useRelations = relations(users, ({ one }) => ({
    role: one(roles, {
        fields: [users.roleId],
        references: [roles.id],
    }),
}))

export const roles = pgTable("roles", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    slug: varchar("slug", { length: 256 }).notNull(),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
})