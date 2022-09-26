import Head from "next/head";
import { signIn } from "next-auth/react";
import { Page } from "../types/page.types";

const AuthForm: Page = () => {
    return (
        <div>
            <Head>
                <title>Authentication</title>
            </Head>
            <button onClick = {() => signIn("google", {
                callbackUrl: "/homepage"
            })}>
                Sign in with Google
            </button>
        </div>
    )
}

AuthForm.getLayout = (page) => page;

export default AuthForm;