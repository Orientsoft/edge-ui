FROM nginx

COPY build /usr/share/nginx/html
ADD entrypoint.sh /app/entrypoint.sh

WORKDIR /app

ENTRYPOINT ["./entrypoint.sh"]
