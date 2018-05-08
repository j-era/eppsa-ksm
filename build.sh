#!/bin/bash
set -e

BASEDIR="$( cd "$( dirname "$0" )" && pwd )"
declare -a SITES=(
  "game-client"
  "game-challenge/boat"
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
  npm install
  npm run build
done
