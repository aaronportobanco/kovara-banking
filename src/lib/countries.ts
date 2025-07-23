import { getStates, getCities } from "state-cities";

// Obtenemos todos los estados de Estados Unidos
export const usStates = getStates("US");

/**
 * Obtiene las ciudades para un estado específico de EE. UU.
 * @param stateName - El nombre del estado.
 * @returns Un array de nombres de ciudades.
 */
export const getCitiesByState = (stateName: string) => {
  if (!stateName) return [];
  // La librería devuelve objetos de ciudad, extraemos solo los nombres.
  const cities = getCities("US", stateName);
  return cities.map((city) => city.name);
};