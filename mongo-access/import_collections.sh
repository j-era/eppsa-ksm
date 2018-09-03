#!/bin/bash

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
  mongoimport -h $HOST -d $DB -c $i --file ./export/$i.json --drop
done