const multer = require('multer')
const path = require ('path')

const storage = multer.diskStorage({
    destination: (req, res, cb)=>{
        cb(null, 'src/img')
    },
    filename: (req, file, cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({
    storage,
    limits: { fileSize: 2000000 },
    fileFilter(req, file, callback){
      if(file.originalname.match(/\.(jpg|jpeg|png)\b/)) {
        callback(null, true)
      }else{
        callback('Wrong image type', null)
      }
    }
})

module.exports = upload