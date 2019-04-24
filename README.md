# Jobs - [Chile.sh](https://jobs.chile.sh)

## Clone & Install

```bash
git clone git@github.com:chile-sh/jobs-server.git

cd jobs-server && yarn
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
