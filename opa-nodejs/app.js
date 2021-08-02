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