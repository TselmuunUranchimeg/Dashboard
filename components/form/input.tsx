import { useState, useEffect, ChangeEvent } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import TextField from "@mui/material/TextField";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import styles from "../../styles/WorkoutForm.module.css";
import { Exercise } from "../../types/general.types";

type InputType = {
    ind: number;
    val: Exercise;
    inputs: Array<Exercise>;
    updateExercise: (index: number, value: Exercise) => void;
    addInputField: () => Promise<void>;
    removeInputField: (ind: number) => Promise<void>;
    copyInputField: (ind: number) => Promise<void>;
};

const Input = ({
    ind,
    val,
    inputs,
    updateExercise,
    addInputField,
    removeInputField,
    copyInputField
}: InputType) => {
    const [exercise, setExercise] = useState<Exercise>({
        exerciseName: "",
        requirement: 0
    });

    useEffect(() => {
        setExercise(val);
    }, []);

    const inputChange = async (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ind: number,
        isReps: boolean
    ) => {
        setExercise((prev) => {
            let newObj: Exercise = { ...prev, requirement: parseInt(e.target.value) };
            if (isReps) {
                newObj = {
                    ...prev,
                    requirement: { reps: parseInt(e.target.value) },
                };
            }
            updateExercise(ind, newObj);
            return newObj;
        });
    };

    return (
        <li className="relative">
            <div className="flex mobileL:w-[calc(100%-48px)] sm:items-center justify-between box-border pr-[10px] mobileL:items-end items-start mobileL:flex-row flex-col w-100%">
                <div className="flex sm:flex-row flex-col items-center">
                    <div className="flex sm:flex-row sm:items-center items-end">
                        <h1 className="mt-3 mr-3 text-xl">{ind + 1}. </h1>
                        <div className="flex sm:flex-row flex-col">
                            <TextField
                                required
                                type="text"
                                value={exercise.exerciseName}
                                onChange={(e) => {
                                    setExercise((prev) => {
                                        let newObj: Exercise = {
                                            ...prev,
                                            exerciseName: e.target.value,
                                        };
                                        updateExercise(ind, newObj);
                                        return newObj;
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
                                    typeof exercise.requirement === "object"
                                        ? 0
                                        : exercise.requirement
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
                                    typeof exercise.requirement === "object"
                                        ? exercise.requirement.reps
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
                    </div>
                </div>
                <div className="flex mobileL:mt-0 mobileL:ml-0 mt-3 ml-7">
                    <RemoveIcon
                        onClick={async () => await removeInputField(ind)}
                        className={`${styles.workoutIcon} mr-2`}
                    />
                    <ContentCopyIcon
                        className={`${styles.workoutIcon} mr-2`}
                        onClick={async () => await copyInputField(ind)}
                    />
                </div>
            </div>
            <AddIcon
                className={`${styles.workoutIcon} ${
                    inputs.length - 1 === ind ? "!inline-block" : "!hidden"
                } absolute bottom-0 right-0`}
                onClick={async () => await addInputField()}
            />
        </li>
    );
};

export default Input;
