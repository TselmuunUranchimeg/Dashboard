import { useState, useEffect, ChangeEvent } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import TextField from "@mui/material/TextField";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material";
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
enum RequirementSelectType {
    Duration = "Duration",
    Reps = "Reps",
}

const Input = ({
    ind,
    val,
    inputs,
    updateExercise,
    addInputField,
    removeInputField,
    copyInputField,
}: InputType) => {
    const [exercise, setExercise] = useState<Exercise>({
        exerciseName: "",
        requirement: 0,
    });
    const [select, setSelect] = useState(RequirementSelectType.Duration);
    const theme = createTheme({
        components: {
            MuiFormControl: {
                styleOverrides: {
                    root: {
                        backgroundColor: "black",
                    },
                },
            },
            MuiFormLabel: {
                styleOverrides: {
                    root: {
                        color: "white",
                        "&.Mui-focused": {
                            color: "white !important",
                        },
                    },
                },
            },
            MuiSelect: {
                styleOverrides: {
                    select: {
                        color: "white",
                    },
                },
            },
            MuiSvgIcon: {
                styleOverrides: {
                    root: {
                        color: "white !important",
                    },
                },
            },
        },
    });

    useEffect(() => {
        setExercise(val);
    }, [val]);

    const selectChange = async (e: SelectChangeEvent) => {
        setSelect((_) => {
            setExercise((prev) => {
                let oldValue: number =
                    typeof prev.requirement === "number"
                        ? prev.requirement
                        : prev.requirement.reps;
                let newObj: Exercise = { ...prev, requirement: oldValue };
                if (e.target.value === RequirementSelectType.Reps) {
                    newObj = { ...prev, requirement: { reps: oldValue } };
                }
                updateExercise(ind, newObj);
                return newObj;
            });
            return e.target.value as RequirementSelectType;
        });
    };

    const inputChange = async (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ind: number
    ) => {
        setExercise((prev) => {
            let newObj: Exercise = {
                ...prev,
                requirement: parseInt(e.target.value),
            };
            if (select === RequirementSelectType.Reps) {
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
                            <ThemeProvider theme={theme}>
                                <Box 
                                    width={223}
                                    display = "flex"
                                    alignItems = "end"
                                    marginRight = "12px"
                                    className = "sm:mt-0 mt-3"
                                >
                                    <FormControl fullWidth={true}>
                                        <InputLabel id="demo-simple-select">
                                            Exercise type
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={select}
                                            label="Exercise Type"
                                            onChange={async (
                                                e: SelectChangeEvent
                                            ) => {
                                                await selectChange(e);
                                            }}
                                            required={true}
                                        >
                                            <MenuItem
                                                value={
                                                    RequirementSelectType.Reps
                                                }
                                            >
                                                {RequirementSelectType.Reps}
                                            </MenuItem>
                                            <MenuItem
                                                value={
                                                    RequirementSelectType.Duration
                                                }
                                            >
                                                {RequirementSelectType.Duration}
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </ThemeProvider>
                            <TextField
                                required
                                type="number"
                                value={
                                    typeof exercise.requirement === "number"
                                        ? exercise.requirement
                                        : exercise.requirement.reps
                                }
                                onChange={async (e) =>
                                    await inputChange(e, ind)
                                }
                                label="Reps"
                                InputLabelProps={{
                                    className: "!text-white",
                                }}
                                InputProps={{
                                    className: "!text-white",
                                    inputProps: {
                                        min: 1,
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
