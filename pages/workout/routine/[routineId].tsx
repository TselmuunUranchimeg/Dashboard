import { useState, useEffect, Dispatch, SetStateAction, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import Sidebar from "../../../components/sidebar/sidebar";
import { Page } from "../../../types/page.types";
import { Routine, Exercise } from "../../../types/general.types";
import styles from "../../../styles/Workout.module.css";
import LoadingComponent from "../../../components/loading/Loading";
import bodybuilderImage from "../../../public/bodybuilder.jpg";

type WorkoutType = {
    prev: null | Exercise;
    current: Exercise;
    next: null | Exercise;
    currentIndex: number;
};
type ExerciseType = {
    val: number | { reps: number };
};
type ExerciseTimerType = {
    workout: WorkoutType;
    started: boolean;
    breakTime: number;
};
type ExerciseRepsType = {
    val: { reps: number };
};

const ExercisePresentation = ({ val }: ExerciseType) => {
    return (
        <p className="pl-10">
            {typeof val === "object" ? `${val.reps} reps` : `${val} seconds`}
        </p>
    );
};

const RoutinePage: Page = () => {
    const router = useRouter();
    const { routineId } = router.query;
    const [state, setState] = useState<Routine>();
    const [started, setStart] = useState(false);
    const [breakTime, setBreak] = useState(-1);
    const breakRef = useRef<NodeJS.Timer | null>(null);
    const [workout, setWorkout] = useState<WorkoutType>({
        prev: null,
        current: {
            exerciseName: "About to start workout",
            requirement: 10,
        },
        next: null,
        currentIndex: -1,
    });

    const ExerciseTimer = ({
        workout,
        started,
        breakTime
    }: ExerciseTimerType) => {
        const val = workout.current!.requirement as number;
        const [duration, setDuration] = useState(val);
        const [percentage, setPercentage] = useState(100);
        const less = 100 / val;

        useEffect(() => {
            if (started && breakTime === -1) {
                let timeout = setTimeout(async () => {
                    await logic();
                }, (val + 1) * 1000);
                let interval = setInterval(() => {
                    setDuration((prev) => {
                        if (prev === 0) {
                            clearInterval(interval);
                            setPercentage(0);
                            return prev;
                        }
                        return prev - 1;
                    });
                    setPercentage((prev) => prev - less);
                }, 1000);

                return () => {
                    clearInterval(interval);
                    clearTimeout(timeout);
                };
            }
        }, []);

        return (
            <div className={styles.workoutModal}>
                <CircularProgress
                    variant="determinate"
                    value={percentage}
                    color="secondary"
                    className="absolute"
                    size="10rem"
                />
                <h1 className="font-bold text-lg">{duration} seconds</h1>
            </div>
        );
    };

    const ExerciseReps = ({ val }: ExerciseRepsType) => {
        return (
            <div className={styles.workoutModal}>
                <CircularProgress
                    variant="determinate"
                    value={100}
                    color="secondary"
                    className="absolute"
                    size="10rem"
                />
                <h1 className="font-bold text-lg">{`${val.reps} reps`}</h1>
            </div>
        );
    };

    const startWorkout = async () => {
        setStart(true);
    };

    const closeModal = () => {
        setStart(false);
        setWorkout({
            prev: null,
            current: {
                exerciseName: "About to start workout",
                requirement: 10,
            },
            next: state!.exercises[0],
            currentIndex: -1,
        });
        setBreak(-1);
    };

    const finishWorkout = async () => {
        let res = await axios.patch(`/api/workout/${routineId as string}`);
        if (res.status === 200) {
            alert(res.data);
            closeModal();
        }
    };

    const nextExercise = () => {
        setWorkout((prev) => {
            const newObj: WorkoutType = {
                prev: { ...prev.current },
                current: { ...prev.next! },
                currentIndex: prev.currentIndex + 1,
                next:
                    state!.exercises.length === prev.currentIndex + 2
                        ? null
                        : { ...state!.exercises[prev.currentIndex + 2] },
            };
            return newObj;
        });
    };

    const logic = async () => {
        if (workout.next) {
            if (workout.currentIndex !== -1) {
                setBreak(29);
            }
            nextExercise();
            return;
        }
        await finishWorkout();
    }

    useEffect(() => {
        axios.get(`/api/workout/${routineId as string}`).then((res) => {
            if (res.status < 300) {
                setState(res.data);
                setWorkout((prev) => {
                    return {
                        ...prev,
                        next: res.data.exercises[0],
                    };
                });
            }
        });
    }, [routineId]);

    useEffect(() => {
        if (breakTime > -1) {
            breakRef.current = setInterval(() => {
                setBreak((prev) => {
                    if (prev === 0) {
                        clearInterval(breakRef.current!);
                        return -1;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => {
                clearInterval(breakRef.current!);
            }
        }
    }, [breakTime]);

    if (!state) {
        return (
            <div className="h-full w-full">
                <Head>
                    <title>Loading...</title>
                </Head>
                <LoadingComponent />
            </div>
        );
    }
    return (
        <div className="h-full w-full px-10 relative">
            <Head>
                <title>{state.name} - Workout routine</title>
            </Head>

            {/* Modal dark background */}
            <div
                className={`absolute bg-black bg-opacity-80 h-full w-full left-0 z-40 ${
                    started ? "block w-full" : "hidden w-0"
                } flex justify-center`}
            >
                {/* Modal */}
                <div className="md:w-2/5 md:h-[400px] w-full h-full md:mt-20 m-0">
                    {/* Modal header */}
                    <div
                        className={`bg-[#472692] p-4 text-center relative font-bold flex justify-between items-center md:rounded-t-md drop-shadow-lg`}
                    >
                        <h1 className="w-[24px]"></h1>
                        <h1 className="text-xl">Workout</h1>
                        <CloseIcon
                            className="!text-2xl cursor-pointer"
                            onClick={() => closeModal()}
                        />
                    </div>

                    {/* Break modal body with 30 second timer */}
                    <div
                        className={`bg-[#472692] text-white text-center box-border pt-6 pb-10 ${
                            breakTime === -1 ? "hidden" : "flex"
                        } md:rounded-b-md md:h-auto h-[calc(100%-60px)] flex-col justify-between items-center`}
                    >
                        <div className="font-bold text-xl">
                            <h1>Break time</h1>
                            <p>
                                {
                                    !workout.next
                                    ? "Last exercise"
                                    : `Next exercise - ${workout.current!.exerciseName}`
                                }
                            </p>
                        </div>
                        <div className="flex flex-col justify-center items-center relative py-7">
                            <div className="relative flex items-center justify-center mb-7">
                                <CircularProgress
                                    value={((breakTime + 1) * 100) / 30}
                                    variant="determinate"
                                    color="secondary"
                                    size="10rem"
                                />
                                <p className="absolute font-bold">
                                    {breakTime + 1} seconds
                                </p>
                            </div>
                        </div>
                        <div className="flex box-border items-center w-full">
                            <button
                                onClick={() => {
                                    if (!breakRef.current) {
                                        breakRef.current = setInterval(() => {
                                            setBreak((prev) => {
                                                if (prev === 0) {
                                                    clearInterval(
                                                        breakRef.current!
                                                    );
                                                }
                                                return prev - 1;
                                            });
                                        }, 1000);
                                    }
                                }}
                                className={styles.workoutModalBreakButton}
                            >
                                Continue
                            </button>
                            <button
                                onClick={() => {
                                    if (breakRef.current) {
                                        clearInterval(breakRef.current);
                                        breakRef.current = null;
                                    }
                                }}
                                className={styles.workoutModalBreakButton}
                            >
                                Pause
                            </button>
                            <button
                                onClick={() => {
                                    clearInterval(breakRef.current!);
                                    breakRef.current = null;
                                    setBreak(-1);
                                }}
                                className={styles.workoutModalBreakButton}
                            >
                                Skip
                            </button>
                        </div>
                    </div>

                    {/* Modal body with workout exercises including reps and timers */}
                    <div
                        className={`bg-white text-[#472692] text-center py-5 md:rounded-b-md ${
                            breakTime === -1 ? "flex" : "hidden"
                        } md:h-auto h-[calc(100%-60px)] flex-col justify-between`}
                    >
                        <h1 className="font-bold text-xl">
                            {`${
                                workout.currentIndex === -1
                                    ? ""
                                    : `${workout.currentIndex + 1}.`
                            } ${workout.current.exerciseName}`}
                        </h1>
                        {typeof workout.current.requirement === "object" ? (
                            <ExerciseReps val={workout.current.requirement} />
                        ) : (
                            <ExerciseTimer
                                started={started}
                                workout={workout}
                                breakTime={breakTime}
                            />
                        )}
                        <div className="flex w-full mt-4 justify-center">
                            <SkipPreviousIcon
                                className="cursor-pointer mr-3    "
                                fontSize="large"
                                onClick={() => {
                                    if (!workout.prev) {
                                        alert(
                                            "There is no exercise before this one!"
                                        );
                                        return;
                                    }
                                    setWorkout((prev) => {
                                        prev.next = { ...prev.current };
                                        prev.current = { ...prev.prev! };
                                        prev.currentIndex -= 1;
                                        prev.prev =
                                            state!.exercises[
                                                prev.currentIndex - 1
                                            ];
                                        return { ...prev };
                                    });
                                }}
                            />
                            <SkipNextIcon
                                className="cursor-pointer ml-3"
                                fontSize="large"
                                onClick={async () => {
                                    await logic();
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Information regarding routine with {routineId} under the user */}
            <div className="box-border pb-10 lg:pt-10 pt-16 lg:h-[calc(50%-1px)] relative flex">
                <div className="w-[25%] items-center justify-center lg:flex hidden">
                    <div className="w-[90%] h-[90%] relative">
                        <Image
                            src={bodybuilderImage}
                            alt="Photo by Pikx By Panther: https://www.pexels.com/photo/photo-of-man-with-muscular-body-1547248/"
                            layout="fill"
                            className="object-cover"
                            placeholder="blur"
                        />
                    </div>
                </div>
                <div className="box-border lg:px-10 pr-0 relative flex lg:flex-col justify-between lg:w-auto w-full items-center">
                    <div className="lg:flex hidden w-full justify-start">
                        <h1 className="font-semibold text-sm">ROUTINE</h1>
                    </div>
                    <h1 className="sm:text-5xl mobileL:text-2xl text-lg">
                        {state.name}
                    </h1>
                    <button
                        onClick={async () => await startWorkout()}
                        className="bg-[#404BE9] sm:px-5 px-2 py-2 flex items-center duration-150 hover:-translate-y-1"
                    >
                        <PlayCircleIcon className="mr-2" fontSize="medium" />
                        Start workout
                    </button>
                </div>
            </div>
            <hr></hr>
            <div className="lg:h-[45%] h-[calc(100%-180px)] overflow-y-auto box-border py-5">
                {state.exercises.map((val, ind) => {
                    return (
                        <div
                            key={ind}
                            className="flex mobileL:flex-row flex-col justify-between box-border pr-3"
                        >
                            <div className="flex">
                                <div className="w-10 text-center">
                                    <p>{ind + 1}. </p>
                                </div>
                                <p>{val.exerciseName}</p>
                            </div>
                            <ExercisePresentation val={val.requirement} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

RoutinePage.getLayout = (page) => {
    return <Sidebar>{page}</Sidebar>;
};

export default RoutinePage;
