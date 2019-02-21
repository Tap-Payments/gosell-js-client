#!/bin/sh
# This is a comment!

echo "docker clean process..."

# docker rm -v $(docker ps -a -q -f status=exited)
if [ -n "$(docker ps -a -q -f status=exited)" ]; then
  docker rm -v $(docker ps -a -q -f status=exited)
fi

# docker rmi $(docker images -f "dangling=true" -q)
if [ -n "$(docker images -f "dangling=true" -q)" ]; then
  docker rm -v $(docker images -f "dangling=true" -q)
fi

# docker rmi -f ${IMAGE_NAME} ${REGISTRY_ADDRESS}/${IMAGE_NAME}
if [ ! -z "${APP_NAME}" ] && [ -n "$(docker images | grep "${APP_NAME}" | awk "{print \$3}")" ]; then
  docker rmi -f $(docker images | grep "${APP_NAME}" | awk "{print \$3}")
#   docker rmi -f ${IMAGE_NAME} ${REGISTRY_ADDRESS}/${IMAGE_NAME}
fi

# docker rmi $(docker images | grep "<none>" | awk "{print \$3}")
if [ -n "$(docker images | grep "<none>" | awk "{print \$3}")" ]; then
  docker rmi $(docker images | grep "<none>" | awk "{print \$3}")
fi


