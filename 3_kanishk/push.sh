#!/usr/bin/env bash
# Kanishk Singh Bagar — RailOptima
# Run this INSIDE your own clone of the team repo.
#   git clone <repo-url> && cd <repo> && git pull origin main
# Then copy this folder's 'files' directory next to this script and run:
#   bash push.sh
set -e

PACKET="$(cd "$(dirname "$0")" && pwd)/files"
[ -d "$PACKET" ] || { echo "files/ folder not found next to push.sh"; exit 1; }
[ -d .git ] || { echo "Run this from inside the cloned repo."; exit 1; }

git fetch origin
git checkout main 2>/dev/null || git checkout -b main
git pull origin main --rebase 2>/dev/null || true
git checkout -b feature/route-optimizer 2>/dev/null || git checkout feature/route-optimizer

cp -r "$PACKET"/. .

git add -- "src/stations.json"
git diff --cached --quiet || git commit -q -m "feat(algo): add rail network graph and station coordinate dataset"
echo "committed: feat(algo): add rail network graph and station coordinate dataset"

git add -- "src/pages/Root.jsx"
git diff --cached --quiet || git commit -q -m "feat(algo): implement Dijkstra route optimizer with disruption simulation"
echo "committed: feat(algo): implement Dijkstra route optimizer with disruption simulation"

git add -- "src/utils/conflictDetection.js"
git diff --cached --quiet || git commit -q -m "feat(algo): add time-buffer conflict detection between train routes"
echo "committed: feat(algo): add time-buffer conflict detection between train routes"

git add -- "src/graphapi.js"
git diff --cached --quiet || git commit -q -m "feat(algo): add frontend client for the plan-route graph API"
echo "committed: feat(algo): add frontend client for the plan-route graph API"

git add -- "src/utils/geocode.js"
git diff --cached --quiet || git commit -q -m "feat(algo): add Nominatim geocoding helper for station coordinates"
echo "committed: feat(algo): add Nominatim geocoding helper for station coordinates"

git push -u origin feature/route-optimizer

echo
echo "Pushed. Ab GitHub pe jao, Pull Request kholo, aur merge karo."
