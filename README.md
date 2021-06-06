# event-dashboard

This project is split into several services:

* `event-seeder` - Generates and dispatches periodic event data to the resource service.
* `event-resource` - Provides an API to submit and extract event data.
* `event-storage` - Persistent storage mechanism for event data.
* `authorization` - Acts as the authorizing body to use the resource service.
* `dashboard` - Visual representation of event data.

## Requirements

* Docker

## Usage

Run `docker-compose up` in the root directory, it should set up the rest.
Running for the first time may take a little longer.

Head to http://127.0.0.1:8082 to see the dashboard.

For debugging, the MySQL server is exposed on port `3306` on localhost.

The resource service is exposed on port `8080`.

The authorization service is exposed on port `8081`, though this is unused by the front end at present.

The dashboard is exposed on port `8082`.

Note - fake credentials are committed in this repo - this was done on the basis of this being
a completely fake test service, and not having the time to properly pull them out / use them properly.

Don't forget to remove volumes with `docker-compose down -v` after using.
