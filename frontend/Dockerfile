FROM node:20-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

---

### Step 8 — Create `.dockerignore` in `backend` folder
```
venv/
__pycache__/
*.pyc
.env
.pytest_cache/
```

### Step 9 — Create `.dockerignore` in `frontend` folder
```
node_modules/
.next/
.env.local
.env