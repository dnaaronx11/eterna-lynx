#!/bin/sh
service_name=${SERVICE_NAME:-service}

echo "[scaffold] ${service_name} booting $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "[scaffold] Non-production placeholder. Replace with real service logic."

while true; do
  echo "[scaffold] ${service_name} heartbeat $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  sleep 30
done
