import { useState, useEffect, ReactElement, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import HomeIcon from "@mui/icons-material/Home";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import styles from "../../styles/Sidebar.module.css";

interface SidebarInterface {
    children: ReactElement;
}
interface SidebarIconType {
    setState: Dispatch<SetStateAction<boolean>>;
    state: boolean;
};

const SidebarIcon = ({ setState, state }: SidebarIconType) => {
    return (
        <div 
            className = {`lg:!hidden absolute left-10 top-[10px] z-30 cursor-pointer`}
            onClick = {() => {
                setState(prev => !prev);
            }}
        >
            <MenuIcon className = {`${state ? "!hidden" : "!block"}`}/>
            <CloseIcon className = {`${state ? "!block" : "!hidden"}`}/>
        </div>
    )
}

const Sidebar = ({ children }: SidebarInterface) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [state, setState] = useState(false);

    useEffect(() => {
        if (status !== "loading") {
            if (status === "unauthenticated") {
                alert("Not authorized!");
                router.push("/");
                return;
            }
        }
    }, [status, router]);

    if (status === "authenticated") {
        return (
            <div className="flex h-screen">
                <div className={`2xl:w-[450px] lg:w-[300px] h-screen box-border pt-10 lg:relative ${
                    state ? "z-30 ml-0 w-[250px]" : "-ml-[250px] z-0 w-0"
                } block lg:ml-0 duration-150 absolute bg-[#181818]`}>
                    <div className="text-center">
                        <Image
                            src={session!.user!.image!}
                            alt={session!.user!.name!}
                            width={80}
                            height={80}
                            className="rounded-full"
                        />
                        <h1 className="font-semibold lg:text-lg text-md mt-2 mb-6">
                            {session.user?.name?.toUpperCase()}
                        </h1>
                    </div>
                    <div className="flex flex-col">
                        <Link href="/homepage">
                            <a
                                onClick = {() => {
                                    setState(false);
                                }}
                                className={`${styles.homepageLink} ${
                                    router.asPath.split("/")[1] === "homepage"
                                        ? "bg-[#1f1e1e]"
                                        : ""
                                }`}
                            >
                                <div>
                                    <HomeIcon fontSize="medium" />
                                    Homepage
                                </div>
                            </a>
                        </Link>
                        <Link href="/workout">
                            <a
                                onClick = {() => {
                                    setState(false);
                                }}
                                className={`${styles.homepageLink} ${
                                    router.asPath.split("/")[1] === "workout"
                                        ? "bg-[#1f1e1e]"
                                        : ""
                                }`}>
                                <div>
                                    <FitnessCenterIcon fontSize="medium" />
                                    Workout
                                </div>
                            </a>
                        </Link>
                        <Link href="/plan">
                            <a
                                onClick = {() => {
                                    setState(false);
                                }}
                                className={`${styles.homepageLink} ${
                                    router.asPath.split("/")[1] === "planning"
                                        ? "bg-[#1f1e1e]"
                                        : ""
                                }`}>
                                <div>
                                    <FormatListBulletedIcon fontSize="medium" />
                                    Planning
                                </div>
                            </a>
                        </Link>
                        <Link href="/music">
                            <a
                                onClick = {() => {
                                    setState(false);
                                }}
                                className={`${styles.homepageLink} ${
                                    router.asPath.split("/")[1] === "music"
                                        ? "bg-[#1f1e1e]"
                                        : ""
                                }`}>
                                <div>
                                    <MusicNoteIcon fontSize="medium" />
                                    Music
                                </div>
                            </a>
                        </Link>
                    </div>
                    <button
                        onClick={() =>
                            signOut({
                                callbackUrl: "/",
                            })
                        }
                        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-xl opacity-60 hover:opacity-100 duration-100"
                    >
                        {"<- Log out"}
                    </button>
                </div>
                <div className={`2xl:w-[calc(100%-450px)] h-screen relative lg:w-[calc(100%-300px)] w-screen`}>
                    <SidebarIcon 
                        setState = {setState}
                        state = {state}
                    />
                    <div 
                        id = "blackScreen" 
                        className = {`w-screen h-screen absolute ${
                            state ? "block" : "hidden"
                        } z-20 bg-black opacity-25`}
                        onClick = {() => {
                            setState(prev => !prev);
                        }}
                    ></div>
                    {children}
                </div>
            </div>
        );
    }
    return (
        <div>
            <h1>Loading...</h1>
        </div>
    );
};

export default Sidebar;
