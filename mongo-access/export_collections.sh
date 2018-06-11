#!/bin/bash

rm -rf export

declare -a COLLECTIONS=(
  "games"
  "challenge-1"
  "challenge-2"
  "challenge-3"
  "challenge-4"
  "challenge-5"
  "challenge-6"
  "challenge-7"
  "challenge-8"
  "challenge-9"
  "challenge-10"
  "challenge-11"
)

for i in "${COLLECTIONS[@]}"
do
  mongoexport --host $HOST -d $DB -c $i -o ./export/$i.json
done