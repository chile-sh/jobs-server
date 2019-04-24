# Jobs - [chile.sh](https://jobs.chile.sh)

Simple job searching and listing tool, it scrapes jobs from [getonbrd](https://www.getonbrd.com/) and gets their hidden salaries in USD and CLP.

For an easier development, use [this docker-compose config](https://github.com/chile-sh/docker-common), since it comes with Postgres, RabbitMQ, and Redis, with the default environment variables used on the example env file, and the same network config.

## Clone & Install

```bash
git clone git@github.com:chile-sh/jobs-server.git

cd jobs-server && yarn
```

## Config

```bash
# Modify with your own env vars
cp .env.example .env
```

## Run and develop using Docker

```bash
docker build --no-cache -t jobs .

# Development
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up -d

# to see real-time logs
docker logs -f jobs-server-dev

# Production
docker-compose -f docker/docker-compose.yml up -d
```

# License

MIT
