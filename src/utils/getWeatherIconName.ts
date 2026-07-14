// utils/weatherIconMap.ts

import type { WeatherIconName } from "./types";

const WMO_ICON_MAP: Record<number, WeatherIconName> = {
  0: "sunny", // Clear sky
  1: "sunny", // Mainly clear
  2: "partly-cloudy", // Partly cloudy
  3: "overcast", // Overcast

  45: "fog", // Fog
  48: "fog", // Depositing rime fog

  51: "drizzle", // Drizzle: light
  53: "drizzle", // Drizzle: moderate
  55: "drizzle", // Drizzle: dense
  56: "drizzle", // Freezing drizzle: light
  57: "drizzle", // Freezing drizzle: dense

  61: "rain", // Rain: slight
  63: "rain", // Rain: moderate
  65: "rain", // Rain: heavy
  66: "rain", // Freezing rain: light
  67: "rain", // Freezing rain: heavy
  80: "rain", // Rain showers: slight
  81: "rain", // Rain showers: moderate
  82: "rain", // Rain showers: violent

  71: "snow", // Snow fall: slight
  73: "snow", // Snow fall: moderate
  75: "snow", // Snow fall: heavy
  77: "snow", // Snow grains
  85: "snow", // Snow showers: slight
  86: "snow", // Snow showers: heavy

  95: "storm", // Thunderstorm: slight/moderate
  96: "storm", // Thunderstorm with slight hail
  99: "storm", // Thunderstorm with heavy hail
};

export function getWeatherIconName(code: number): WeatherIconName {
  return WMO_ICON_MAP[code] ?? "sunny";
}
