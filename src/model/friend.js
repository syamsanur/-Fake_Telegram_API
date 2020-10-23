const db = require('../config/config')

const friend = {
  getAll: (id) => {
    // console.log(id)
    return new Promise((resolve, reject) => {
      db.query(`
      SELECT 
          a.id,
          a.id_users,
          a.id_friend as friend2,
          a.msg_notif,
          a.msg_preview,
          a.msg_date,
          b.email_users,
          b.fullname_users,
          b.image,
          b.phone_users,
          b.bio_users
      FROM tb_friend as a
      INNER JOIN tb_users as b
      ON a.id_friend = b.id_users
      WHERE a.id_users = ${id}
      `, (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  insertFriend: (body) => {
    const friend1 = body.idusers
    const friend2 = body.idfriend
    // console.log(body)
    // console.log(friend1)
    // console.log(friend2)
    return new Promise((resolve, reject) => {
      db.query(`INSERT INTO tb_friend (id_users, id_friend) VALUES ('${friend1}','${friend2}')`, (err, result) => {
        if(err) {
          reject(new Error(err))
        } else {
          db.query(`INSERT INTO tb_friend (id_users, id_friend) VALUES ('${friend2}','${friend1}')`, (err, result) => {
            if (err) {
              reject (new Error(err))
            } else {
              resolve(result)
            }
          })
          resolve(result)
        }
      })
    })
  }
  
  // SELECT * FROM tb_friend WHERE id_users = ${id}
}

module.exports = friend