import { Document } from "mongodb";

//Workout types
export type Exercise = {
    exerciseName: string,
    requirement: number | { reps: number }
};
export type RoutineBody = {
    name: string,
    exercises: Array<Exercise>
};
export type Routine = RoutineBody & {
    id: string
}
export type WorkedOutDate = {
    routineNames: string[],
    date: Date
}
export type Workout = Document & {
    email: string,
    routines: Array<Routine>,
    dates: Array<WorkedOutDate>
};

//Weight types
export type Weight = Document & {
    email: string,
    progress: Array<{ day: Date, weight: number }>
}

//Todo list types
export type Task = {
    completed: string[],
    notFinished: string[]
};
export type PlanType = Document & {
    email: string,
    date: string,
    task: Task,
    expireAt: Date
}

//Weather types
export type ForecastType = {
    date: number;
    day: number;
    night: number;
    iconInt: number;
};
export type CurrentWeatherType = {
    currentWeather: number;
    wind: number;
    humidity: number;
    text: string;
    iconInt: number;
}

export type ApiWeatherType = {
    currentWeather: CurrentWeatherType;
    forecast: ForecastType[];
    currentLocation: string;
}