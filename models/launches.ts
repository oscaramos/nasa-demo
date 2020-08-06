import * as log from 'https://deno.land/std/log/mod.ts';
import * as R from 'https://cdn.skypack.dev/ramda@^0.27.0';

interface Launch {
  flightNumber: number;
  mission: string;
  rocket: string;
  customers: Array<string>;
  launchDate: number;
  upcoming: boolean;
  success?: boolean;
  target?: string;
}


const launches = new Map<number, Launch>()


export async function downloadLaunchData() {
  log.info("Downloading launch data....");
  log.warning("Downloading launch data....");
  const response = await fetch("https://api.spacexdata.com/v3/launches/");

  if (!response.ok) {
    log.warning("Problem downloading launch data.")
    throw new Error("Launch data download failed");
  }

  const launchData = await response.json();
  for (const launch of launchData) {
    const payloads = launch["rocket"]["second_stage"]["payloads"]
    const customers = R.chain((payload: any) => payload["customers"])(payloads)

    const flightData: Launch = {
      flightNumber: launch["flight_number"],
      mission: launch["mission_name"],
      rocket: launch["rocket"]["rocket_name"],
      launchDate: launch["launch_date_unix"],
      upcoming: launch["upcoming"],
      success: launch["launch_success"],
      customers,
    }

    launches.set(flightData.flightNumber, flightData);
  }
}


await downloadLaunchData();

log.info(`Downloaded for data for ${launches.size} SpaceX launches.`)

export function getAll() {
  return Array.from(launches.values());
}

export function getOne(id: number) {
  if (launches.has(id)) {
    return launches.get(id);
  }
  return null
}
export function addOne(data: Launch) {
   launches.set(data.flightNumber, {...data,
     upcoming: true,
     customers: ["Oscar's SAC", "NASA"]
   });
}

export function removeOne(id: number) {
  const aborted = launches.get(id);
  if (aborted) {
    aborted.upcoming = false;
    aborted.success = false;
    return aborted
  }
}
