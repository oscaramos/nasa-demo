# NASA Mission Control Deno Project

## Deployment

The project is available on: http://18.144.133.4:8000/index.html

It's deployed using this container hosted on docker hub and the hosting service using AWS EC2

## Installation

Ensure you have Deno installed: https://deno.land/

## Development

In the terminal, run: `deno run --allow-net --allow-read src/mod.ts`

## Docker

1. In the terminal, run: `docker build -t oscaramos/nasa-deno .`
2. Run `docker run -p 8000:8000 oscaramos/nasa-deno`

## Backend API

Ensure the backend is running by making a GET request to http://localhost:8000/

## Front End

Browse to the Mission Control front end at http://localhost:8000/index.html and schedule an interstellar mission launch!

## Requests

You can access the requests that were used. 
Using postman import a collection from `postman/NasaDeno.postman_collection.json` 
then make the requests supported for this system.
