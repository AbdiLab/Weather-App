import { DropdownIcon } from "../Icons";

import useToggleDropdown from "../../hooks/useToggleDropdown";
import type { WeatherData } from "../../utils/types";
import { useMemo, useState } from "react";
import { toFixed } from "../../utils/toFixed";
import { getWeatherIconName } from "../../utils/getWeatherIconName";

type HourlyForecastProps = {
  hourly: WeatherData["hourly"];
};

export default function HourlyForecast({ hourly }: HourlyForecastProps) {
  const { dropdownRef, isOpen, toggle, onClose } = useToggleDropdown();
  const [currentDay, setCurrentDay] = useState(() => {
    return hourly[0].weekDay;
  });

  function choseCurrentDay(day: string) {
    setCurrentDay(day);
  }
  const weekDays = useMemo(() => {
    return hourly.map((day) => day.weekDay);
  }, [hourly]);
  const currentData = useMemo(() => {
    return hourly.filter((c) => c.weekDay === currentDay).flatMap((day) => day.data);
  }, [hourly, currentDay]);

  return (
    <aside className="relative flex w-full flex-col items-start gap-200 overflow-hidden rounded-20 bg-neutral-800 px-200 py-250 tablet:p-300 desktop:w-96 desktop:shrink-0">
      <div className="flex w-full items-center justify-between">
        <p className="text-preset-5">Hourly forecast</p>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggle}
            type="button"
            className=" focus-visible:shadow-primary text-preset-7 flex items-center gap-3 rounded-8 bg-neutral-600 px-200 py-100">
            <span>{currentDay}</span>
            <DropdownIcon className="size-3" />
          </button>

          {isOpen && (
            <DaysDropdown
              weekDays={weekDays}
              currentDay={currentDay}
              onChose={choseCurrentDay}
              onClose={onClose}
            />
          )}
        </div>
      </div>

      {currentData.map((hour) => (
        <div
          key={hour.time}
          className="flex w-full items-center gap-100 overflow-hidden rounded-8 bg-neutral-700 py-125 pl-150 pr-200 shadow-[inset_0_0_0_1px_var(--color-neutral-600)]">
          <img
            src={`images/icon-${getWeatherIconName(hour.weatherCode)}.webp`}
            alt={`${getWeatherIconName(hour.weatherCode)} weather`}
            className="size-10"
          />
          <p className="text-preset-5-medium min-w-0 flex-1">{hour.time}</p>
          <p className="text-preset-7">{toFixed(hour.temp)}°</p>
        </div>
      ))}

      <div className="absolute top-65.75 right-0 h-65.5 w-1 rounded-12 border border-neutral-600 bg-neutral-700" />
    </aside>
  );
}

type DaysDropdownProps = {
  weekDays: string[];
  currentDay: string;
  onChose: (day: string) => void;
  onClose: () => void;
};

function DaysDropdown({ weekDays, currentDay, onChose, onClose }: DaysDropdownProps) {
  return (
    <div className="absolute right-0 top-full z-10 mt-100 flex w-53.5 flex-col items-start gap-050 rounded-12 border border-neutral-600 bg-neutral-800 p-100 drop-shadow-[0px_8px_8px_rgba(2,1,44,0.32)]">
      {weekDays.map((day) => (
        <button
          onClick={() => {
            onChose(day);
            onClose();
          }}
          key={day}
          type="button"
          className={`dropdown-btn text-preset-7 w-full rounded-8 px-100 py-125 text-left ${
            day === currentDay ? "bg-neutral-700" : ""
          }`}>
          {day}
        </button>
      ))}
    </div>
  );
}
