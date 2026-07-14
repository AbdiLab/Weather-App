import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { SearchIcon, SpinnerIcon } from "../Icons";
import type { SearchedCities } from "../../utils/types";
import { useWeatherDataContext } from "../../App";

type SearchProps = {
  setIsNotFound: (t: boolean) => void;
};
export default function Search({ setIsNotFound }: SearchProps) {
  const [searchedCities, setSearchedCities] = useState<SearchedCities[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = formData.get("search-place") as string;

    try {
      setIsLoading(true);
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${input}&count=5&language=en&format=json`,
      );
      const { results } = await res.json();

      if (results === undefined || results.length === 0) {
        setIsNotFound(true);
        setSearchedCities(undefined);
        return;
      }

      setSearchedCities(results);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex w-full flex-col items-start gap-150 tablet:flex-row tablet:gap-200 desktop:w-164">
      <div className="relative w-full tablet:min-w-0 tablet:flex-1">
        <label
          htmlFor="search-place"
          className="flex w-full items-center gap-200 rounded-12 bg-neutral-800 px-300 py-200 hover:bg-neutral-700 focus-within:shadow-primary">
          <SearchIcon className="size-5 shrink-0 text-neutral-200" />
          <input
            required
            id="search-place"
            name="search-place"
            type="text"
            placeholder="Search for a place..."
            className="text-preset-5-medium w-full bg-transparent text-neutral-200 outline-none placeholder:text-neutral-200"
          />
        </label>

        {isLoading ? (
          <LoadingSearch />
        ) : (
          <>
            {searchedCities !== undefined && (
              <SearchDropdown
                setIsNotFound={setIsNotFound}
                citySuggestions={searchedCities}
                onClose={() => setSearchedCities(undefined)}
              />
            )}
          </>
        )}
      </div>
      <button
        type="submit"
        className="text-preset-5-medium w-full shrink-0 rounded-12 bg-blue-500 px-300 py-200 hover:bg-blue-700 tablet:w-auto focus-visible:shadow-[0px_0px_0px_3px_var(--color-neutral-900),0px_0px_0px_5px_var(--color-blue-500)]">
        Search
      </button>
    </form>
  );
}

type SearchDropdownProps = {
  citySuggestions: SearchedCities[];
  onClose: () => void;
  setIsNotFound: (t: boolean) => void;
};

function SearchDropdown({ citySuggestions, onClose, setIsNotFound }: SearchDropdownProps) {
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const { getCoordinates } = useWeatherDataContext();
  useEffect(() => {
    function eventClick(e: Event) {
      if (
        e.target instanceof Node &&
        searchDropdownRef.current !== null &&
        searchDropdownRef.current.contains(e.target)
      ) {
        return;
      }
      onClose();
    }

    document.body.addEventListener("click", eventClick);

    return () => {
      document.body.removeEventListener("click", eventClick);
    };
  }, []);

  return (
    <div
      className="absolute inset-x-0 top-full z-10 mt-100 flex flex-col items-start gap-050 rounded-12 border border-neutral-800 bg-neutral-800 p-100"
      ref={searchDropdownRef}>
      {citySuggestions.map((city) => (
        <button
          onClick={() => {
            getCoordinates({ latitude: city.latitude, longitude: city.longitude });
            onClose();
            setIsNotFound(false);
          }}
          key={city.id}
          type="button"
          className="dropdown-btn text-preset-7 w-full rounded-8 px-100 py-125 text-left border border-inherit hover:border-neutral-600">
          {city.name}
        </button>
      ))}
    </div>
  );
}

function LoadingSearch() {
  return (
    <div className="absolute inset-x-0 top-full z-10 mt-100 flex w-full flex-col items-start gap-050 rounded-12 border border-neutral-700 bg-neutral-800 p-100">
      <div className="text-preset-7 flex w-full items-center gap-125 rounded-8 px-100 py-125">
        <SpinnerIcon className="size-4 shrink-0 animate-spin" />
        Search in progress
      </div>
    </div>
  );
}
