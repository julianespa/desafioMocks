const multer = require('multer') // Importo MULTER

// Configuracion del espacio donde se guardan las imagenes y nombre de caada una
let storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,__dirname+'/../public/img')
    },
    filename: (req,file,cb)=>{
        cb(null,Date.now()+'-'+file.originalname)
    }
})

// Creo el uploader
const uploader = multer({storage:storage})

module.exports = uploader