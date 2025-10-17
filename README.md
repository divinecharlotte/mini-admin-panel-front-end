# Description
Frontend — Mini Admin Panel (React + TypeScript)Display verified users and a 7‑day user creation chart by consuming the backend.

## Data sources:
- GET /users/export (protobuf, application/x-protobuf)
- GET /users/stats/last7days (JSON)
- GET /keys/public (PEM public key for signature verification)

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# watch mode
$ npm run dev

```