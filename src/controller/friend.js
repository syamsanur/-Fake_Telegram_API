const { success, failed, failedReg, failedLog, loginSuccess, successWithMeta } = require('../helper/res')
const friendModel = require('../model/friend')
const env = require('../helper/env')
const { response } = require('express')

const friend = {
  getAll: (req, res) => {
    // try {
      const id = req.params.id
      // const name = !req.query.name ? '' : req.query.name
      friendModel.getAll(id)
        .then((result) => {
          // result = result[result.length -1]
          success(res, result, 'Get data success')
        })
        .catch((err) => {
          failed(res, [], err)
        })
    // } catch (err) {
    //   failed(res, [], 'Internal Server error')
    // }
  },
  getFriend: (req, res) => {
    try {
      const id = req.params.id
      friendModel.getFriend(id)
        .then((result) => {
          success(res, result, `Get data with id ${id} success`)
        })
        .catch((err) => {
          failed(res, [], err)
        })
    } catch (err) {
      failed(res, [], 'Internal Server Error')
    }
  },
  insertFriend: (req, res) => {
    try {
      const body = req.body
      friendModel.insertFriend(body)
        .then((result) => {
          success(res, result, `Insert success`)
        })
        .catch((err) => {
          failed(res, [], err)
        })
    } catch (err) {
      failed(res, [], 'Internal Server Error')
    }
  },
  updateFriend: (req, res) => {
    try {
      const body = req.body
      friendModel.updateFriend(body)
        .then((result) => {
          success(res, result, 'Update Success')
        })
        .catch((err) => {
          failed(err, [], err)
        })
    } catch (err) {
     failed(res, [], 'Internal Server Error') 
    }
  }
}

module.exports = friend