import { useState, FormEvent, useEffect } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Page } from "../../types/page.types";
import LoadingComponent from "../../components/loading/Loading";
import Sidebar from "../../components/sidebar/sidebar";
import SingleTab from "../../components/plan/SingleTab";
import { Task } from "../../types/general.types";
import LoadingWithBackground from "../../components/loading/LoadingWithBackground";

enum SeverityEnum {
    success = "success",
    error = "error",
}

const Planning: Page = () => {
    const [date, setDate] = useState<Dayjs | null>(null);
    const [value, setValue] = useState("");
    const [ready, setReady] = useState(false);
    const today = dayjs().format("YYYY-MM-DD");
    const [todayState, setTodayState] = useState<Task | null>(null);
    const [otherDates, setOtherDates] = useState<string[]>([]);
    const [rightSideDate, setRightSideDate] = useState<Task | null>(null);
    const [pointer, setPointer] = useState(0);
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState(SeverityEnum.success);

    const showMessage = (m: string, s: boolean) => {
        setSeverity(s ? SeverityEnum.error : SeverityEnum.success);
        setMessage(m);
        setOpen(true);
    };

    useEffect(() => {
        axios
            .get("/api/plan")
            .then((res) => {
                let dates = res.data as string[];
                dates = dates.filter((val) => val !== today);
                setOtherDates(dates);
                setReady(true);
            })
            .catch((e) => {
                if (axios.isAxiosError(e)) {
                    console.log(e.message);
                }
            });
    }, []);

    if (!ready) {
        return (
            <div className="w-full h-full">
                <LoadingComponent />
            </div>
        );
    }

    const formSubmit = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            setLoading(true);
            const d = date?.format("YYYY-MM-DD")!;
            await axios.post("/api/plan", {
                value,
                date: d,
            });
            if (d === today) {
                setTodayState((prev) => {
                    if (!prev) {
                        return {
                            completed: [],
                            notFinished: [value],
                        };
                    }
                    prev.notFinished.push(value);
                    return { ...prev };
                });
            } else {
                const p = otherDates.findIndex((val) => val === d);
                if (p === pointer) {
                    setRightSideDate((prev) => {
                        if (!prev) {
                            return null;
                        }
                        prev.notFinished.push(value);
                        return { ...prev };
                    });
                } else if (p === -1) {
                    setOtherDates((prev) => {
                        prev.push(d);
                        return prev.sort();
                    });
                }
            }
            setValue("");
            setDate(null);
            setLoading(false);
            showMessage("Success", false);
        } catch (e) {
            if (axios.isAxiosError(e)) {
                console.log(e.message);
                showMessage(
                    "Something went wrong, please try agains few minutes later!",
                    true
                );
            }
        }
    };

    return (
        <div className="flex w-full h-full flex-col">
            <Head>
                <title>Planning - {session?.user?.name}</title>
            </Head>
            <Snackbar
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                open={open}
                onClose={() => {
                    setOpen(false);
                    setMessage("");
                }}
                autoHideDuration={1500}
            >
                <Alert
                    sx={{ width: "300px" }}
                    variant="filled"
                    severity={severity}
                >
                    {message}
                </Alert>
            </Snackbar>
            <div className="sm:h-1/2 h-auto w-full flex flex-col sm:flex-row box-border lg:p-5 p-10 pb-5 justify-between">
                <div className="sm:w-[calc(50%_-_10px)] w-full sm:h-full h-[300px] bg-[#404BE9] relative mb-5">
                    <h1 className="text-center text-xl font-bold py-3">
                        {"Today's task"}
                    </h1>
                    <SingleTab
                        showMessage={showMessage}
                        date={today}
                        setState={setTodayState}
                        state={todayState}
                    />
                </div>
                <div className="sm:w-[calc(50%_-_10px)] w-full sm:h-full h-[300px] bg-blue-500 relative">
                    <div className="flex justify-between box-border py-3 px-5 font-bold">
                        <ArrowBackIosNewIcon
                            className={`cursor-pointer`}
                            onClick={() => {
                                if (pointer > 0) {
                                    setPointer((prev) => prev - 1);
                                    setRightSideDate(null);
                                }
                            }}
                        />
                        <h1 className="text-xl">{otherDates[pointer]}</h1>
                        <ArrowForwardIosIcon
                            onClick={() => {
                                if (pointer < otherDates.length - 1) {
                                    setPointer((prev) => prev + 1);
                                    setRightSideDate(null);
                                }
                            }}
                            className="cursor-pointer"
                        />
                    </div>
                    <SingleTab
                        showMessage={showMessage}
                        date={otherDates[pointer]}
                        setState={setRightSideDate}
                        state={rightSideDate}
                    />
                </div>
            </div>
            <div className="h-1/2 w-full flex box-border lg:p-5 p-10 py-5 flex-col border-white border-t-[1px] relative">
                <LoadingWithBackground loading={loading} />
                <h1 className="mb-5 text-xl font-bold">Set a task</h1>
                <form
                    onSubmit={async (e) => await formSubmit(e)}
                    className="flex flex-col items-start"
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={date}
                            onChange={(v) => setDate(v)}
                            renderInput={(p) => (
                                <TextField
                                    style={{
                                        backgroundColor: "white",
                                        marginBottom: "1.25rem",
                                    }}
                                    required
                                    {...p}
                                />
                            )}
                            disablePast={true}
                            inputFormat="YYYY/MM/DD"
                        />
                    </LocalizationProvider>
                    <input
                        placeholder="Task..."
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.currentTarget.value)}
                        className="text-black px-5 py-2 w-3/5 mb-5"
                        required={true}
                    />
                    <button
                        type="submit"
                        className="bg-green-600 px-6 py-2 cursor-pointer font-bold"
                    >
                        Add task
                    </button>
                </form>
            </div>
        </div>
    );
};

Planning.getLayout = (page) => {
    return <Sidebar>{page}</Sidebar>;
};

export default Planning;
