#!/usr/bin/env bash
# Jayesh Kanojia — RailOptima
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
git checkout -b feature/frontend-dashboard 2>/dev/null || git checkout feature/frontend-dashboard

cp -r "$PACKET"/. .

git add -- "package.json" "package-lock.json" "vite.config.js" "eslint.config.js" "postcss.config.js" "taiwind.config.js" "index.html" ".gitignore"
git diff --cached --quiet || git commit -q -m "chore: scaffold React + Vite project with Tailwind and ESLint"
echo "committed: chore: scaffold React + Vite project with Tailwind and ESLint"

git add -- "src/main.jsx" "src/index.css" "src/App.css"
git diff --cached --quiet || git commit -q -m "feat: add app entry point and base stylesheets"
echo "committed: feat: add app entry point and base stylesheets"

git add -- "src/components/Navbar.jsx" "src/components/Sidebar.jsx" "src/components/Card.jsx" "src/components/TrafficCard.jsx"
git diff --cached --quiet || git commit -q -m "feat(ui): add sidebar, navbar and reusable card components"
echo "committed: feat(ui): add sidebar, navbar and reusable card components"

git add -- "src/App.jsx"
git diff --cached --quiet || git commit -q -m "feat(ui): wire React Router routes and main app shell"
echo "committed: feat(ui): wire React Router routes and main app shell"

git add -- "src/components/TrainMap.jsx" "src/pages/Dashboard.jsx"
git diff --cached --quiet || git commit -q -m "feat(map): add Leaflet train map and live traffic dashboard"
echo "committed: feat(map): add Leaflet train map and live traffic dashboard"

git add -- "src/components/TrackAnimation.jsx" "src/components/WeatherAnimation.jsx"
git diff --cached --quiet || git commit -q -m "feat(ui): add track allocation and weather animations"
echo "committed: feat(ui): add track allocation and weather animations"

git add -- "src/pages/Trains.jsx"
git diff --cached --quiet || git commit -q -m "feat(ui): add train search page"
echo "committed: feat(ui): add train search page"

git add -- "public/vite.svg" "src/assets/react.svg"
git diff --cached --quiet || git commit -q -m "chore: add static assets"
echo "committed: chore: add static assets"

git add -- "README.md"
git diff --cached --quiet || git commit -q -m "docs: add project README"
echo "committed: docs: add project README"

git push -u origin feature/frontend-dashboard

echo
echo "Pushed. Ab GitHub pe jao, Pull Request kholo, aur merge karo."
