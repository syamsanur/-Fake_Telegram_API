const { body, validationResult } = require('express-validator');
const { failedReg } = require('../helper/res')

const userValidator = () => {
    return [
        body('email').isEmail(),
        body('password').isLength({ min: 6 }),
    ]
}

const validationUser = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        next()
    } else {
        if(errors.errors[0].param === 'email'){
            failedReg(res, [], 'Please input email valid')
        }else {
            failedReg(res, [], 'Please input password min 6 character')
        }
    }
}

module.exports = { userValidator, validationUser }