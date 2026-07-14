import { DropdownIcon } from "../Icons";

const hourlyForecastCards = Array.from({ length: 8 });

export default function HourlyForecastSkeleton() {
  return (
    <aside className="relative flex w-full flex-col items-start gap-200 overflow-hidden rounded-20 bg-neutral-800 px-200 py-250 tablet:p-300 desktop:w-96 desktop:shrink-0">
      <div className="flex w-full items-center justify-between">
        <p className="text-preset-5">Hourly forecast</p>
        <div className="text-preset-7 flex items-center gap-3 rounded-8 bg-neutral-600 px-200 py-100">
          <span>–</span>
          <DropdownIcon className="size-3" />
        </div>
      </div>

      {hourlyForecastCards.map((_, index) => (
        <div
          key={index}
          className="h-15 w-full shrink-0 overflow-hidden rounded-8 bg-neutral-700 shadow-[inset_0_0_0_1px_var(--color-neutral-600)]"
        />
      ))}

      <div className="absolute top-65.75 right-0 h-65.5 w-1 rounded-12 border border-neutral-600 bg-neutral-700" />
    </aside>
  );
}
