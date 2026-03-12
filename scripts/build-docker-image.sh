#! /bin/sh
IMAGE_NAME=fiagram_web_server
IMAGE_VERSION=$(cat ./VERSION)

docker build -t $IMAGE_NAME:$IMAGE_VERSION .