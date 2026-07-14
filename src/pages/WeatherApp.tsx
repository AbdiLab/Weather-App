import { useState } from "react";
import { BanIcon, RetryIcon } from "../components/Icons";
import DailyForecast from "../components/sections/DailyForecast";
import Header from "../components/sections/Header";
import HourlyForecast from "../components/sections/HourlyForecast";
import Search from "../components/sections/Search";
import WeatherInfo from "../components/sections/WeatherInfo";
import DailyForecastSkeleton from "../components/skeletons/DailyForecastSkeleton";
import HourlyForecastSkeleton from "../components/skeletons/HourlyForecastSkeleton";
import WeatherInfoSkeleton from "../components/skeletons/WeatherInfoSkeleton";
import { useWeatherDataContext } from "../App";

export default function WeatherApp() {
  const { isError } = useWeatherDataContext();
  return (
    <div className="max-w-360 mx-auto flex min-h-screen flex-col items-center gap-600 px-200 pt-200 pb-600 tablet:px-300 tablet:pt-300 tablet:pb-1000 desktop:gap-800 desktop:px-1400 desktop:pt-600">
      <Header />

      {isError ? <ApiErrorMessage /> : <WeatherContent />}
    </div>
  );
}

function WeatherContent() {
  const [notFound, setNotFound] = useState(false);

  const { isLoading, weatherData } = useWeatherDataContext();

  return (
    <>
      <h1 className="text-preset-2 w-full text-center tablet:mx-auto tablet:w-120.5 desktop:w-auto desktop:whitespace-nowrap">
        How&rsquo;s the sky looking today?
      </h1>

      <main className="flex w-full flex-col items-center gap-400 desktop:gap-600">
        <Search setIsNotFound={(t) => setNotFound(t)} />

        {notFound ? (
          <>
            <div className="text-preset-4">No search result found!</div>
          </>
        ) : (
          <>
            {isLoading || weatherData === undefined ? (
              <div className="flex w-full flex-col items-start gap-400 desktop:flex-row desktop:items-stretch">
                <section className="flex w-full flex-col items-start gap-400 desktop:w-[50rem] desktop:shrink-0 desktop:gap-600">
                  <WeatherInfoSkeleton />
                  <DailyForecastSkeleton />
                </section>

                <HourlyForecastSkeleton />
              </div>
            ) : (
              <div className="flex w-full flex-col items-start gap-400 desktop:flex-row desktop:items-stretch">
                <section className="flex w-full flex-col items-start gap-400 desktop:w-[50rem] desktop:shrink-0 desktop:gap-600">
                  <WeatherInfo
                    city={weatherData.city}
                    country={weatherData.country}
                    current={weatherData.current}
                  />
                  <DailyForecast daily={weatherData.daily} />
                </section>

                <HourlyForecast hourly={weatherData.hourly} />
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}

export function ApiErrorMessage() {
  const { resetError } = useWeatherDataContext();
  return (
    <div className="flex w-full flex-col items-center gap-300 pt-500 text-center">
      <BanIcon className="size-8 text-neutral-300 tablet:size-10.5" />

      <h1 className="text-preset-2">Something went wrong</h1>

      <p className="text-preset-5-medium w-full max-w-138.5 text-neutral-200">
        We couldn&rsquo;t connect to the server (API error). Please try again in a few moments.
      </p>

      <button
        type="button"
        className="focus-visible:shadow-primary flex items-center gap-125 rounded-8 bg-neutral-800 px-200 py-150 text-preset-7 hover:bg-neutral-700"
        onClick={resetError}>
        <RetryIcon className="size-4" />
        Retry
      </button>
    </div>
  );
}
