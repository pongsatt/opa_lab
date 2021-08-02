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