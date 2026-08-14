# ---- deps ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts

# ---- build ----
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- prod deps ----
FROM node:22-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts --omit=dev

# ---- runtime ----
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/web ./web

EXPOSE 3000
CMD ["node", "dist/main"]
