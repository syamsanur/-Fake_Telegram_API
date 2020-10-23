const express = require('express')
const app = express()
const socketio = require('socket.io')
const port = 3000
const bodyParser = require('body-parser')
const db = require('./src/config/config')
const users = require('./src/route/users')
const friend = require('./src/route/friend')
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
app.use('/friend', friend)

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

        let id_users = parseInt(payload.idSender)
        let id_friend = payload.idRec
        let msg_preview = message

        const data = {
          msg_preview
        }
        db.query(`SELECT created_at FROM tb_message`, (err, result) => {
          if (err) {
            console.log(err)
          } else {
            result = result[result.length -1]
            let msg_date = result.created_at
            msg_date = msg_date.slice(11,16) 

            // console.log(msg_date)
            data.msg_date = msg_date

            db.query(`SELECT msg_notif FROM tb_friend WHERE id_users = ${id_users} AND id_friend = ${id_friend}`, (err, result) => {
              if (err) {
                console.log(err)
              } else {
                msg_notif = result[0].msg_notif
                msg_notif += 1
                data.msg_notif = msg_notif

                // console.log(data)

                db.query(`
                UPDATE tb_friend SET ?
                WHERE id_users = ${id_users} AND id_friend = ${id_friend}`, [data] , (err, result) => {
                  if (err) {
                    console.log(err)
                  } else {
                    console.log('uwow')
                  }
                })
              }
            })
          }
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
        io.to(payload.sender).emit('historyMsg', result)
        
        let id_users = parseInt(payload.idSender)
        let id_friend = payload.idRec

        const data = {
          id_users,
          id_friend
        }

        db.query(`SELECT msg_notif FROM tb_friend WHERE id_users = ${id_users} AND id_friend = ${id_friend}`, (err, result) => {
          if (err) {
            console.log(err)
          } else {
            msg_notif = result[0].msg_notif
            msg_notif = 0

            data.msg_notif = msg_notif

            db.query(`UPDATE tb_friend SET ?
              WHERE id_users = ${data.id_users} AND id_friend = ${data.id_friend}`, [data] , (err, result) => {
                if (err) {
                  console.log(err)
                } else {
                  console.log('iyey')
                }
              })
          }
        })
      }
    })
  })

  socket.on('delete-message', (payload) => {
    // console.log(payload)
    db.query(`DELETE FROM tb_message WHERE id_message = ${payload}`, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        console.log('Iyey')
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