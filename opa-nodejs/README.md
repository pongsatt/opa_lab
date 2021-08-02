# Create new project

Create app.
```sh
mkdir opa-nodejs
cd opa-nodejs
npm init -y
```

Install dependencies.
```sh
npm i express jsonwebtoken axios
```

Create a middleware opa.js.
```sh
const jwt = require('jsonwebtoken')
const axios = require('axios')

function createOpaMiddleware(opaAgentUri) {
  const client = axios.create({
    baseURL: opaAgentUri,
  })

  return (action, object) => {
    return async (request, response, next) => {
      try {
        const token = request.headers.authorization

        if (!token) {
          throw new Error("No authorization header")
        }

        const decodedToken = jwt.decode(token)

        const response = await client.post(
          '/v1/data/permission/allow',
          {
            input: {
              subject: decodedToken,
              action,
              object,
            }
          },
        )

        const allow = response.data?.result
        if (!allow) {
          throw new Error("Unauthorized")
        }
        await next()
      } catch (err) {
        response.status(403).send(err.message)
      }

    }
  }
}

module.exports = createOpaMiddleware
```

Create app.js.
```js
const express = require('express')
const createOpaMiddleware = require('./opa')
const app = express()
const port = 3000

const hasPermission = createOpaMiddleware("http://localhost:8181")

app.get('/orders/:id', hasPermission('read', 'order'), (req, res) => {
    res.json({ message: `you can read order with id ${req.params.id}` })
})

app.post('/orders', hasPermission('create', 'order'), (req, res) => {
    res.json({ message: `you can create order` })
})

app.listen(port, () => {
    console.log(`OPA NodeJs is listening at http://localhost:${port}`)
})
```

Run the app.
```sh
node app.js
```

Test the app.
```sh
# authorized
curl --request GET \
  --url http://localhost:3000/orders/test1 \
  --header 'authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlcyI6WyJhZG1pbiJdfQ.fw8otUsm0jn3G7dvWozix5p2QotN3AVyZNJAwY7n50E' 

curl --request POST \
  --url http://localhost:3000/orders \
  --header 'authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlcyI6WyJhZG1pbiJdfQ.fw8otUsm0jn3G7dvWozix5p2QotN3AVyZNJAwY7n50E' 

# unauthorized
curl --request POST \
  --url http://localhost:3000/orders \
  --header 'authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlcyI6WyJ1c2VyIl19.LW5pvc1TRaIk3FNaMADQmjx2Hy86weS64WtVdgK1oZk'

```