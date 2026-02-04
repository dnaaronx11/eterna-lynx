# Eterna Lynx Hub

Backend skeleton for the EternaNet web2/web3 browser hub within the Lynx planar system. It exposes a lightweight Express server with middleware that enriches each request with request, web2, and web3 context and serves hub status endpoints.

## Getting started

```bash
npm install
npm start
```

Environment variables:

- `PORT` – port to listen on (default `3000`)
- `ETERNA_RPC_URL` – optional RPC endpoint to mark the hub as web3-enabled
- `ETERNA_PROJECT_ID` – optional project identifier included in the web3 context

## Endpoints

- `GET /health` – basic readiness probe
- `GET /hub` – returns request, web2, and web3 context summary
- `GET /hub/web3/status` – returns web3 connectivity snapshot

## Tests

Run the focused Node.js tests with:

```bash
npm test
```
