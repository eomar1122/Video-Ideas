const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');


const app = express();

// Passport Config
require('./config/passport')(passport);

// Map Global promise - get rid of warning
// mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev')
  .then(() => console.log('MongoDB Connected....'))
  .catch((err) => console.log(err));

// Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder -- set public folder to be express static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method Override middleware
app.use(methodOverride('_method'));

// Express-session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware -- has to be after Express-session middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
// Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Route
require('./routes/ideas.js')(app);
require('./routes/users.js')(app);


const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port: ${port}`)
});