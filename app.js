var express = require('express');
var mongoose = require('mongoose');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var multer = require('multer');
var path = require('path');
var cookieParser = require('cookie-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var nodemailer = require('nodemailer');


var upload = multer({
    dest: __dirname + '/uploads'
});

mongoose.connect('mongodb://localhost/pokedex');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');
require('./models/Pokemon');
require('./models/Type');

var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(upload.any());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname + '/node_modules/bootswatch/cerulean'));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

app.use('/types', require('./routes/types'));

app.use('/', require('./routes/pokemons'));

app.use('/uploads', express.static(__dirname + '/uploads'));

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

console.log('Pokédex lancé sur le port 8081');


// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/', routes);
app.use('/users', users);

// Set Port
app.set('port', (process.env.PORT || 5055));

app.listen(app.get('port'), function(){
  console.log('Server started on port '+app.get('port'));
});