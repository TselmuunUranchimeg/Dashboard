import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { Workout } from "../../../types/general.types";
import { connectToDb } from "../../../lib/mongodb";
import { authOptions } from "../auth/[...nextauth]";

const calendarHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        res.status(405).end("Method not allowed");
        return;
    }
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
        res.status(401).end("Unauthorized");
        return;
    }
    const { year, month } = req.query;
    const email = session.user?.email as string;
    const workoutCollection = (await connectToDb()).collection<Workout>(
        "workouts"
    );
    const document = await workoutCollection.findOne({ email });
    if (document) {
        const arr = document.dates
            .filter(
                (item) =>
                    item.year === parseInt(year as string) &&
                    item.month === parseInt(month as string)
            ).map(val => {
                const { year, month, ...rest } = val;
                return { ...rest };
            });
        res.status(200).json(arr);
    }
    res.status(404).end("There is currently no workout routines to display!");
};

export default calendarHandler;
