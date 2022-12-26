#!/bin/bash

docker-compose rm -svf

TOPIC='assignments' MAIN_SERVER_PORT=4000 SOCKET_PORT=3000 docker-compose up
