#!/bin/sh

echo "docker deploy to registry process..."
docker push ${REGISTRY_ADDRESS}/${IMAGE_NAME}
