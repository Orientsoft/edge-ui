FROM nginx

COPY build /usr/share/nginx/html
CMD ["chmod", "0777", "/usr/share/nginx/html/entrypoint.sh"]
ENTRYPOINT ["/usr/share/nginx/html/entrypoint.sh"]
