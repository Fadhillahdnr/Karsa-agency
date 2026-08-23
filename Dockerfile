# Development image: runs `nuxt dev` with HMR. Source code is bind-mounted
# in via docker-compose.yml, so this image only needs to provide the
# runtime + toolchain + a dependency install baked in at build time.
FROM node:22-bookworm-slim

# python3/make/g++ are required by node-gyp to build native modules
# (better-sqlite3 for Nuxt Content, esbuild) — without these, `pnpm install`
# fails or falls back to a broken prebuilt binary.
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@11.9.0 --activate

WORKDIR /app

# Install dependencies first so this layer is cached across image rebuilds
# as long as the lockfile doesn't change (source code changes never bust it).
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the source so the image is runnable standalone too
# (docker-compose overrides this with a live bind mount for dev).
COPY . .

# Host/port are set via env (read by Nitro's listener), not CLI flags:
# forwarding flags through `pnpm dev -- --host ...` is fragile — an extra
# `--` reaching nuxi's CLI gets parsed as its positional [DIR] argument,
# which silently scaffolds and serves a brand-new empty project instead of
# this one. Env vars sidestep that parsing entirely.
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

CMD ["pnpm", "dev"]
