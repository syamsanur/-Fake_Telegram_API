const express = require('express')
const route = express.Router()
const { register, verify, login, updateUsers, getUsers, deleteUsers, refreshToken, getAll, resetPass, confirmPass } = require('../controller/users')
const { userValidator, validationUser } = require('../helper/validator')
const upload = require ('../helper/upload')
// const { authentication, authorization} = require('../helper/auth')

route.post('/register', register)
route.get('/verification/:token', verify)
route.post('/login', login)
route.get('/getall', getAll),
route.get('/getone/:id', getUsers)
route.patch('/edit/:id', upload.single("image"), updateUsers)
// route.delete('/delete/:id', deleteUsers)
// route.post('/refresh', refreshToken)
// route.post('/reset-pass', resetPass)
// route.post('/reset-confirm', confirmPass)

module.exports = route