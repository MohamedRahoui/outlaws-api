This is the official repository for the Moroccan Outlaws REST API

## Useful Commands

List Docker images:

```bash
docker image ls
```

Clean Docker images:

```bash
docker system prune -a
# and
dokku cleanup
```

Server disk:

```bash
df -h
```

Resources use:

```bash
htop
```

Show logs:

```bash
dokku logs web -t
```

Update NGINX to accept 20m files:

```bash
dokku nginx:set api client-max-body-size 50m
dokku proxy:build-config api
```
