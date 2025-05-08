import { useEffect, useState } from "react";
import { CONTINENT_COUNTRY_MAP } from "../lib/continentCountryMap";


export function useContinentFromCountry(country) {
  const [continent, setContinent] = useState("");

  useEffect(() => {
    const lower = country.toLowerCase().trim();
    for (const [name, countries] of Object.entries(CONTINENT_COUNTRY_MAP)) {
      if (countries.includes(lower)) {
        setContinent(name);
        return;
      }
    }
    setContinent(""); 
  }, [country]);

  return continent;
}
