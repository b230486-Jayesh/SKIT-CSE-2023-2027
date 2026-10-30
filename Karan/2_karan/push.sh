#!/usr/bin/env bash
# Karan Jangid — RailOptima
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
git checkout -b feature/backend-api 2>/dev/null || git checkout feature/backend-api

cp -r "$PACKET"/. .

git add -- "server.js"
git diff --cached --quiet || git commit -q -m "feat(backend): set up Express server with CORS and JSON middleware"
echo "committed: feat(backend): set up Express server with CORS and JSON middleware"

git add -- "src/models/TrainRoute.js"
git diff --cached --quiet || git commit -q -m "feat(backend): add Mongoose TrainRoute schema for planned routes"
echo "committed: feat(backend): add Mongoose TrainRoute schema for planned routes"

git add -- "routes/trainRoutes.js" "public/server2.js"
git diff --cached --quiet || git commit -q -m "feat(backend): add REST endpoints to save and fetch train routes"
echo "committed: feat(backend): add REST endpoints to save and fetch train routes"

git add -- "routes/graphRouter.js"
git diff --cached --quiet || git commit -q -m "feat(backend): expose Dijkstra plan-route endpoint via graph router"
echo "committed: feat(backend): expose Dijkstra plan-route endpoint via graph router"

git add -- "src/utils/weather.js" ".env.example"
git diff --cached --quiet || git commit -q -m "chore(backend): add weather API client and environment variable template"
echo "committed: chore(backend): add weather API client and environment variable template"

git push -u origin feature/backend-api

echo
echo "Pushed. Ab GitHub pe jao, Pull Request kholo, aur merge karo."
