import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
import { CircularProgress } from "@mui/material";
import { Task } from "../../types/general.types";

type StateType = {
    finished: number;
    total: number;
};

const TasksTab = () => {
    const [state, setState] = useState<StateType | null>(null);
    const [message, setMessage] = useState("Loading...");

    useEffect(() => {
        axios
            .get(`/api/plan/${dayjs(new Date("2022-12-25")).format("YYYY-MM-DD")}`)
            .then((res) => {
                const data = res.data as Task;
                setState(() => {
                    return {
                        finished: data.completed.length,
                        total: data.completed.length + data.notFinished.length,
                    };
                });
                setMessage(
                    `${data.completed.length}/${
                        data.completed.length + data.notFinished.length
                    } done`
                );
            })
            .catch(e => {
                if (axios.isAxiosError(e)) {
                    if (e.response?.status === 404) {
                        setMessage("No task to display");
                    }
                }
            })
    }, []);

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="inline-flex items-center justify-center mt-10 mb-16 py-5">
                <CircularProgress
                    value={!state ? 0 : (state.finished / state.total) * 100}
                    variant="determinate"
                    className="absolute"
                    size="10rem"
                    color="inherit"
                />
                <p className="font-bold text-lg">{message}</p>
            </div>
            <Link
                href="/planning"
                className="underline duration-100 hover:-translate-y-[2px] hover:font-bold"
            >
                See further details
            </Link>
        </div>
    );
};

export default TasksTab;
