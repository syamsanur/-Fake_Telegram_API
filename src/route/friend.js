const express = require('express')
const route = express.Router()
const { getAll, insertFriend } = require('../controller/friend')
// const { authentication, authorization} = require('../helper/auth')

route.get('/getall/:id', getAll)
route.post('/insert', insertFriend)
// route.delete('/delete/:id', deleteUsers)
// route.post('/refresh', refreshToken)
// route.post('/reset-pass', resetPass)
// route.post('/reset-confirm', confirmPass)

module.exports = route