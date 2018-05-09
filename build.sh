#!/bin/bash
set -e

export CONTENT_SERVER_URI=https://content-server.${HOST}
export ASSET_SERVER_URI=https://asset-server.${HOST}
export GAME_SERVER_URI=https://game-server.${HOST}
export FONT_URI=https://static.${HOST}/fonts
export STATIC_SERVER_URI=https://static.${HOST}
BASEDIR="$( cd "$( dirname "$0" )" && pwd )"
echo $BASEEDIR
declare -a SITES=(
  "game-client"
  "game-challenge/button"
  "game-challenge/clicker"
  "game-challenge/graph"
  "game-challenge/hidden"
  "game-challenge/quiz"
  "game-challenge/skill"
  "game-challenge/sorting"
)

for i in "${SITES[@]}"
do
  cd $BASEDIR/$i
  if [ -d node_modules ]
  then
    rm -rf node_modules
  fi
  npm install
  npm run build
done
