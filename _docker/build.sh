#!/bin/sh
echo "docker build process..."

docker build -t ${IMAGE_NAME} --no-cache .
docker tag ${IMAGE_NAME} ${REGISTRY_ADDRESS}/${IMAGE_NAME}