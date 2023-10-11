ARG NODE_VERSION=18
FROM node:${NODE_VERSION}-slim AS base
ENV NODE_PATH="/qa"
RUN corepack enable
WORKDIR /qa
COPY . /qa

RUN pnpm install
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
