import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { Workout } from "../../../../types/general.types";
import { authOptions } from "../../auth/[...nextauth]";
import { connectToDb } from "../../../../lib/mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).end("Unauthorized");
        return;
    }
    const email = session.user?.email as string;
    const workoutCollection = (await connectToDb()).collection<Workout>(
        "workouts"
    );
    const { routineId } = req.query;
    const document = await workoutCollection.findOne({ email });
    if (document) {
        const routine = document.routines.find(
            (item) => item.id === routineId
        );
        if (routine) {
            switch (req.method) {
                case "GET":
                    res.status(200).json(routine);
                    return;
                case "PATCH":
                    let dates = document.dates;
                    let todayDate = new Date();
                    let today = dates.find(
                        (item) =>
                            item.year === todayDate.getUTCFullYear() &&
                            item.month === todayDate.getUTCMonth() &&
                            item.day === todayDate.getUTCDate()
                    );
                    if (!today) {
                        dates.push({
                            routineNames: [routine.name],
                            year: todayDate.getUTCFullYear(),
                            month: todayDate.getUTCMonth(),
                            day: todayDate.getUTCDate(),
                        });
                    } else {
                        today.routineNames.push(routine.name);
                    }
                    await workoutCollection.findOneAndUpdate(
                        { email },
                        { $set: { dates } }
                    );
                    res.status(200).end("Successfully saved today's progress!");
                    return;
                default:
                    res.status(400).end("Method not supported!");
                    return;
            }
        }
    }
    res.status(404).end("Workout routine is not found");
};

export default handler;
