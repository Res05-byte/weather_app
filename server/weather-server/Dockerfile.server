FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --omit=dev

COPY . .

ENV PORT=4000
ENV HOST=0.0.0.0

EXPOSE 4000

CMD ["node", "controllers/index.js"]