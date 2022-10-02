import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Page, ResponseExercise } from "../../types/page.types";
import Sidebar from "../../components/sidebar/sidebar";

const WorkoutPage: Page = () => {
    const [state, setState] = useState<Array<ResponseExercise> | null>(null);
    const [hover, setHover] = useState<Array<boolean>>([]);
    const { data: session } = useSession();
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);

    const hoverFunction = (ind: number, newVal: boolean) => {
        setHover((prev) => {
            let newArr = [...prev];
            newArr[ind] = newVal;
            return newArr;
        });
    };

    useEffect(() => {
        axios.get("/api/workout").then((res) => {
            setLoading(false);
            if (res.status === 200) {
                const body = res.data as Array<ResponseExercise>;
                setState(body);
                setHover((_) => {
                    let newArr: boolean[] = [];
                    body.forEach((_) => {
                        newArr.push(false);
                    });
                    return newArr;
                });
                return;
            }
        });
    }, []);

    useEffect(() => {
        setTitle((_) => {
            let newTitle = "Workout routines";
            if (window.innerWidth > 1024) {
                newTitle = `${session!.user?.name?.toLocaleUpperCase()} workout routines`;
            }
            return newTitle;
        });
    }, [window.innerWidth]);

    return (
        <div className="w-full h-full box-border p-10 relative">
            <Head>
                <title>{`Workout - ${session?.user?.name}`}</title>
            </Head>
            <div className="flex justify-between items-center">
                <h1 className="font-bold sm:text-xl text-lg">{title}</h1>
                <Link href="/workout/create">
                    <a className="bg-[#131862] px-2 py-2 rounded-md font-semibold hover:bg-[#404BE9] duration-200 sm:text-base text-sm sm:px-5">
                        Create new routine
                    </a>
                </Link>
            </div>
            <div
                className={`h-[90%] items-center justify-center ${
                    loading ? "flex" : "hidden"
                } w-full absolute right-0 bottom-0`}
            >
                <CircularProgress />
            </div>
            <div className="grid grid-cols-custom overflow-y-auto h-[90%] gap-x-8 mt-5">
                {!state && !loading ? (
                    <div className="h-[90%] items-center justify-center flex w-full absolute right-0 bottom-0">
                        <h1 className = "opacity-40">There is no routine to display</h1>
                    </div>
                ) : (
                    state?.map((val, ind) => {
                        return (
                            <Link href={`/workout/routine/${val.id}`} key={ind}>
                                <a
                                    onMouseEnter={() =>
                                        hoverFunction(ind, true)
                                    }
                                    onMouseLeave={() =>
                                        hoverFunction(ind, false)
                                    }
                                    className={`h-0 pb-[75%] text-black bg-[url('../public/bodybuilder.jpg')] bg-cover relative ${
                                        hover[ind]
                                            ? "opacity-100"
                                            : "opacity-75"
                                    } 
                                    ${ind === state.length - 1 ? "" : "mb-5"}`}
                                >
                                    <div
                                        className={`absolute bottom-0 w-full text-white pt-3 px-4 duration-150 ${
                                            !hover[ind]
                                                ? "bg-[#131862] pb-3"
                                                : "bg-[#404BE9] pb-5"
                                        }`}
                                    >
                                        <h1>{val.name}</h1>
                                        <p>{val.exerciseCount}</p>
                                    </div>
                                </a>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
};

WorkoutPage.getLayout = (page) => {
    return <Sidebar>{page}</Sidebar>;
};

export default WorkoutPage;
