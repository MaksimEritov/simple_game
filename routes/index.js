const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema");
const auth = require("./auth");

/**
 * GET routes
 *
 */
router.get("/signIn", function(req, res, next) {
  if (req.cookies.token) {
    res.redirect("/game");
  } else {
    res.render("signIn", { title: "Sign In" });
  }
});

router.get("/registration", function(req, res, next) {
  if (req.cookies.token) {
    res.redirect("/game");
  } else {
    res.render("reg", { title: "Registration" });
  }
});

router.get("/game", auth.required, function(req, res, next) {
  res.render("index", { title: "Simple Card Game" });
});

router.get("/", auth.required, function(req, res, next) {
  res.redirect("/game");
});


/**
 *
 * Api routes
 *
 */
router.use("/api", require("./api"));

module.exports = router;
