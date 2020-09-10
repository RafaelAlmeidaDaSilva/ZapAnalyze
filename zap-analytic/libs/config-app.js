
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
}