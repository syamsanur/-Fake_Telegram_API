const db = require('../config/config')

const users = {
    register: (data, generate, image, phone) => {
        return new Promise((resolve, reject) => {
          // console.log(data, generate, image)
            db.query(`INSERT INTO tb_users (email_users, password_users, fullname_users, image, phone_users) VALUES
            (
              '${data.email}',
              '${generate}',
              '${data.fullname}',
              '${image}',
              '${phone}')`,
               (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    },
    update: (email) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE tb_users SET status_users= 1 WHERE email_users='${email}'`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    login: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM tb_users WHERE email_users = ?`, data.email, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    },
    loginToken: (token, id) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE tb_users SET refreshToken='${token}' WHERE id_users=${id}`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    getAll: (name, sort, typesort, limit, offset) => {
      return new Promise((resolve, reject) => {
          db.query(`SELECT *, (SELECT COUNT(*) FROM tb_users) as count FROM tb_users WHERE fullname_users LIKE '%${name}%' 
          ORDER BY ${sort} ${typesort} LIMIT ${offset},${limit}`, (err, result) => {
              if (err) {
                  reject(new Error(err))
              } else {
                  resolve(result)
              }
          })
      })
    },
    getOne: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM tb_users WHERE id_users=${id}`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    updateUsers: (data, id) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE tb_users SET ? WHERE id_users = ${id}`, [data, id], (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    // deleteUsers: (id) => {
    //     return new Promise((resolve, reject) => {
    //         db.query(`DELETE FROM users WHERE id_users=${id}`, (err, result) => {
    //             if (err) {
    //                 reject(new Error(err))
    //             } else {
    //                 resolve(result)
    //             }
    //         })
    //     })
    // },
    // searchEmail: (email) => {
    //     return new Promise((resolve, reject) => {
    //         db.query(`SELECT * FROM users WHERE email="${email}"`, (err, result) => {
    //             if (err) {
    //                 reject(new Error(err))
    //             } else {
    //                 resolve(result)
    //             }
    //         })
    //     })
    // },
    // updateKey: (key, email) => {
    //     return new Promise((resolve, reject) => {
    //         db.query(`UPDATE users SET key_pass="${key}" WHERE email="${email}"`, (err, result) => {
    //             if(err) {
    //                 reject(new Error(err))
    //             }else {
    //                 resolve(result)
    //             }
    //         })
    //     })
    // },
    // setPass: (password, key) => {
    //     return new Promise((resolve, reject) => {
    //         db.query(`UPDATE users SET password='${password}', key_pass=null WHERE key_pass='${key}'`, (err, result) => {
    //             if(err) {
    //                 reject(new Error(err))
    //             }else{
    //                 resolve(result)
    //             }
    //         })
    //     })
    // }
}

module.exports = users