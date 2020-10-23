const { success, failed, failedReg, failedLog, loginSuccess, successWithMeta } = require('../helper/res')
const bcrypt = require('bcrypt')
const usersModel = require('../model/users')
const jwt = require("jsonwebtoken");
const env = require('../helper/env')
const nodemailer = require('nodemailer')
const upload = require('../helper/upload')
const fs = require('fs');
const sendMail = require('../helper/Mail');
const { response } = require('express');

const users = {
    register: async (req, res, next) => {
        // try {
            const data = req.body
            const password = req.body.password
            const salt = await bcrypt.genSalt(10)
            const generate = await bcrypt.hash(password, salt)
            const image = "404P.png"
            const phone = null
            // console.log(data, generate, image)
            usersModel.register(data, generate, image, null)
                .then(() => {
                    const email = data.email
                    success(res, [], 'Please check your email to activation')
                    const token = jwt.sign({ email: data.email }, env.SECRETKEY)
                    sendMail(email, token)
                }).catch((err) => {
                    failed(res, [], err.message)
                    // if (err.message = 'Duplicate entry') {
                    //     failedReg(res, [], 'Users Already Exist')
                    // }
                })
        // } catch (err) {
        //     failed(res, [], 'Server Internal Error')
        // }
    },
    verify: (req, res) => {
        try {
            const token = req.params.token
            jwt.verify(token, env.SECRETKEY, (err, decode) => {
                if (err) {
                    res.render('404')
                } else {
                    const data = jwt.decode(token)
                    const email = data.email
                    usersModel.update(email).then((result) => {
                        res.render('index', { email })
                    }).catch(err => {
                        res.render('404')
                    })
                }
            })
        } catch (err) {
            failed(res, [], 'Server Internal Error')
        }
    },
    login: (req, res) => {
        try {
            const body = req.body
            // console.log(body)
            usersModel.login(body)
                .then(async (result) => {
                    if (!result[0]) {
                        failedLog(res, [], "Email invalid")
                    } else {
                        const data = result[0]
                        const pass = data.password_users
                        const password = req.body.password
                        const isMatch = await bcrypt.compare(password, pass)
                        if (data.status_users === 0) {
                            failedLog(res, [], "Please check your email to activation")
                        } else {
                            if (!isMatch) {
                                failedLog(res, [], "Password invalid")
                            } else {
                              // console.log(result)
                                const id = result[0].id_users
                                const username = result[0].fullname_users
                                const token_user = result[0].refreshToken
                                // console.log(token_user)
                                const token = jwt.sign({ id: id }, env.SECRETKEY, { expiresIn: 3600 })
                                const refresh = jwt.sign({ id: id }, env.SECRETKEY)
                                if (!token_user) {
                                    usersModel.loginToken(refresh, id)
                                        .then((result) => {
                                            loginSuccess(res, id, username, token, refresh, 'success login')
                                        })
                                } else {
                                    loginSuccess(res, id, username, token, refresh, 'success login')
                                }
                            }
                        }
                    }
                }).catch((err) => {
                  // console.log(err)
                  failed(res, [], err.message)
                })
        } catch (err) {
            failed(res, [], 'Server Internal Error')
        }
    },
    getAll: (req, res) => {
        try {
            const name = !req.query.name ? "" : req.query.name;
            const sort = !req.query.sort ? "id_users" : req.query.sort;
            const typesort = !req.query.typesort ? "ASC" : req.query.typesort;
            const limit = !req.query.limit ? 10 : parseInt(req.query.limit);
            const page = !req.query.page ? 1 : parseInt(req.query.page);
            const offset = page <= 1 ? 0 : (page - 1) * limit;
            usersModel.getAll(name, sort, typesort, limit, offset)
                .then((result) => {
                    const totalRows = result[0].count;
                    const meta = {
                        total: totalRows,
                        totalPage: Math.ceil(totalRows / limit),
                        page: page,
                    }
                    successWithMeta(res, result, meta, "Get all data success");
                })
                .catch((err) => {
                    failed(res, [], err.message);
                })
        } catch (error) {
            failed(res, [], "Server internal error")
        }
    },
    getUsers: (req, res) => {
      try {
          const id = req.params.id
          usersModel.getOne(id)
              .then((result) => {
                  success(res, result, 'success get users')
              }).catch((err) => {
                  failed(res, [], err.message)
              })
      } catch (err) {
          failed(res, [], "Server internal error")
      }
  },
    updateUsers: (req, res) => {
        try {
            // const body = req.body
            upload.single('image')(req, res, (err) => {
                if (err) {
                    if (err.code === `LIMIT_FILE_SIZE`) {
                        failed(res, [], `Image size is to big`)
                    } else {
                        failed(res, [], err)
                    }
                } else {
                    const id = req.params.id
                    const body = req.body
                    usersModel.getOne(id)
                        .then((response) => {
                          // console.log(req.file.filename)
                            const imageOld = response[0].image
                            body.image = !req.file ? imageOld : req.file.filename
                            
                            if (body.image !== imageOld) {
                                if (imageOld !== '404P.png') {
                                    fs.unlink(`src/img/${imageOld}`, (err) => {
                                        if (err) {
                                            failed(res, [], err.message)
                                        } else {
                                            usersModel.updateUsers(body, id)
                                                .then((result) => {
                                                    success(res, result, 'Update success')
                                                })
                                                .catch((err) => {
                                                    failed(res, [], err.message)
                                                })
                                        }
                                    })
                                } else {
                                    usersModel.updateUsers(body, id)
                                        .then((result) => {
                                            success(res, result, 'Update success')
                                        })
                                        .catch((err) => {
                                            failed(res, [], err.message)
                                        })
                                }
                            } else {
                                usersModel.updateUsers(body, id)
                                    .then((result) => {
                                        success(res, result, 'Update success')
                                    })
                                    .catch((err) => {
                                        failed(res, [], err.message)
                                    })
                            }
                        })
                }
            })
        } catch (err) {
            failed(res, [], 'Server Internal Error')
        }
    },
    
    // deleteUsers: (req, res) => {
    //     try {
    //         const id = req.params.id
    //         usersModel.getOne(id)
    //             .then((result) => {
    //                 const img = result[0].image
    //                 if (img === '404P.png') {
    //                     usersModel.deleteUsers(id)
    //                         .then((result) => {
    //                             success(res, result, 'success delete users')
    //                         }).catch((err) => {
    //                             failed(res, [], err.message)
    //                         })
    //                 } else {
    //                     fs.unlink(`src/img/${img}`, (err) => {
    //                         if (err) {
    //                             failed(res, [], err.message)
    //                         } else {
    //                             usersModel.deleteUsers(id)
    //                                 .then((result) => {
    //                                     success(res, result, 'success delete users')
    //                                 }).catch((err) => {
    //                                     failed(res, [], err.message)
    //                                 })
    //                         }
    //                     })
    //                 }
    //             })
    //     } catch (err) {
    //         failed(res, [], "Server internal error")
    //     }
    // },
    // refreshToken: (req, res) => {
    //     try {
    //         const token = req.body.refreshToken
    //         const id = jwt.decode(token)
    //         if (id === null) {
    //             failed(res, [], "invalid refresh token")
    //         } else {
    //             jwt.sign({ id: id }, env.SECRETKEY, { expiresIn: 10800 }, (err, token) => {
    //                 if (err) {
    //                     failed(res, [], err.message)
    //                 } else {
    //                     success(res, { newToken: token }, 'success refresh token')
    //                 }
    //             })
    //         }
    //     } catch (err) {
    //         failed(res, [], "Server internal error")
    //     }
    // },
}

module.exports = users