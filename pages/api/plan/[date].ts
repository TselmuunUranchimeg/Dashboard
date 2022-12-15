import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDb } from "../../../lib/mongodb";
import { PlanType } from "../../../types/general.types";

type PatchReqType = {
    value: string;
    originallyCompleted: boolean;
};

const planDateHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const session = await unstable_getServerSession(req, res, authOptions);
        if (!session) {
            res.status(401).end("Not authorized!");
            return;
        }
        const email = session.user!.email as string;
        const collection = (await connectToDb()).collection<PlanType>("plan");
        const { date } = req.query;
        const result = await collection.findOne({ email, date });
        if (!result) {
            res.status(404).end("Not found!");
            return;
        }
        const { task } = result;
        switch (req.method) {
            case "GET":
                res.status(200).json(task);
                return;
            case "PATCH":
                const { value, originallyCompleted } = req.body as PatchReqType;
                const remove =
                    task[originallyCompleted ? "completed" : "notFinished"];
                task[originallyCompleted ? "completed" : "notFinished"] =
                    remove.filter((val) => val !== value);
                task[originallyCompleted ? "notFinished" : "completed"].push(value);
                await collection.updateOne({ email, date }, { $set: { task } });
                res.status(200).end("Success");
                return;
            default:
                res.status(405).end("Method not allowed!");
        }
    } catch (e) {
        console.log(e);
        res.status(500).end(
            "Something went wrong with the server, please try again later"
        );
    }
};

export default planDateHandler;
