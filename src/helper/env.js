require('dotenv').config()

const env = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    DATABASE: process.env.DB,
    SECRETKEY: process.env.SECRET,
    USEREMAIL: process.env.USEREMAIL,
    USERPASS: process.env.USERPASS,
    HOSTURL: process.env.HOSTURL
}

module.exports = env