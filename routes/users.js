const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Load idea model
require("../models/user");
const User = mongoose.model("users");

module.exports = app => {
  // User Login Route
  app.get("/users/login", (req, res) => {
    res.render("users/login");
  });

  // User Register Route
  app.get("/users/register", (req, res) => {
    res.render("users/register");
  });

  // Login Form POST
  app.post('/users/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/ideas',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });

  // Register Form POST
  app.post('/users/register', (req, res) => {
    let errors = [];

    if (req.body.password != req.body.password2) {
      errors.push({ test: "Passwords do not match" });
    }

    if (req.body.password.length < 4) {
      errors.push({ test: "Password must be at least 4 characters" });
    }

    if (errors.length > 0) {
      res.render('users/register', {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        password2: req.body.password2
      });
    } else {
      // Check if email is already used or not
      User.findOne({ email: req.body.email }).then(user => {
        if (user) {
          req.flash("error_msg", "Email already registered");
          res.redirect("/users/register");
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });

          // Encrypting the password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              // Save
              newUser
                .save()
                .then(user => {
                  req.flash(
                    "success_msg",
                    "You are now registered and can log in"
                  );
                  res.redirect("/users/login");
                })
                .catch(err => {
                  console.log(err);
                });
            });
          });
        }
      });
    }
  });

  // Logout user
  app.get('/users/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  })
}
