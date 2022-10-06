import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { ApiWeatherType } from "../../types/general.types";
import LoadingComponent from "../loading/Loading";

type WeatherLogoType = {
    iconInt: number;
    height: number;
    width: number;
};

const WeatherLogo = ({ iconInt, height, width }: WeatherLogoType) => {
    return (
        <Image
            src={`https://apidev.accuweather.com/developers/Media/Default/WeatherIcons/${
                iconInt < 10 ? `0${iconInt}` : iconInt
            }-s.png`}
            alt="Some Logo"
            width={width}
            height={height}
        />
    );
};

const WeatherTab = () => {
    const [state, setState] = useState<ApiWeatherType | null | undefined>(null);
    const date = new Date();
    const formatter = new Intl.DateTimeFormat("en", {
        weekday: "long",
        month: "long"
    });

    const properFormat = (num: number): string => {
        const date = new Date(num*1000);
        const data = formatter.format(date).split(" ");
        return `${data[1].slice(0, 3)}, ${date.getDate()} ${data[0].slice(0, 3)}`;
    }

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            axios
                .get(`/api/weather?lat=${latitude}&lon=${longitude}`)
                .then(async (res) => {
                    await (async () => setState(res.data as ApiWeatherType))();
                })
                .catch((e) => {
                    if (axios.isAxiosError(e)) {
                        setState(undefined);
                    }
                });
        });
    }, []);

    if (state === null) {
        return (
            <div className="w-full h-full">
                <LoadingComponent className={`${state ? "hidden" : "block"}`} />
            </div>
        );
    } else if (state === undefined) {
        return (
            <div className = {`w-full h-full flex items-center justify-center lg:p-0 py-10 ${
                date.getHours() < 18 ? "bg-[#82CAFF]" : "bg-[#131862]"
            }`}>
                <h1 className = "sm:text-lg mobileL:text-base mobileM:text-sm text-xs opacity-75">
                    Something went wrong, please check later!
                </h1>
            </div>
        )
    }

    return (
        <div
            className={`w-full h-full flex ${
                date.getHours() < 18 ? "bg-[#82CAFF]" : "bg-[#131862]"
            } lg:flex-row flex-col`}
        >
            {/* Current weather */}
            <div className="lg:w-[45%] w-full h-full flex">
                <div className="w-3/5 h-full box-border pl-5 pb-7 pt-5 flex flex-col justify-between">
                    <div>
                        <h1 className="text-xl font-bold">
                            {state.currentLocation}
                        </h1>
                        <p className="text-xs">
                            Current time:{" "}
                            {`${date.getHours()}:${date.getMinutes()}`}
                        </p>
                        <p className="text-xs">{properFormat(Date.now()/1000)}</p>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">
                            {state.currentWeather.currentWeather}°C
                        </h1>
                        <p className="text-xs">
                            {state.forecast[0].day}°C/{state.forecast[0].night}
                        </p>
                        <p className="text-xs">{state.currentWeather.text}</p>
                    </div>
                    <div>
                        <p className="text-xs">
                            Wind: {state.currentWeather.wind}km/h
                        </p>
                        <p className="text-xs">
                            Humidity: {state.currentWeather.humidity}%
                        </p>
                    </div>
                </div>
                <div className="w-2/5 h-full flex items-center justify-center">
                    <WeatherLogo
                        iconInt={state.currentWeather.iconInt}
                        height={100}
                        width={180}
                    />
                </div>
            </div>

            {/* Forecast */}
            <div className="lg:w-[55%] w-full h-full flex items-center box-border">
                {state.forecast.slice(1).map((val, ind) => {
                    return (
                        <div
                            key={ind}
                            className="h-full flex flex-col items-center justify-between py-10 w-1/4"
                        >
                            <p>{properFormat(val.date)}</p>
                            <WeatherLogo
                                iconInt={val.iconInt}
                                width={180}
                                height={100}
                            />
                            <p>
                                {Math.round(val.day)}/{Math.round(val.night)} °C
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WeatherTab;
