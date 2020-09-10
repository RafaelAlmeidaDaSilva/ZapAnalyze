const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/")        
    }, 
    filename: function (req, file, cb) {
        cb(null,'file.txt')
        // cb(null,Date.now+file.originalname + Date.now + path.extname(file.originalname))
    }
})

const upload = multer({storage})

module.exports = upload;