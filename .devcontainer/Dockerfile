FROM oven/bun:latest

WORKDIR /app
COPY . .

RUN apt-get update && apt-get install -y git

CMD [ "bun", "run", "dev" ]
