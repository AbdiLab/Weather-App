// wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch

import axios from "axios";
import type { Coordinates, UnitSettings, WeatherData } from "./types";

type fetchDatProps = Omit<UnitSettings, "system"> & Coordinates;

const BASE_URL = "https://api.open-meteo.com/v1/forecast";
const BASETWO_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client?&localityLanguage=en";

export async function fetchData({
  latitude,
  longitude,
  precipitation,
  temperature,
  windSpeed,
}: fetchDatProps) {
  const params = {
    latitude,
    longitude,
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    hourly: "temperature_2m,weather_code",
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code",
    wind_speed_unit: windSpeed,
    temperature_unit: temperature,
    precipitation_unit: precipitation,
  };

  const [res, resTwo] = await Promise.all([
    axios.get(BASE_URL, { params }),
    axios.get(BASETWO_URL, { params: { latitude, longitude } }),
  ]);

  return {
    ...getLocation(resTwo),
    current: getCurrent(res),
    daily: getDaily(res),
    hourly: getHourly(res),
  };
}

function getLocation(res: any): Pick<WeatherData, "city" | "country"> {
  const { data } = res;

  return { city: data.city, country: data.countryName };
}

function getCurrent(res: any): WeatherData["current"] {
  const {
    data: { current, current_units },
  } = res;

  return {
    time: current.time,
    weatherCode: current.weather_code,
    temp: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    wind: current.wind_speed_10m,
    windUnit: current_units.wind_speed_10m,
    precipitation: current.precipitation,
    precipitationUnit: current_units.precipitation,
  };
}

function getDaily(res: any): WeatherData["daily"] {
  const {
    data: { daily },
  } = res as {
    data: {
      daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        weather_code: number[];
      };
    };
  };

  const convertedData = daily.time.map((t, i) => ({
    time: new Date(t).toLocaleDateString(undefined, { weekday: "short", timeZone: "UTC" }),
    maxTemp: daily.temperature_2m_max[i],
    minTemp: daily.temperature_2m_min[i],
    weatherCode: daily.weather_code[i],
  }));

  return convertedData;
}

function getHourly(res: any): WeatherData["hourly"] {
  const {
    data: { hourly },
  } = res as {
    data: { hourly: { time: string[]; temperature_2m: number[]; weather_code: number[] } };
  };

  const hourlyData: WeatherData["hourly"] = Array.from({ length: 7 }, (_, i) => ({
    weekDay: new Date(hourly.time[i * 24]).toLocaleDateString(undefined, { weekday: "long" }),
    data: [],
  }));

  for (let i = 0; i < hourly.time.length; i += 3) {
    hourlyData[Math.floor(i / 24)].data.push({
      time: new Date(hourly.time[i]).toLocaleTimeString(undefined, {
        hour: "numeric",
        hour12: true,
      }),
      temp: hourly.temperature_2m[i],
      weatherCode: hourly.weather_code[i],
    });
  }

  return hourlyData;
}
