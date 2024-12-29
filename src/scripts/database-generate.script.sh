#!/bin/sh

if [ -z "$1" ]; then
  echo "❌ Error: Migration name is required"
  echo "Usage: npm run database:generate <migration-name>"
  exit 1
fi


drizzle-kit generate --name="$1"