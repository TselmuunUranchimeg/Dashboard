import { useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Page } from "../types/page.types";
import LoadingComponent from "../components/loading/Loading";

const Home: Page = () => {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/homepage", "/homepage");
            return;
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className = "h-screen w-screen">
                <LoadingComponent />
            </div>
        )
    }
    return (
        <div>
            <Head>
                <title>Metis - Personalized dashboard</title>
            </Head>
            <h1 className="m-0">Hello world</h1>
            <Link href="/auth">Sign in</Link>
        </div>
    );
};

export default Home;
