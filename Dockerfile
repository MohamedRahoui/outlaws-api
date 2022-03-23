FROM node:14-alpine as builder
WORKDIR /app
COPY package.json yarn.lock ecosystem.config.js ./
COPY tsconfig*.json custom.d.ts ./
COPY prisma ./prisma/
# COPY .env.dev ./.env
RUN yarn install --frozen-lockfile
COPY src ./src
RUN yarn prisma generate
# RUN yarn prisma migrate dev
RUN yarn build

FROM node:14-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json /app/yarn.lock /app/ecosystem.config.js  ./
COPY --from=builder /app/dist ./dist

RUN npm install pm2 -g

USER 1000
EXPOSE 8000
CMD ["pm2-runtime", "ecosystem.config.js"]

