import { createContext, useContext, useEffect, useState, type Dispatch } from "react";
import WeatherApp from "./pages/WeatherApp";
import "./styles.css";
import type { Coordinates, UnitSettings, WeatherData } from "./utils/types";
import { fetchData } from "./utils/fetchData";

type UnitsContextTypes = {
  units: UnitSettings;
  switchSystem: () => void;
  setUnits: Dispatch<React.SetStateAction<UnitSettings>>;
};

type WeatherDataContextTypes = {
  weatherData: WeatherData | undefined;
  isError: boolean;
  isLoading: boolean;
  getCoordinates: (coordinates: Coordinates) => void;
  resetError: () => void;
};

const UnitsContext = createContext<UnitsContextTypes | null>(null);
const WeatherDataContext = createContext<WeatherDataContextTypes | null>(null);

export function useUnitsContext() {
  const value = useContext(UnitsContext);

  if (value === null) {
    throw new Error("must use within context");
  }

  return value;
}

export function useWeatherDataContext() {
  const value = useContext(WeatherDataContext);

  if (value === null) {
    throw new Error("must use within context");
  }

  return value;
}

export default function App() {
  const [units, setUnits] = useState<UnitSettings>({
    system: "Metric",
    temperature: "celsius",
    windSpeed: "kmh",
    precipitation: "mm",
  });
  const [coordinates, setCoordinates] = useState<Coordinates>();
  const [weatherData, setWeatherData] = useState<WeatherData>();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function switchSystem() {
    setUnits((c) => {
      if (c.system === "Metric") {
        return {
          system: "Imperial",
          precipitation: "inch",
          temperature: "fahrenheit",
          windSpeed: "mph",
        };
      }
      return {
        system: "Metric",
        temperature: "celsius",
        windSpeed: "kmh",
        precipitation: "mm",
      };
    });
  }

  useEffect(() => {
    if (isError === true) return;
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {
          coords: { latitude, longitude },
        } = position;

        setCoordinates({ latitude, longitude });
      },
      () => {
        setIsError(true);
        setIsLoading(false);
      },
    );
  }, [isError]);

  async function handleFetch() {
    if (coordinates === undefined) return;
    setIsLoading(true);
    const { system, ...restUnits } = units;
    try {
      const res = await fetchData({ ...restUnits, ...coordinates });
      setWeatherData(res);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    handleFetch();
  }, [coordinates, units]);

  function getCoordinates(coordinates: Coordinates) {
    setCoordinates(coordinates);
  }
  function resetError() {
    setIsError(false);
  }

  return (
    <UnitsContext.Provider value={{ units, switchSystem, setUnits }}>
      <WeatherDataContext.Provider
        value={{ resetError, weatherData, isError, isLoading, getCoordinates }}>
        <WeatherApp />
      </WeatherDataContext.Provider>
    </UnitsContext.Provider>
  );
}
