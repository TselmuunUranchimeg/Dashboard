import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { ForecastType, CurrentWeatherType, ApiWeatherType } from "../../../types/general.types";

type LocationFunctionType = {
    locationKey: string;
    currentLocation: string;
};
type Temperature = {
    Minimum: {
        Value: number;
        Unit: string;
        UnitType: number;
    };
    Maximum: {
        Value: number;
        Unit: string;
        UnitType: number;
    };
};
type ForecastApiResponseType = {
    Date: string;
    EpochDate: number;
    Temperature: Temperature;
    MobileLink: string;
    Link: string;
    Sources: string[];
    Night: {
        Icon: number;
        IconPhrase: string;
        HasPrecipitation: boolean;
    };
    Day: {
        Icon: number;
        IconPhrase: string;
        HasPrecipitation: boolean;
        PrecipitationType: string;
        PrecipitationIntensity: string;
    };
};

const getLocationKey = async (lat: string, lon: string): Promise<LocationFunctionType> => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const res = await axios.get(
        `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${
            process.env.WEATHER_API_KEY!}&q=${`${latitude},${longitude}`}`
    );
    return {
        locationKey: res.data["Key"] as string,
        currentLocation: `${
            res.data["EnglishName"] as string
        }, ${res.data.Country.EnglishName as string}`
    };
};

const currentWeather = async (locationKey: string): Promise<CurrentWeatherType> => {
    const res = await axios.get(`https://dataservice.accuweather.com/currentconditions/v1/${
        locationKey}?apikey=${process.env.WEATHER_API_KEY!}&details=true`);
    return {
        currentWeather: res.data[0].Temperature.Metric.Value as number,
        wind: res.data[0].Wind.Speed.Metric.Value as number,
        humidity: res.data[0].RelativeHumidity as number,
        text: res.data[0].WeatherText as string,
        iconInt: res.data[0].WeatherIcon as number
    };
};

const forecastWeather = async (locationKey: string) => {
    const res = await axios.get(`https://dataservice.accuweather.com/forecasts/v1/daily/5day/${
        locationKey}?apikey=${process.env.WEATHER_API_KEY}&metric=true`);
    const dailyForecasts = res.data.DailyForecasts as Array<ForecastApiResponseType>;
    return dailyForecasts.map<ForecastType>((val) => {
        return {
            date: val.EpochDate,
            day: val.Temperature.Maximum.Value,
            night: val.Temperature.Minimum.Value,
            iconInt: val.Day.Icon
        };
    });
};

const weatherHandler = async (
    req: NextApiRequest, 
    res: NextApiResponse<string | ApiWeatherType>
) => {
    try {
        const { lat, lon } = req.query;
        if (lat && lon) {
            if (
                !isNaN(parseFloat(lat as string)) &&
                !isNaN(parseFloat(lon as string))
            ) {
                const { locationKey, currentLocation } = await getLocationKey(
                    lat as string,
                    lon as string
                );
                const arr = await Promise.all([
                    currentWeather(locationKey),
                    forecastWeather(locationKey),
                ]);
                res.status(200).json({
                    currentLocation,
                    currentWeather: arr[0],
                    forecast: arr[1]
                });
                return;
            }
        }
        res.status(400).end("Bad request");
    } catch (e) {
        if (axios.isAxiosError(e)) {
            res.status(500).end("Something went wrong, please try again later!");
            console.log(e.response);
        } else {
            console.log(e);
        }
    }
};

export default weatherHandler;
