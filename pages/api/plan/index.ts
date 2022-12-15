import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDb } from "../../../lib/mongodb";
import { PlanType } from "../../../types/general.types";

interface ReqType {
    value: string;
    date: string;
}
interface ReqPatchType extends ReqType {
    completed: boolean;
    originalValue: string;
}

const planCreateHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const session = await unstable_getServerSession(req, res, authOptions);
        if (!session) {
            res.status(401).end("Unauthorized access!");
            return;
        }
        const email = session.user?.email as string;
        const collection = (await connectToDb()).collection<PlanType>("plan");
        switch (req.method) {
            case "GET":
                const data = await collection.find({ email }).toArray();
                res.status(200).json(
                    data.map((val) => {
                        return val.date;
                    })
                );
                return;
            case "POST":
                const body = req.body as ReqType;
                const result = await collection.findOne({
                    email,
                    date: body.date,
                });
                if (!result) {
                    const expireAt = new Date(new Date(body.date).valueOf() + 604800000);
                    collection.createIndex(
                        { "expireAt": 1 },
                        { expireAfterSeconds: 0 }
                    );
                    await collection.insertOne({
                        email, expireAt,
                        date: body.date,
                        task: {
                            completed: [],
                            notFinished: [body.value],
                        }
                    });
                } else {
                    const { task } = result;
                    task.notFinished.push(body.value);
                    await collection.findOneAndUpdate(
                        {
                            email,
                            date: body.date,
                        },
                        { $set: { task } }
                    );
                }
                res.status(200).end("Successfully saved task");
                return;
            case "PATCH":
                const patchBody = req.body as ReqPatchType;
                const searchResult = await collection.findOne({
                    email,
                    date: patchBody.date,
                });
                if (!searchResult) {
                    res.status(404).end("Not found!");
                    return;
                }
                const { task } = searchResult;
                const i = task[
                    patchBody.completed ? "completed" : "notFinished"
                ].findIndex((item) => item === patchBody.originalValue);
                task[patchBody.completed ? "completed" : "notFinished"][i] =
                    patchBody.value;
                await collection.updateOne(
                    {
                        email,
                        date: patchBody.date,
                    },
                    { $set: { task } }
                );
                res.status(200).end("Success");
                return;
        }
    } catch (e) {
        console.log(e);
        res.status(500).end("Something went wrong, please try again later!");
    }
};

export default planCreateHandler;
