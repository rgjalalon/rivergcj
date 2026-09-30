#!/usr/bin/env bash
# Downloads the live-action footage and the score for the "18:00" film from Mixkit
# (free for commercial use under the Mixkit Stock Video Free License:
# https://mixkit.co/license/#videoFree). The clips are not committed to the
# repo, since that licence doesn't allow redistributing them as standalone files.
set -euo pipefail
cd "$(dirname "$0")/../public/wai/clinic"
mkdir -p footage
# clip id → what it is
clips=(
  22255 # windows switching off across a building at nightfall
  4629  # silhouette walking at sunset
  6434  # doctor working in her office (lead doctor)
  15048 # same doctor at her desk: typing, then sitting back
  29975 # doctor's hand writing on a pad
  6595  # same doctor high-fives a girl with her mother
  42653 # hands typing, laptop lid closes
)
for id in "${clips[@]}"; do
  f="footage/$id.mp4"
  [ -s "$f" ] && continue
  echo "fetching $id"
  curl -fsSL "https://assets.mixkit.co/videos/$id/$id-720.mp4" -o "$f"
done
# Score: "A New Life" by Eugenio Mininni (Mixkit Stock Music Free License).
mkdir -p music
[ -s music/543.mp3 ] || curl -fsSL "https://assets.mixkit.co/music/543/543.mp3" -o music/543.mp3
echo "footage and music ready in public/wai/clinic/"
