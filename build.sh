#!/bin/bash -e

export SERVICE=$1

PATH_DEPLOY=../radsoc/volumes/www/development/meshnet
mkdir -p $PATH_DEPLOY

printf "\n-----------------------------------------------------------------------------------------------------\n";
printf "Running script: $0 \n";
printf "Deploying to: $PATH_DEPLOY \n";
printf "\n-----------------------------------------------------------------------------------------------------\n";

function __build() {
  pushd $BUILD_PATH
  npm run build
  popd;
  echo "------------------------------------------------------------------------------";
  echo "Initialisation of $BUILD_PATH complete";
}

if [ -z "${SERVICE}" ]; then
  rm -rf $PATH_DEPLOY/*
  BUILD_PATH=../fe-rpay
  __build
  cp $BUILD_PATH/dist/rpay-entry*.js $PATH_DEPLOY/.

  BUILD_PATH=./
  __build
  cp -r dist/* $PATH_DEPLOY/.
fi

if [ "$SERVICE" == "lsat" ]; then
  BUILD_PATH=../fe-rpay
  __build
  cp $BUILD_PATH/dist/rpay-entry*.js $PATH_DEPLOY/.
fi
if [ "$SERVICE" == "mesh" ]; then
  BUILD_PATH=./
  __build
  cp -r dist/* $PATH_DEPLOY/.
fi

exit 0;
