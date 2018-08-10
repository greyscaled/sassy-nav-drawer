const express = require('express')
const http = require('http')
const path = require('path')


const app = express()

app.use(express.static('docs'))

app.get('/', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, 'docs', 'index.html'))
})

const server = http.createServer(app)
server.listen(3000, () => {
  console.log('listening on 3000')
})
