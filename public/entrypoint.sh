sed -i -e 's/\/api\/v1/'$BACKEND_URL'/g' /usr/share/nginx/html/js/index.js
nginx -g 'daemon off;'
