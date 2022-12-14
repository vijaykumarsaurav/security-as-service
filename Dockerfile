FROM node AS prod
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# RUN npm test - if you want to test before to build
RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine
WORKDIR /usr/share/nginx/html
COPY --from=prod /app/build .
#COPY ./env.sh .
#COPY .env .
#RUN apk add --no-cache bash
#RUN chmod +x env.sh
EXPOSE 80
# run nginx with global directives and daemon off
#CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
ENTRYPOINT ["nginx", "-g", "daemon off;"]
