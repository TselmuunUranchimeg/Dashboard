import { MongoClient } from "mongodb";

declare global {
    var _mongoClientPromise: Promise<MongoClient>;
}

let client: MongoClient | null;
let clientPromise : Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
        client = new MongoClient(process.env.MONGO_URI!, {});
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(process.env.MONGO_URI!, {});
    clientPromise = client.connect();
}

export const connectToDb = async () => {
    if (!client) {
        client = new MongoClient(process.env.MONGO_URI!);
        clientPromise = client.connect();
    }
    return client.db("Dashboard");
};

export default clientPromise;