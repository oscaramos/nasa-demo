import * as log from 'https://deno.land/std/log/mod.ts';
import * as R from 'https://cdn.skypack.dev/ramda@^0.27.0';

interface Launch {
  flightNumber: number;
  mission: string;
  rocket: string;
  customers: Array<string>;
}

const launches = new Map<number, Launch>()

// custom configuration with 2 loggers (the default and `tasks` loggers)
await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"),
  },

  loggers: {
    // configure default logger available via short-hand methods above
    default: {
      level: "DEBUG",
      handlers: ["console"],
    },
  },
});

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

    const flightData = {
      flightNumber: launch["flight_number"],
      mission: launch["mission_name"],
      rocket: launch["rocket"]["rocket_name"],
      customers
    }

    launches.set(flightData.flightNumber, flightData);

    log.info(JSON.stringify(flightData))
  }
}

if (import.meta.main) {
  await downloadLaunchData();
  log.info(JSON.stringify(import.meta))
  log.info(`Downloaded for data for ${launches.size} SpaceX launches.`)
}


