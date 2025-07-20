import countries from "world-countries";

export const formattedCountries = countries.map((country) => ({
  value: country.cca2, // código tipo "NI"
  label: country.name.common, // nombre legible
  flag: country.flag,
  callingCode: country.idd.root + (country.idd.suffixes?.[0] ?? ""),
}));
