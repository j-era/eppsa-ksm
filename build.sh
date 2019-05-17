#!/bin/bash
set -e

export CONTENT_SERVER_URI=https://content-server.${HOST}
export ASSET_SERVER_URI=https://asset-server.${HOST}
export FONT_URI=https://static.${HOST}/fonts
export STATIC_SERVER_URI=https://static.${HOST}
export MONGO_ACCESS_URI=https://mongo.${HOST}
BASEDIR="$( cd "$( dirname "$0" )" && pwd )"

declare -a SITES=(
  "game-client"
  "game-challenge/clicker"
  "game-challenge/graph"
  "game-challenge/hidden"
  "game-challenge/quiz"
  "game-challenge/skill"
  "game-challenge/sorting"
  "game-challenge/astragal"
)

for i in "${SITES[@]}"
do
  cd $BASEDIR/$i
  npm install
  npm run build
done
