
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


var bodyParser = require('body-parser');
var handleBars = require('express-handlebars');
// const helmet = require('helmet');

module.exports = app => {
    
    // //Helmet
    // //config
    // app.use(helmet());
  
    // Body Parser
    // config
    app.use(bodyParser.urlencoded({extended:false}))
    app.use(bodyParser.json())
    
    // Template Engine
    // config
    // app.engine('handlebars', handleBars({defaultLayout: 'main'}))
    // app.set('view engine','handlebars')
    app.locals.layout = false
    app.engine('hbs', handleBars({defaultLayout: 'main', extname: '.hbs'}))
    app.set('view engine','hbs')
    // app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
    // app.set('view engine', 'hbs');
    // Handlebars.registerPartial('','{{prefix}}')
    // {}
}
