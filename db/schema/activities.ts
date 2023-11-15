import { relations } from "drizzle-orm"
import {
    date,
    numeric,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core"
import { departments } from "./users"
import { users } from "./next-auth"

export const activities = pgTable("activities", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    departmentId: uuid("department_id").notNull(),
    manager: varchar("manager", { length: 256 }),
    totalCreated: numeric("total_created"),
    totalTarget: numeric("total_target"),
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at"),
})
export const activitiesRelations = relations(activities, ({ one, many }) => ({
    department: one(departments, {
        fields: [activities.departmentId],
        references: [departments.id],
    }),
    timeline: many(timeline),
}))
export const departmentRelations = relations(departments, ({ many }) => ({
    activities: many(activities),
    users: many(users),
}))

export const timeline = pgTable("timeline", {
    id: uuid("id").defaultRandom().primaryKey(),
    activityId: uuid("activity_id").notNull(),
    totalCreated: numeric("total_created").notNull(),
    totalTarget: numeric("total_target").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at"),
})
export const timelineRelations = relations(timeline, ({ one }) => ({
    activity: one(activities, {
        fields: [timeline.activityId],
        references: [activities.id],
    })
}))


export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;

export type Timeline = typeof timeline.$inferSelect;
export type NewTimeline = typeof timeline.$inferInsert;
