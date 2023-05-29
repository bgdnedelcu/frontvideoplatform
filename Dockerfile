FROM nginx:alpine
WORKDIR /app
RUN rm -rf /usr/share/nginx/html/*
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./build /usr/share/nginx/html
ENTRYPOINT ["nginx", "-g", "daemon off;"]