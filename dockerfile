FROM node:14.16.0-alpine3.13
# RUN addgroup app && adduser -S -G app app
# USER app
WORKDIR /app
COPY package*.json .
COPY yarn.lock .
RUN yarn
COPY . .
EXPOSE 4500
CMD ["yarn", "start"]