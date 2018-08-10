const express = require('express')
const http = require('http')
const path = require('path')


const app = express()

app.use(express.static('gh-pages'))

app.get('/', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, 'index.html'))
})

const server = http.createServer(app)
server.listen(3000, () => {
  console.log('listening on 3000')
})
