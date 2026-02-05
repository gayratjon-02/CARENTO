#!/bin/bash

#PRODUCTION

git reset --hard
git checkout master
git pull origin master

docker stop  carento-api
docker remofe  carento-api
docker stop  carento-batch
docker remove carento-batch


docker compose up -d