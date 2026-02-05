#!/bin/bash

#PRODUCTION

git reset --hard
git checkout master
git pull origin master

docker stop  carento-api
docker rm carento-api
docker stop  carento-batch
docker rm carento-batch


docker compose up -d