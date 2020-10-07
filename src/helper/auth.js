const jwt = require('jsonwebtoken')
const { tokenExpired, tokenError } = require('../helper/res')
const { PRIVATEKEY } = require('../helpers/env')

module.exports = {
    authentication: (req, res, next) => {
        const token = req.headers.token
        if(token === undefined || token === '') {
            tokenError(res, [], 'Token harus diisi')
        } else {
            next()
        }
    },
    authorization: (req, res, next) => {
        const token = req.headers.token
        jwt.verify(token, PRIVATEKEY, (err) => {
            if (err && err.name === 'TokenExpiredError') {
                tokenExpired(res, [], 'Autentikasi gagal, token expired')
            } else if (err && err.name === 'JsonWebTokenError') {
                tokenError(res, [], 'Autentikasi gagal, token salah')
            } else {
                next()
            }
        })
    },
    // admin: (req, res, next) => {
    //     const token = req.headers.token
    //     jwt.verify(token, PRIVATEKEY, (err, decode) => {
    //       if (err && err.name === 'JsonWebTokenError') {
    //         admErrToken(res, [], "Authentification failed !");
    //       } else if (err && err.name === 'TokenExpiredError') {
    //         admErrToken(res, [], "Token Expired !");
    //       }
    //       else {
    //         if (decode.dataUser.role === 1) {
    //           next()
    //         } else {
    //           forbidden(res, 'Dont have permission!')
    //         }
    //       }
    //     })
    // }
}