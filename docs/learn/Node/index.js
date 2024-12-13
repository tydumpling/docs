const fs = require('fs')
const path = require('path')
const http = require('http')

const server = http.createServer()

server.on('request', (req, res) => {
  const url = req.url
  const method = req.method
  
  let fPath = ''
  if (url === '/') {
    fPath = path.join(__dirname, '/clock/clock.html')
  } else {
    fPath = path.join(__dirname, '/clock', url)
  }

  fs.readFile(fPath, 'utf8', (err, result) => {
    if(err) return res.end('404 not')
    res.end(result)
  })
})

server.listen(80, () => {
  console.log('已启动');
})
