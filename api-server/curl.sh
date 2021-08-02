curl --request POST \
  --url http://localhost:8181/v1/data/permission \
  --data '{"input": {"subject": {"roles": ["admin"]},"action": "create","object": "order"}}'