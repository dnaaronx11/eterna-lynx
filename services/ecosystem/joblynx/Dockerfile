# Non-production scaffold for EternaLynX Node-based services.
# Replace with hardened build stages, dependency pinning, and runtime controls.
FROM node:20-alpine
WORKDIR /app
COPY app.js /app/app.js
ENV NODE_ENV=development
CMD ["node", "/app/app.js"]
