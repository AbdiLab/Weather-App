import { CheckIcon, DropdownIcon, UnitsIcon } from "../Icons";
import logo from "../../assets/images/logo.svg";
import useToggleDropdown from "../../hooks/useToggleDropdown";
import { useUnitsContext } from "../../App";

export default function Header() {
  const { dropdownRef, isOpen, toggle } = useToggleDropdown();

  return (
    <header className="flex w-full items-center justify-between">
      <img src={logo} alt="Weather Now logo" className="h-7 w-auto tablet:h-10" />
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={toggle}
          className="flex items-center gap-075 rounded-6 bg-neutral-800 focus-visible:shadow-primary px-125 py-100 text-preset-8 hover:bg-neutral-700 tablet:gap-125 tablet:rounded-8 tablet:px-200 tablet:py-150 tablet:text-preset-7">
          <UnitsIcon className="size-3.5 tablet:size-4" />
          <span>Units</span>
          <DropdownIcon className="size-2.5 tablet:size-3" />
        </button>

        {isOpen && <UnitsDropdown />}
      </div>
    </header>
  );
}

function UnitsDropdown() {
  const { units, switchSystem, setUnits } = useUnitsContext();

  return (
    <div className="absolute right-0 top-full z-10 mt-100 flex w-53.5 flex-col items-start gap-050 rounded-12 border border-neutral-600 bg-neutral-800 px-100 py-075 drop-shadow-[0px_8px_8px_rgba(2,1,44,0.32)]">
      <button
        type="button"
        className="dropdown-btn text-preset-7 flex w-full items-center gap-125 rounded-8 px-100 py-125 text-left"
        onClick={switchSystem}>
        Switch to {units.system === "Metric" ? "Imperial" : "Metric"}
      </button>

      <div className="flex w-full flex-col items-start gap-100">
        <p className="text-preset-8 px-100 pt-075 text-neutral-300">Temperature</p>

        <UnitOptions
          activeValue={units.temperature}
          options={[
            { label: "Celsius (°C)", value: "celsius" },
            { label: "Fahrenheit (°F)", value: "fahrenheit" },
          ]}
          onSelect={(value) =>
            setUnits((c) => ({ ...c, temperature: value as "celsius" | "fahrenheit" }))
          }
        />
      </div>

      <div className="h-px w-full bg-neutral-600" />

      <div className="flex w-full flex-col items-start gap-100">
        <p className="text-preset-8 px-100 pt-075 text-neutral-300">Wind Speed</p>

        <UnitOptions
          activeValue={units.windSpeed}
          options={[
            { label: "km/h", value: "kmh" },
            { label: "mph", value: "mph" },
          ]}
          onSelect={(value) => setUnits((c) => ({ ...c, windSpeed: value as "kmh" | "mph" }))}
        />
      </div>

      <div className="h-px w-full bg-neutral-600" />

      <div className="flex w-full flex-col items-start gap-100">
        <p className="text-preset-8 px-100 pt-075 text-neutral-300">Precipitation</p>

        <UnitOptions
          activeValue={units.precipitation}
          options={[
            { label: "Millimeters (mm)", value: "mm" },
            { label: "Inches (in)", value: "inch" },
          ]}
          onSelect={(value) => setUnits((c) => ({ ...c, precipitation: value as "mm" | "inch" }))}
        />
      </div>
    </div>
  );
}

type Option = { label: string; value: string };
type UnitOptionsProps = {
  options: Option[];
  activeValue: string;
  onSelect: (value: string) => void;
};

function UnitOptions({ options, activeValue, onSelect }: UnitOptionsProps) {
  return (
    <div className="flex w-full flex-col items-start gap-050">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`dropdown-btn text-preset-7 flex w-full items-center gap-125 rounded-8 ${activeValue === opt.value && "bg-neutral-700"} px-100 py-125 text-left`}
          onClick={() => onSelect(opt.value)}>
          <span className="min-w-0 flex-1">{opt.label}</span>
          {activeValue === opt.value && <CheckIcon className="size-3.5 shrink-0" />}
        </button>
      ))}
    </div>
  );
}
