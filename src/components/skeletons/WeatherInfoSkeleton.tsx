const weatherDetails = ["Feels Like", "Humidity", "Wind", "Precipitation"];

export default function WeatherInfoSkeleton() {
  return (
    <div className="flex w-full flex-col items-start gap-250 desktop:gap-400">
      <div className="relative flex h-71.5 w-full flex-col items-center justify-center gap-3.5 overflow-hidden rounded-20 bg-neutral-800">
        <LoadingDots className="h-4 w-14" />
        <p className="text-preset-6 text-neutral-200">Loading...</p>
      </div>

      <div className="flex w-full flex-wrap items-stretch justify-center gap-200 tablet:flex-nowrap tablet:gap-250 desktop:gap-300">
        {weatherDetails.map((label) => (
          <div
            key={label}
            className="flex w-[10.21875rem] shrink-0 flex-col items-start gap-300 rounded-12 bg-neutral-800 p-250 shadow-[inset_0_0_0_1px_var(--color-neutral-600)] tablet:w-auto tablet:min-w-0 tablet:flex-1">
            <p className="text-preset-6 text-neutral-200">{label}</p>
            <p className="text-preset-3">–</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-between ${className ?? ""}`} role="status" aria-label="Loading">
      <span className="size-3 animate-bounce rounded-full bg-white opacity-80 [animation-delay:-0.3s]" />
      <span className="size-3 animate-bounce rounded-full bg-white opacity-80 [animation-delay:-0.15s]" />
      <span className="size-3 animate-bounce rounded-full bg-white opacity-80" />
    </div>
  );
}
