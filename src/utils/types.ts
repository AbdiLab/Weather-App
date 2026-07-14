export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type SearchedCities = {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
};

export type UnitSettings = {
  system: "Imperial" | "Metric";
  temperature: "fahrenheit" | "celsius";
  windSpeed: "mph" | "kmh";
  precipitation: "inch" | "mm";
};

export type WeatherData = {
  city: string;
  country: string;
  current: {
    time: string;
    weatherCode: number;
    temp: number;
    feelsLike: number;
    humidity: number;
    wind: number;
    windUnit: string;
    precipitation: number;
    precipitationUnit: string;
  };

  daily: { time: string; maxTemp: number; minTemp: number; weatherCode: number }[];

  hourly: {
    weekDay: string;
    data: {
      time: string;
      temp: number;
      weatherCode: number;
    }[];
  }[];
};

// types/weather.ts
export type WeatherIconName =
  | "sunny"
  | "partly-cloudy"
  | "overcast"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm";
