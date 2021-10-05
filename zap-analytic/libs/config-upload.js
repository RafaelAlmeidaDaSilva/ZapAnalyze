
// Copyright (C) 2021 Rafael Almeida da Silva

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
