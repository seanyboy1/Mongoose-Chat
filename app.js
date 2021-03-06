// import controllers
const AuthController = require('./controllers/auth')
const GetController = require('./controllers/get-messages')
const Message = require('./models/Messages')
const { userInfo } = require('os')
const jwt = require('jsonwebtoken')


// const ProtectedController = require('./controllers/protected')


module.exports = function (deps) {
  // const fs = require('fs')
  const express = require('express')

  const app = express()

  app.use(express.static('static'))
  app.use(express.json())
  app.use('/', AuthController)
  app.use('/', GetController)

  // app.get('/messages', (req, res) => {
  //   fs.readFile(deps.messagesPath, 'utf8', (err, text) => {
  //     if (err) return res.status(500).send(err)

  //     const messages = text
  //       .split('\n')
  //       .filter(txt => txt) // will filter out empty string
  //       .map(JSON.parse)

  //     return res.json(messages)
  //   })
  // })

  // app.post('/messages', (req, res) => {
  //   // console.log(req)
  //   const message = JSON.stringify(req.body)
  //   fs.appendFile(deps.messagesPath, '\n' + message, err => {
  //     if (err) return res.status(500).send(err)

  //     return res.send('post successful')
  //   })
  // })

  const http = require('http').createServer(app)
  const io = require('socket.io')(http)

  io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('chat message', (msg) => {
      io.emit('chat message', msg)
    
      
        if (jwt.verify(msg.userId, 'CHANGEME!')) {
          const user = jwt.decode(msg.userId, 'CHANGEME!')
          
        
          Message.submitMessage(user._id, msg.text, msg.room)
        } else {
          console.log('json web token failed')
        }
    

      // fs.appendFile(deps.messagesPath, '\n' + JSON.stringify(msg), err => err ? console.log(err) : null)
    })

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })

  return http
}
