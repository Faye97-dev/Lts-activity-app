import { relations } from "drizzle-orm"
import {
    uuid,
    pgTable,
    varchar,
    timestamp,
} from "drizzle-orm/pg-core"
import { users } from "./next-auth"

// todo add seeders roles 
export const roles = pgTable("roles", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    slug: varchar("slug", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at"),
})

// todo clean 
// export const users = pgTable("users", {
//     id: uuid("id").defaultRandom().primaryKey(),
//     firstName: varchar("first_name", { length: 256 }).notNull(),
//     lastName: varchar("last_name", { length: 256 }).notNull(),
//     password: varchar("password", { length: 256 }).notNull(),
//     whatsappPhone: varchar("whatsapp_phone", { length: 256 }),
//     email: varchar("email", { length: 256 }).notNull().unique(),
//     isActive: boolean("is_active").default(true),
//     phone: varchar("phone", { length: 256 }),
//     departmentId: uuid("department_id"),
//     roleId: uuid("role_id").notNull(),
//     // zoneType: zoneTypeEnum("zone_type"),
//     createdAt: timestamp("created_at").defaultNow(),
//     updatedAt: timestamp("updated_at"),
// })

export const userRelations = relations(users, ({ one }) => ({
    role: one(roles, {
        fields: [users.roleId],
        references: [roles.id],
    }),
    department: one(departments, {
        fields: [users.departmentId],
        references: [departments.id],
    }),
}))

export const departments = pgTable("departments", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    slug: varchar("slug", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at"),
})


export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;

export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;

/* todo

- users : department_id , created_at
- roles : name , slug , created_at
- departments : name , slug , created_at
- activities : department_id , start_date , end_date , pilote , nbre cree , nbre cible , comment , created_at
- timeline : activity_id , nbre cree , nbre cible , comment , created_at

*/