import Head from "next/head";
import { useSession } from "next-auth/react";
import { Page } from "../types/page.types";
import Sidebar from "../components/sidebar/sidebar";
import WeatherTab from "../components/WeatherTab/WeatherTab";

const Homepage: Page = () => {
    const { data: session } = useSession();

    return (
        <div className = "w-full h-full flex flex-col box-border p-10">
            <Head>
                <title>Homepage - {session?.user?.name}</title>
            </Head>
            <div className = "w-full flex md:h-[52%] h-[96%] md:flex-row flex-col">
                <div className = "lg:w-[60%] bg-[#404BE9] mr-10 md:h-auto h-[48%] md:mb-0 w-full mb-10 flex items-center justify-center">
                    <h1>Coming soon</h1>
                </div>
                <div className = "lg:w-[40%] bg-[#472692] md:h-full h-[48%] w-full flex items-center justify-center">
                    <h1>Coming soon</h1>
                </div>
            </div>
            <div className = "w-full lg:h-[48%] mt-8">
                <WeatherTab />
            </div>
        </div>
    )
};

Homepage.getLayout = page => {
    return (
        <Sidebar>
            { page }
        </Sidebar>
    )
}

export default Homepage;