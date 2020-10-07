const express = require('express')
const app = express()
const socketio = require('socket.io')
const port = 3000
const bodyParser = require('body-parser')
const db = require('./src/config/config')
const users = require('./src/route/users')
const path = require('path')
const ejs = require('ejs')
const cors = require('cors')
const http = require('http')
const server = http.createServer(app)
const io = socketio(server)


db.connect((err) => {
    if(err) throw err
    console.log(`connect database`);
})


app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'ejs')
app.use(cors())
app.use(express.static('src/img'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use('/users', users)

server.listen(port, () => {
  console.log(`Server Running on Port ${port}`)
})

io.on('connection', (socket) => {
  socket.on('send-message', (payload) => {
    const message = `${payload.message}`
    db.query(`INSERT INTO tb_message(sender, receiver, message) VALUES ('${payload.sender}','${payload.receiver}','${message}')`, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        io.to(payload.receiver).emit('list-messages', {
          sender: payload.sender,
          receiver: payload.receiver,
          message: message
        })
      }
    })
  })

  socket.on('get-history-message', (payload) => {
    db.query(`SELECT * FROM tb_message WHERE (sender='${payload.sender}' AND receiver='${payload.receiver}')
     OR (sender='${payload.receiver}' AND receiver='${payload.sender}')`, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        // console.log(result)
        io.to(payload.receiver).emit('history-list-message', result)
      }
    })
  })

  socket.on('join-room', (payload) => {
    // console.log(payload.user)
    socket.join(payload.user)
  })

  // console.log('user connected')
})

// app.listen(port,()=> {
//     console.log(`Server running at port ${port}`)
// })