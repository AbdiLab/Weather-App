import type { WeatherData } from "../../utils/types";
import { toFixed } from "../../utils/toFixed";
import { getWeatherIconName } from "../../utils/getWeatherIconName";

type DailyForecastProps = {
  daily: WeatherData["daily"];
};

export default function DailyForecast({ daily }: DailyForecastProps) {
  return (
    <div className="flex w-full flex-col items-start gap-250">
      <p className="text-preset-5 w-full">Daily forecast</p>
      <div className="flex w-full flex-wrap items-center justify-center gap-200 tablet:flex-nowrap tablet:justify-start">
        {daily.map((day) => (
          <div
            key={day.time}
            className="flex w-[6.47875rem] shrink-0 flex-col items-center gap-200 overflow-hidden rounded-12 bg-neutral-800 px-125 py-200 shadow-[inset_0_0_0_1px_var(--color-neutral-600)] tablet:w-auto tablet:min-w-0 tablet:flex-1">
            <p className="text-preset-6 whitespace-nowrap text-center">{day.time}</p>
            <img
              src={`images/icon-${getWeatherIconName(day.weatherCode)}.webp`}
              alt={`${getWeatherIconName(day.weatherCode)} weather`}
              className="size-15"
            />
            <div className="text-preset-7 flex w-full items-center justify-between whitespace-nowrap">
              <span>{toFixed(day.maxTemp)}°</span>
              <span className="text-neutral-200">{toFixed(day.minTemp)}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
