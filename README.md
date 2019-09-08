# Repository archived

This repository holds an obsolete version of [airspaces.app](https://airspaces.app).

The repository for Airspaces is located at [foucdeg/airspaces](https://github.com/foucdeg/airspaces).

For any questions, you are welcome to either post an issue on [foucdeg/airspaces](https://github.com/foucdeg/airspaces) or send me an email at foucauld.degeorges@gmail.com .

# Airspaces client

This is the frontend of [Airspaces](https://airspaces.app) - both its Electron and hosted version.

### Installing this repo locally:

You probably want to install this as part of the [Electron](https://github.com/foucdeg/x-plane-map-electron) or [hosted](https://github.com/foucdeg/x-plane-map-api) app, in which case you should follow either repository's README.

Just in case, here are instructions for installing the client by itself:

```
git clone git@github.com/foucdeg/x-plane-map-client.git
cd x-plane-map-client
yarn
```

Generate a valid HTTPS certificate for localhost. I recommend [mkcert](https://github.com/FiloSottile/mkcert).
Place the certificate at `./localhost.pem` and the key as `localhost-key.pem`.

And finally: `yarn start`. The client should run on https://localhost:8080.
