import {
    useState,
    useRef,
    FormEvent,
    Dispatch,
    SetStateAction,
} from "react";
import { useRouter } from "next/router";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Slide, { SlideProps } from "@mui/material/Slide";
import { Exercise, RoutineBody } from "../../types/general.types";
import styles from "../../styles/WorkoutForm.module.css";
import Input from "./input";

type WorkoutFormType = {
    callbackUrl: string;
    destination: string;
    inputs: Array<Exercise>;
    setInputFields: Dispatch<SetStateAction<Exercise[]>>;
    name: string;
    setName: Dispatch<SetStateAction<string>>;
    method: string;
};
type CustomSlideProps = Omit<SlideProps, "direction">;

const TransitionUp = (props: CustomSlideProps) => {
    return <Slide {...props} />;
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
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const divElement = useRef<null | HTMLDivElement>(null);

    const updateExercise= async (index: number, value: Exercise) => {
        inputs[index] = value;
    };

    const addInputField = async () => {
        try {
            await (async () => {
                setInputFields(prev => {
                    return [...prev, {
                        exerciseName: "",
                        requirement: 0
                    }];
                });
            })();
            divElement.current!.scrollIntoView({
                behavior: "smooth"
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    const removeInputField = async (ind: number) => {
        if (inputs.length > 1) {
            setInputFields(prev => {
                let newArr = prev.filter((_, i) => i !== ind);
                return newArr;
            });
        }
    }

    const copyInputField = async (ind: number) => {
        setInputFields(prev => {
            return [
                ...prev.slice(0, ind + 1),
                prev[ind],
                ...prev.slice(ind+1)
            ];
        });
    }

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let emptyFields: number[] = [];
        inputs.forEach((val, ind) => {
            let r = val.requirement;
            if (
                (typeof r === "object" && r.reps === 0) ||
                (typeof r === "number" && r === 0)
            ) {
                emptyFields.push(ind + 1);
            }
        });
        if (emptyFields.length === 0) {
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
            return;
        }
        setErrorMessage(
            `Please input duration of number of reps for exercise number ${emptyFields.join(
                ", "
            )}!`
        );
        setOpen(true);
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
                        <Input 
                            key = {1000-ind}
                            val = {val}
                            ind = {ind}
                            inputs = {inputs}
                            updateExercise = {updateExercise}
                            addInputField = {addInputField}
                            copyInputField = {copyInputField}
                            removeInputField = {removeInputField}
                        />
                    );
                })}
                <div ref={divElement}></div>
            </ol>
            <div className="flex mobileM:flex-row flex-col">
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
            <Snackbar
                open={open}
                TransitionComponent={TransitionUp}
                onClose={() => setOpen(false)}
                /* transitionDuration = {{
                    appear: 1000,
                    enter: 1000,
                    exit: 1000
                }} */
                className={styles.workoutSnackbar}
                message={errorMessage}
                autoHideDuration={1500}
            />
        </form>
    );
};

export { WorkoutForm };
