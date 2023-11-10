import { db } from "db";
import { activities, timeline } from "db/schema";
import { eq } from "drizzle-orm";

/*
{
  "totalCreated":90,
  "totalTarget": 100,
  "comment" : "Hellooo"
} 
*/
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const data = await request.json()
        // todo add validation with zod 
        // todo add db transaction 
        const updatedActivity = await db.update(activities)
            .set({ totalCreated: data.totalCreated, totalTarget: data.totalTarget, comment: data.comment })
            .where(eq(activities.id, params.id))
            .returning();

        await db.insert(timeline).values({
            activityId: params.id, totalCreated: data.totalCreated,
            totalTarget: data.totalTarget, comment: data.comment
        })

        return Response.json(updatedActivity, { status: 200 })
    } catch (e) {
        console.log(e)
    }
    return Response.json({ message: "Bad request" }, { status: 400 })
}