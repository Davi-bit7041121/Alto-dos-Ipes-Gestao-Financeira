# Base44 Setup Notes

## Project Overview
This is a single static HTML file (`main.html`) — no build step, no backend, no dependencies.

## How to Run
`docker compose -f docker-compose.base44.yml up -d` serves `main.html` via nginx on port 3000.

## Verification
- `curl http://localhost:3000/` should return the HTML content.
- The page title is "Alto-dos-Ipes-Gestão-Financeira" (Portuguese).
