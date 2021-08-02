docker run -it --name opa-bundle-server --rm -p 8182:80 \
-v $PWD/docker/nginx.conf:/etc/nginx/conf.d/default.conf \
-v $PWD/public:/etc/nginx/html nginx
