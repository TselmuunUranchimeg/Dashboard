import { useEffect, useState, Dispatch, SetStateAction } from "react";
import axios from "axios";
import LoadingComponent from "../loading/Loading";
import LoadingWithBackground from "../loading/LoadingWithBackground";
import { Task } from "../../types/general.types";
import TaskRow from "./TaskRow";

export interface SingleTabInterface {
    date: string;
    state: Task | null;
    setState: Dispatch<SetStateAction<Task | null>>;
    showMessage: (m: string, s: boolean) => void;
}

const SingleTab = ({ date, state, setState, showMessage }: SingleTabInterface) => {
    const [isEmpty, setEmpty] = useState(false);
    const [loading, setLoading] = useState(false);

    const load = (willLoadNow: boolean) => {
        setLoading(willLoadNow);
    };

    useEffect(() => {
        axios
            .get(`/api/plan/${date}`)
            .then((res) => {
                setState(res.data as Task);
            })
            .catch((e) => {
                if (axios.isAxiosError(e)) {
                    if (e.response?.status === 404) {
                        setEmpty(true);
                        showMessage(e.response?.data as string, true);
                    }
                }
            });
    }, [date, setState, showMessage]);

    if (!state) {
        return (
            <div className="flex w-full h-[calc(100%_-_52px)] justify-center items-center">
                <p className={`${isEmpty ? "block" : "hidden"}`}>
                    There is no task to display
                </p>
                <LoadingComponent
                    className={`${isEmpty ? "hidden" : "block"}`}
                />
            </div>
        );
    }

    return (
        <div className="w-full h-[calc(100%_-_52px)] flex flex-col box-border px-5 py-1 overflow-y-auto">
            <LoadingWithBackground loading={loading} />
            {state.notFinished.map((val, ind) => {
                return (
                    <TaskRow
                        key={ind}
                        text={val}
                        date={date}
                        isCompleted={false}
                        showMessage={showMessage}
                        load={load}
                    />
                );
            })}
            {state.completed.map((val, ind) => {
                return (
                    <TaskRow
                        key={ind}
                        text={val}
                        date={date}
                        isCompleted={true}
                        showMessage={showMessage}
                        load={load}
                    />
                );
            })}
        </div>
    );
};

export default SingleTab;
