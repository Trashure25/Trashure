#!/bin/bash

echo "Cleaning up dependencies..."
rm -rf node_modules
rm -f package-lock.json
rm -f pnpm-lock.yaml

echo "Installing dependencies with correct versions..."
npm install

echo "Dependencies fixed! You can now run: npm run build" 