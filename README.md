# Jobs - [chile.sh](https://jobs.chile.sh)

Simple job searching and listing tool, it scrapes jobs from [getonbrd](https://www.getonbrd.com/) and gets their hidden salaries in USD and CLP.

For an easier development, use [this docker-compose config](https://github.com/chile-sh/docker-common), since it comes with Postgres, RabbitMQ, and Redis, with the default environment variables used on the example env file, and the same network config.

## Pre-requisites

- Node 11+
- Yarn
- Docker (with docker-compose)

## Clone & Install

```bash
git clone git@github.com:chile-sh/jobs-server.git

cd jobs-server && yarn
```

## Config

```bash
# Modify with your own env vars
cp .env.example .env

# Don't forget to set a default getonbrd session
# You can extract the token from the _getonboard_session cookie on your browser
GETONBRD_SESSION=...
```

> **Note**: If you want to run TypeScript outside docker, set `RMQ_HOST` and `PG_HOST` to `localhost`

### Run

Live reload with `nodemon`:

```bash
yarn dev
```

## Run and develop using Docker (TODO)

```bash
yarn docker:build-dev

# Development
yarn docker:dev

# or run it in background
yarn docker:dev -d

# to see real-time logs when running in background
docker logs -f jobs-server-dev
```

## Run in production

```bash
# Set environment variables, then
yarn docker:build && yarn docker:prod
```

## Test

```bash
yarn test
```

# License

GNU General Public License v3.0

