const express = require('express')
const createOpaMiddleware = require('./opa')
const app = express()
const port = 3000

// create opa authorization check middleware and provide api server uri
const hasPermission = createOpaMiddleware("http://localhost:8181")

// check if the request is allowed to take action "read" to object "order"
app.get('/orders/:id', hasPermission('read', 'order'), (req, res) => {
    res.json({ message: `you can read order with id ${req.params.id}` })
})

// check if the request is allowed to take action "create" to object "order"
app.post('/orders', hasPermission('create', 'order'), (req, res) => {
    res.json({ message: `you can create order` })
})

// start server
app.listen(port, () => {
    console.log(`OPA NodeJs is listening at http://localhost:${port}`)
})