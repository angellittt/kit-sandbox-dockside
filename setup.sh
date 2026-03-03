#!/bin/bash

DOCKER_NETWORK_NAME="ttt_network"

# Create a docker network if it doesn't already exist
if docker network ls --format '{{.Name}}' | grep -w "$DOCKER_NETWORK_NAME" > /dev/null 2>&1; then
  echo "Docker network '$DOCKER_NETWORK_NAME' already exists."
else
  echo "Creating Docker network '$DOCKER_NETWORK_NAME'..."
  docker network create "$DOCKER_NETWORK_NAME"
  echo "Docker network '$DOCKER_NETWORK_NAME' created."
fi