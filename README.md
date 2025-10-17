# Description
Frontend — Mini Admin Panel (React + TypeScript)Display verified users and a 7‑day user creation chart by consuming the backend.

## Data sources:
- GET /users/export (protobuf, application/x-protobuf)
- GET /users/stats/last7days (JSON)
- GET /keys/public (PEM public key for signature verification)

## Project setup

```
git clone https://github.com/divinecharlotte/mini-admin-panel-front-end.git

cd mini-admin-panel-front-end

$ npm install
```

## Compile and run the project

```bash
# watch mode
$ npm run dev

```