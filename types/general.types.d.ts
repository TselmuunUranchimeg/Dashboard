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
    year: number,
    month: number,
    day: number
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
export type TodoList = Document & {
    email: string,
    date: Date,
    task: {
        completed: string[],
        notFinished: string[]
    }
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