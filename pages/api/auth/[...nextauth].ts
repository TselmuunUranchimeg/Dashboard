import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!
        })
    ],
    secret: process.env.NEXTAUTH_SECRET!,
    pages: {
        signIn: "/auth"
    },
    adapter: MongoDBAdapter(clientPromise),
    jwt: {
        maxAge: 14 * 24 * 60 * 60
    }
};

export default NextAuth(authOptions);