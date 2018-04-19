const mongoose = require("mongoose");

// Load helpers
const { ensureAuthenticated } = require("../helpers/auth");

// Load idea model
require("../models/idea");
const Idea = mongoose.model("ideas");

module.exports = app => {
  // Index Route
  app.get("/", (req, res) => {
    const title = "WELCOME";
    res.render("index", {
      title
    });
  });

  // About Route
  app.get("/about", (req, res) => {
    res.render("about");
  });

  // Idea index page
  app.get("/ideas", ensureAuthenticated, (req, res) => {
    Idea.find({ user: req.user.id })
      .sort({ date: "desc" })
      .then(ideas => {
        res.render("ideas/index", {
          ideas
        });
      });
  });

  // Add idea form
  app.get("/ideas/add", ensureAuthenticated, (req, res) => {
    res.render("ideas/add");
  });

  // Edit idea form
  app.get("/ideas/edit/:id", ensureAuthenticated, (req, res) => {
    Idea.findOne({
      _id: req.params.id
    }).then(idea => {
      if (idea.user != req.user.id) {
        req.flash("error_msg", "Not Authorized");
        res.redirect("/ideas");
      } else {
        res.render("ideas/edit", {
          idea
        });
      }
    });
  });

  // Process Add Form
  app.post("/ideas", ensureAuthenticated, (req, res) => {
    let errors = [];
    console.log(req.body);
    if (!req.body.title) {
      errors.push({ text: "Please add a title" });
    }
    if (!req.body.details) {
      errors.push({ text: "Please add some details" });
    }

    if (errors.length > 0) {
      res.render("ideas/add", {
        errors: errors,
        title: req.body.title,
        details: req.body.details
      });
    } else {
      const newUser = {
        title: req.body.title,
        details: req.body.details,
        user: req.user.id
      };

      new Idea(newUser).save().then(idea => {
        req.flash("success_msg", "Video idea added");
        res.redirect("/ideas");
      });
    }
  });

  // Edit Form process
  app.put("/ideas/:id", ensureAuthenticated, (req, res) => {
    Idea.findOne({
      _id: req.params.id
    }).then(idea => {
      // New vlaue
      idea.title = req.body.title;
      idea.details = req.body.details;

      idea.save().then(idea => {
        req.flash("success_msg", "Video idea updated");
        res.redirect("/ideas");
      });
    });
  });

  // Delete Idea
  app.delete("/ideas/:id", ensureAuthenticated, (req, res) => {
    Idea.remove({
      _id: req.params.id
    }).then(() => {
      req.flash("success_msg", "Video idea deleted");
      res.redirect("/ideas");
    });
  });
};
