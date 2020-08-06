// @ts-nocheck
import { join, BufReader, parse, R, log } from '../deps.ts';

type Planet = Record<string, string>

let planets: Array<Planet>;

// @ts-ignore
export const filterHabitablePlanets = (planets: array<Planet>) => R.filter((planet: Planet) => {
  const disposition = planet["koi_disposition"];
  const planetaryRadius = Number(planet["koi_prad"]);
  const stellarMass = Number(planet["koi_smass"]);
  const stellarRadius = Number(planet["koi_srad"]);

  return disposition === "CONFIRMED"
    && planetaryRadius > 0.5 && planetaryRadius < 1.5
    && stellarMass > 0.78 && stellarMass < 1.04
    && stellarRadius > 0.99 && stellarRadius < 1.01;
})(planets)


async function loadPlanetsData() {
  const path = join("data", "./kepler_exoplanets_nasa.csv");

  const file = await Deno.open(path);
  const bufReader = new BufReader(file);

  const result = await parse(bufReader, {
    header: true,
    comment: '#'
  });

  Deno.close(file.rid);

  const planets = filterHabitablePlanets(result as Array<Planet>);

  return R.map((planet: Planet) =>
    R.pick([
      "koi_prad",
      "koi_smass",
      "koi_srad",
      "kepler_name",
      "koi_count",
      "koi_steff",
      "koi_period"
    ], planet),
  planets);
}

planets = await loadPlanetsData();

log.info(`${planets.length} habitable planets found!`);

export function getAllPlanets() {
  return planets
}
