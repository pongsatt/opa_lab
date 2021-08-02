docker run -it --name opa-api-server --rm -p 8181:8181 \
--link opa-bundle-server \
-v $PWD:/data openpolicyagent/opa \
run --server \
--addr :8181 \
-c /data/config.yaml
