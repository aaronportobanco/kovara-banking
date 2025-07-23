declare module "state-cities" {
  interface City {
    name: string;
    state: string;
    country: string;
  }

  export function getStates(countryCode: string): string[];
  export function getCities(countryCode: string, stateName: string): City[];
}