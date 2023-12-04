import { ROLE_DEFAULT, ROLE_SUPER_ADMIN } from "config/global.config"
import { db } from "db"
import { activities, timeline } from "db/schema"
import { eq } from "drizzle-orm"

import { AddActivityType, UpdateActivityType } from "@/validators/activities.schema"

export const addActivity = async ({ userRole, data }: { userRole: string; data: AddActivityType }) => {
  if (userRole === ROLE_SUPER_ADMIN) {
    const activity = await db
      .insert(activities)
      .values({
        name: data.name,
        endDate: data.endDate,
        startDate: data.startDate,
        manager: data.manager || null,
        totalTarget: data.totalTarget,
        departmentId: data.departmentId,
      })
      .returning()
    return activity?.[0]
  }
  return false
}

export const updateActivity = async ({
  userRole,
  data,
  params,
}: {
  userRole: string
  data: UpdateActivityType
  params: { id: string }
}) => {
  if (userRole === ROLE_SUPER_ADMIN) {
    const updatedActivity = await db
      .update(activities)
      .set({
        name: data.name,
        endDate: data.endDate,
        startDate: data.startDate,
        manager: data.manager || null,
        totalTarget: data.totalTarget,
      })
      .where(eq(activities.id, params.id))
      .returning()
    return updatedActivity?.[0]
  } else if (userRole === ROLE_DEFAULT) {
    const updatedActivity = await db
      .update(activities)
      .set({ comment: data.comment, totalCreated: data.totalCreated })
      .where(eq(activities.id, params.id))
      .returning()

    const timelines = await db.query.timeline.findMany({
      limit: 1,
      orderBy: (timeline, { desc }) => [desc(timeline.createdAt)],
      where: (timeline, { eq }) => eq(timeline.activityId, params.id),
    })
    const cumulativeTotalCreated = timelines?.length
      ? parseInt(timelines[0].cumulativeTotalCreated) + parseInt(data?.totalCreated || "0")
      : parseInt(data?.totalCreated || "0")

    await db.insert(timeline).values({
      activityId: params.id,
      comment: data?.comment || "",
      totalCreated: data?.totalCreated || "",
      cumulativeTotalCreated: cumulativeTotalCreated.toString(),
    })
    return updatedActivity?.[0]
  }
  return false
}
