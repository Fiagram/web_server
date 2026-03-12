#! /bin/sh
IMAGE_NAME=fiagram_web_server
IMAGE_VERSION=$(cat ./VERSION)

docker run -p 3000:3000 $IMAGE_NAME:$IMAGE_VERSION