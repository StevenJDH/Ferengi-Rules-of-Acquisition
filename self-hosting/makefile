DOCKER=docker
DOCKER_COMPOSE=docker-compose
PROJECT_NAME=ferengi-rules

# Default target.
.PHONY: all
all: start logs

# Start Docker Compose services. Pass clean=1 (e.g. make start clean=1) to do it without cached layers.
.PHONY: start
start:
	$(DOCKER_COMPOSE) --project-name $(PROJECT_NAME) -f ./local/docker-compose.yaml build $(if $(filter 1,$(clean)),--no-cache) && \
	$(DOCKER_COMPOSE) --project-name $(PROJECT_NAME) -f ./local/docker-compose.yaml up -d

# Stream all logs.
.PHONY: logs
logs:
	$(DOCKER_COMPOSE) --project-name $(PROJECT_NAME) -f ./local/docker-compose.yaml logs --follow

.PHONY: docker-down
docker-down:
	$(DOCKER_COMPOSE) --project-name $(PROJECT_NAME) -f ./local/docker-compose.yaml down --volumes --remove-orphans --timeout 5 $(FLAGS)

# Stop Docker Compose services with a grace period before forcefully stopping.
.PHONY: stop
stop: FLAGS=
stop: docker-down

# Clean up Docker Compose services, volumes, and cached images pulled by the compose file.
.PHONY: cleanup
cleanup: FLAGS=--rmi all
cleanup: docker-down

# Build release using multi-stage Dockerfile.
.PHONY: release
release:
	$(DOCKER) build -f ./release/Dockerfile -t $(PROJECT_NAME) .

# Start the built release.
.PHONY: start-release
start-release:
	$(DOCKER) run --name $(PROJECT_NAME) --rm -p 8080:80 $(PROJECT_NAME)
