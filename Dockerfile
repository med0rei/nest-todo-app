FROM node:lts-trixie-slim
WORKDIR /app

COPY ["package.json", "pnpm-lock.yaml", "./"]
RUN npm install -g pnpm && pnpm install --frozen-lockfile

EXPOSE 3000

RUN useradd app
USER app

CMD ["pnpm", "start"]
