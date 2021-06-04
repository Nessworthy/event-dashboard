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


The resource service is exposed on port `8080`.

The authorization service is exposed on port `8081`.

The dashboard is exposed on port `8082`.

