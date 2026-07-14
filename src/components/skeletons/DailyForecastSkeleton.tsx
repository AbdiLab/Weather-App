const dailyForecastCards = Array.from({ length: 7 });

export default function DailyForecastSkeleton() {
  return (
    <div className="flex w-full flex-col items-start gap-250">
      <p className="text-preset-5 w-full">Daily forecast</p>
      <div className="flex w-full flex-wrap items-center justify-center gap-200 tablet:flex-nowrap tablet:justify-start">
        {dailyForecastCards.map((_, index) => (
          <div
            key={index}
            className="h-41.25 w-[6.47875rem] shrink-0 overflow-hidden rounded-12 bg-neutral-800 shadow-[inset_0_0_0_1px_var(--color-neutral-600)] tablet:w-auto tablet:min-w-0 tablet:flex-1"
          />
        ))}
      </div>
    </div>
  );
}
