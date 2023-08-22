FROM node:16-alpine

RUN apk add --no-cache tini

WORKDIR /app

COPY ./package*.json ./

RUN npm ci && npm cache clean --force

COPY . .

ENTRYPOINT [ "tini", "--" ]

CMD ["npm", "run", "dev"]