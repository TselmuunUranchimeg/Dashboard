import { ChangeEvent, FormEvent, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import TextField from "@mui/material/TextField";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Exercise, RoutineBody } from "../../types/general.types";
import styles from "../../styles/WorkoutForm.module.css";

type WorkoutFormType = {
    callbackUrl: string;
    destination: string;
    inputs: Array<Exercise>;
    setInputFields: Dispatch<SetStateAction<Exercise[]>>;
    name: string;
    setName: Dispatch<SetStateAction<string>>;
    method: string;
};

const WorkoutForm = ({
    callbackUrl,
    inputs,
    setInputFields,
    name,
    setName,
    destination,
    method,
}: WorkoutFormType) => {
    const router = useRouter();

    const inputChange = async (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ind: number,
        isReps: boolean
    ) => {
        setInputFields((prev) => {
            let newArr = [...prev];
            let target = newArr[ind];
            if (isReps) {
                target.requirement = { reps: parseInt(e.target.value) };
            } else {
                target.requirement = parseInt(e.target.value);
            }
            return newArr;
        });
    };

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const postBody: RoutineBody = {
            name,
            exercises: inputs,
        };
        let res = await axios({
            method,
            data: postBody,
            url: destination,
        });
        if (res.status < 300) {
            alert(res.data);
            router.push(callbackUrl);
            return;
        }
    };

    return (
        <form
            method="POST"
            className={styles.workoutForm}
            onSubmit={async (e) => await submit(e)}
        >
            <TextField
                fullWidth
                required={true}
                type="text"
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                label="Routine name"
                InputLabelProps={{
                    className: "!text-white",
                }}
                InputProps={{
                    className: "!text-white",
                }}
            />
            <ol>
                {inputs.map((val, ind) => {
                    return (
                        <li key={ind} className="relative">
                            <div className="flex mobileL:w-[calc(100%-48px)] sm:items-center justify-between box-border pr-[10px] mobileL:items-end items-start mobileL:flex-row flex-col w-100%">
                                <div className="flex sm:flex-row flex-col">
                                    <TextField
                                        required
                                        type="text"
                                        value={val.exerciseName}
                                        onChange={(e) => {
                                            setInputFields((prev) => {
                                                let newArr = [...prev];
                                                let target = newArr[ind];
                                                target.exerciseName =
                                                    e.target.value;
                                                return newArr;
                                            });
                                        }}
                                        label="Exercise name"
                                        InputLabelProps={{
                                            className: "!text-white",
                                        }}
                                        InputProps={{
                                            className: "!text-white",
                                        }}
                                        className="!pr-3 sm:!mb-0 !mt-3"
                                    />
                                    <TextField
                                        required
                                        type="number"
                                        value={
                                            typeof val.requirement === "object"
                                                ? 0
                                                : val.requirement
                                        }
                                        onChange={async (e) =>
                                            await inputChange(e, ind, false)
                                        }
                                        label="Duration"
                                        InputLabelProps={{
                                            className: "!text-white",
                                        }}
                                        InputProps={{
                                            className: "!text-white",
                                            inputProps: {
                                                min: 0,
                                            },
                                        }}
                                        className="!pr-3 sm:!mb-0 !mt-3"
                                    />
                                    <TextField
                                        required
                                        type="number"
                                        value={
                                            typeof val.requirement === "object"
                                                ? val.requirement.reps
                                                : 0
                                        }
                                        onChange={async (e) =>
                                            await inputChange(e, ind, true)
                                        }
                                        label="Reps"
                                        InputLabelProps={{
                                            className: "!text-white",
                                        }}
                                        InputProps={{
                                            className: "!text-white",
                                            inputProps: {
                                                min: 0,
                                            },
                                        }}
                                        className="!pr-3 sm:!mb-0 !mt-3"
                                    />
                                </div>
                                <div className = "flex mobileL:mt-0 mt-3">
                                    <RemoveIcon
                                        onClick={() => {
                                            setInputFields((prev) => {
                                                if (prev.length > 1) {
                                                    prev = prev.filter(
                                                        (_, i) => i !== ind
                                                    );
                                                }
                                                return prev;
                                            });
                                        }}
                                        className={`${styles.workoutIcon} sm:mr-0 mr-2`}
                                    />
                                    <ContentCopyIcon
                                        className={`${styles.workoutIcon} sm:mr-0 mr-2`}
                                        onClick={() => {
                                            setInputFields((prev) => {
                                                let newArr = [
                                                    ...prev.slice(0, ind + 1),
                                                    prev[ind],
                                                    ...prev.slice(ind + 1),
                                                ];
                                                return newArr;
                                            });
                                        }}
                                    />
                                </div>
                            </div>
                            <AddIcon
                                className={`${styles.workoutIcon} ${
                                    inputs.length - 1 === ind
                                        ? "!inline-block"
                                        : "!hidden"
                                } absolute bottom-0 right-0`}
                                onClick={() => {
                                    setInputFields((prev) => {
                                        let newArr = [...prev];
                                        newArr.push({
                                            exerciseName: "",
                                            requirement: 0,
                                        });
                                        return newArr;
                                    });
                                }}
                            />
                        </li>
                    );
                })}
            </ol>
            <div className = "flex mobileM:flex-row flex-col">
                <button
                    type="submit"
                    className={`${styles.workoutButton} mr-5 bg-[#131862] mb-5`}
                >
                    Create
                </button>
                <button
                    type="button"
                    className={`${styles.workoutButton} mr-5 bg-[#472692] mb-5`}
                    onClick={() => router.back()}
                >
                    Go back
                </button>
            </div>
        </form>
    );
};

export { WorkoutForm };
