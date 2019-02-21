#!/bin/bash

echo "docker run process..."

# ./dockerRun.sh 1.0.0 go-schedule Vetri Vetri@123
echo "APP_VERSION : $1"
echo "APP_NAME : $2"
echo "DOCKERHUB_USER : $3"
echo "DOCKERHUB_PASS : $4"

export APP_VERSION=$1
export APP_NAME = $2
DOCKERHUB_USER = $3
DOCKERHUB_PASS = $4

echo "Vetri $APP_NAME app restart Process"
exit 1

cd /
pwd
cd /home/s.kumar/deploy
pwd

sh ./dockerClean.sh

echo "Login to docker registry..."
echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin "hub.docker.tap.company"

echo "Pull image from docker registry"
docker pull hub.docker.tap.company/tap/$APP_NAME:$APP_VERSION

echo "stop the service"
docker-compose -f deploy-docker-compose.yml down

echo "start the service"
docker-compose -f deploy-docker-compose.yml up -d --build

echo "All done ************************"
