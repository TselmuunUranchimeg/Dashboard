import { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import Checkbox from "@mui/material/Checkbox";
import { common } from "@mui/material/colors";

interface TaskType {
    text: string;
    date: string;
    isCompleted: boolean;
    showMessage: (m: string, s: boolean) => void;
    load: (willLoadNow: boolean) => void;
}

const TaskRow = ({ text, date, isCompleted, showMessage, load }: TaskType) => {
    const [value, setValue] = useState(text);
    const [originalValue, setOriginalValue] = useState(text);
    const [state, setState] = useState(true);
    const [completed, setCompleted] = useState(isCompleted);
    const today = dayjs().format("YYYY-MM-DD");

    const edit = async () => {
        try {
            load(true);
            const res = await axios.patch("/api/plan", {
                date,
                value,
                completed,
                originalValue,
            });
            setOriginalValue(value);
            setState(true);
            showMessage(res.data as string, false);
            load(false);
        } catch (e) {
            if (axios.isAxiosError(e)) {
                showMessage(e.response?.data as string, true);
                setValue(originalValue);
            }
        }
    };

    return (
        <div
            className={`w-full mb-4 pb-[6px] border-b-[1px] border-white ${
                today <= date ? null : "border-opacity-50"
            } relative box-border`}
        >
            {/* Display */}
            <div
                className={`${state ? "block" : "hidden"} ${
                    completed ? "line-through" : ""
                } flex justify-between w-full`}
            >
                <Checkbox
                    sx={{
                        color: common.white,
                        "&.Mui-checked": {
                            color: common.white,
                        },
                    }}
                    style={{
                        padding: 0,
                        display: `${today <= date ? "" : "none"}`,
                    }}
                    checked = {completed}
                    onChange = {async () => {
                        try {
                            load(true);
                            const res = await axios.patch(`/api/plan/${date}`, {
                                value, originallyCompleted: completed
                            });
                            setCompleted(prev => !prev);
                            showMessage(res.data as string, false);
                            load(false);
                        }
                        catch (e) {
                            if (axios.isAxiosError(e)) {
                                showMessage(e.response?.data, true);
                            }
                        }
                    }}
                />
                <div className="w-[calc(100%_-_35px)] flex justify-between">
                    <p
                        className={`font-bold ${
                            today <= date ? "" : "opacity-50"
                        }`}
                    >
                        {value}
                    </p>
                    <EditIcon
                        onClick={() => {
                            setState(false);
                        }}
                        className={`cursor-pointer ${
                            today <= date ? "" : "!hidden"
                        } ${completed ? "!hidden" : ""}`}
                    />
                </div>
            </div>

            {/* Edit */}
            <div
                className={`${
                    state ? "hidden" : "block"
                } flex items-center w-full`}
            >
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.currentTarget.value)}
                    className="text-black px-2 py-[2px] w-[calc(100%_-_50px)]"
                />
                <div className="w-[50px] flex justify-end">
                    <CancelIcon
                        onClick={() => {
                            setValue(originalValue);
                            setState(true);
                        }}
                        className="cursor-pointer"
                    />
                    <CheckIcon
                        onClick={async () => await edit()}
                        className="cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
};

export default TaskRow;
