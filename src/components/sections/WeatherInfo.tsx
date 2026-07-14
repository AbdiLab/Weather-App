import bgTodaySmall from "../../assets/images/bg-today-small.svg";
import bgTodayLarge from "../../assets/images/bg-today-large.svg";
import type { WeatherData } from "../../utils/types";
import { toFixed } from "../../utils/toFixed";
import { getWeatherIconName } from "../../utils/getWeatherIconName";

type WeatherInfoProps = Omit<WeatherData, "daily" | "hourly">;

export default function WeatherInfo({ city, country, current }: WeatherInfoProps) {
  return (
    <div className="flex w-full flex-col items-start gap-250 desktop:gap-400">
      <div className="relative h-71.5 w-full overflow-hidden rounded-20 px-300 py-1000">
        <img
          src={bgTodaySmall}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover tablet:hidden"
        />
        <img
          src={bgTodayLarge}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 hidden size-full object-cover tablet:block"
        />
        <div className="relative flex size-full flex-col items-center justify-center gap-200 tablet:flex-row tablet:items-center tablet:gap-0">
          <div className="flex flex-col items-center gap-150 text-center tablet:min-w-0 tablet:flex-1 tablet:items-start tablet:text-left">
            <p className="text-preset-4">
              {city}, {country}
            </p>
            <p className="text-preset-6 opacity-80">
              {new Date(current.time).toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-5">
            <img
              src={`images/icon-${getWeatherIconName(current.weatherCode)}.webp`}
              alt={`${getWeatherIconName(current.weatherCode)} weather`}
              className="size-30"
            />
            <p className="text-preset-1">{toFixed(current.temp)}°</p>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-stretch justify-center gap-200 tablet:flex-nowrap tablet:gap-250 desktop:gap-300">
        <WeatherCurrentDetails label="Feels Like" value={`${toFixed(current.feelsLike)}°`} />
        <WeatherCurrentDetails label="Humidity" value={`${toFixed(current.humidity)}%`} />
        <WeatherCurrentDetails label="Wind" value={`${toFixed(current.wind)}${current.windUnit}`} />
        <WeatherCurrentDetails
          label="Precipitation"
          value={`${toFixed(current.precipitation)} ${current.precipitationUnit}`}
        />
      </div>
    </div>
  );
}

function WeatherCurrentDetails({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-[10.21875rem] shrink-0 flex-col items-start gap-300 rounded-12 bg-neutral-800 p-250 shadow-[inset_0_0_0_1px_var(--color-neutral-600)] tablet:w-auto tablet:min-w-0 tablet:flex-1">
      <p className="text-preset-6 text-neutral-200">{label}</p>
      <p className="text-preset-3">{value}</p>
    </div>
  );
}
