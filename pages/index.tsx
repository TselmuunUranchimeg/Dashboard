import { useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Page } from "../types/page.types";
import LoadingComponent from "../components/loading/Loading";
import ThreeImages from "../components/Images/ThreeImages";

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
            <div className="h-screen w-screen">
                <LoadingComponent />
            </div>
        );
    }
    return (
        <div>
            <Head>
                <title>Metis - Personalized dashboard</title>
            </Head>
            <div className="w-screen h-screen box-border px-14 pb-5 pt-7">
                {/* Header */}
                <div className="flex w-full justify-between items-center">
                    <Link href="/">
                        <a className="font-bold text-3xl">METIS</a>
                    </Link>
                    <Link href="/auth">
                        <a className="opacity-75 hover:opacity-100 duration-100 text-lg">
                            Login
                        </a>
                    </Link>
                </div>
                {/* Body */}
                <div className="w-full">
                    <div className="w-full mt-12 flex">
                        <div className="w-1/2">
                            <h1 className="text-3xl text-white font-bold mb-3">
                                Your very own personal dashboard
                            </h1>
                            <p className="text-lg opacity-75 font-thin mb-12">
                                Various aspects of your life in a single app
                            </p>
                            <a
                                href="https://github.com/TselmuunUranchimeg/Dashboard"
                                target="_blank"
                                rel = "noreferrer"
                                className="bg-black hover:bg-white hover:text-black duration-100 px-5 py-3 rounded-sm font-semibold"
                            >
                                Source code
                                <GitHubIcon className="ml-2 mb-1" />
                            </a>
                        </div>
                        <div className="w-1/2">
                            <ThreeImages
                                urls={[
                                    "bodybuilder.jpg",
                                    "bodybuilder.jpg",
                                    "bodybuilder.jpg",
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
