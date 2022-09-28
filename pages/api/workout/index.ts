import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDb } from "../../../lib/mongodb";
import { z } from "zod";
import { Workout, RoutineBody } from "../../../types/general.types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).end("Unauthorized user!");
        return;
    }
    const email = session.user?.email as string;
    const workoutCollection = (await connectToDb()).collection<Workout>("workouts");
    switch (req.method) {
        case "GET":
            const workout = await workoutCollection.findOne({ email });
            if (!workout) {
                res.status(204).end("There is currently no workout routine to display");
                return;
            }
            res.status(200).json(workout?.routines?.map(val => {
                return {
                    id: val.id,
                    name: val.name,
                    exerciseCount: val.exercises.length
                };
            }));
            return;
        case "POST":
            try {
                const bodySchema = z.object({
                    name: z.string(),
                    exercises: z.array(z.object({
                        exerciseName: z.string(),
                        requirement: z.union([z.number(), z.object({
                            reps: z.number()
                        })])
                    }))
                });
                const body = req.body as RoutineBody;
                const validationResult = await bodySchema.safeParseAsync(body);
                if (validationResult.success) {
                    let userWorkouts = await workoutCollection.findOne({ email });
                    let routine = { id: randomUUID(), ...body };
                    if (!userWorkouts) {
                        await workoutCollection.insertOne({
                            email,
                            routines: [routine],
                            dates: []
                        });
                        res.status(200).end("Successfully created workout routine!");
                        return;
                    }
                    let routines = userWorkouts.routines;
                    routines.push(routine);
                    await workoutCollection.findOneAndUpdate({ email }, { $set: { routines } });
                    res.status(200).end("Successfully created workout routine!");
                    return;
                }
                res.status(406).end("Not all fields are provided!");
            }
            catch (e) {
                res.status(500).end("Something went wrong!");
                throw e;
            }
    }
}

export default handler;