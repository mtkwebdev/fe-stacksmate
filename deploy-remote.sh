#!/bin/bash -e
set -e;

export DEPLOYMENT=$1
PATH_DEPLOY=../radsoc/volumes/www/production/meshnet
mkdir -p $PATH_DEPLOY
export SERVER=hume.brightblock.org
export BUILDER=build-prod
if [ "$DEPLOYMENT" == "stag" ]; then
  SERVER=zeno.brightblock.org;
  BUILDER=build-stag
fi

printf "\n-----------------------------------------------------------------------------------------------------\n";
printf "Running script: $0 \n";
printf "Deploying to: $SERVER \n";
printf "\n-----------------------------------------------------------------------------------------------------\n";

function __build() {
  pushd $BUILD_PATH
  npm run $BUILDER
  popd;
  echo "Initialisation of $BUILD_PATH complete";
}

function __pushcode() {
  printf "\n- deploying from pipeline build \n";
  rsync -aP -e "ssh  -p 7019" $PATH_DEPLOY/* bob@$SERVER:/var/www/meshnet
}

BUILD_PATH=../fe-rpay
__build
cp $BUILD_PATH/dist/rpay-entry*.js $PATH_DEPLOY/.

BUILD_PATH=./
__build
cp -r ./dist/* $PATH_DEPLOY/.

SERVER=hume.brightblock.org
__pushcode
SERVER=zeno.brightblock.org
__pushcode

exit 0;
