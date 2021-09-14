const express = require('express'),
    router = express.Router(),
    User = require("../models/userModel"),
    passport = require("passport");

//------------------------ADMİN------------------------

router.get("/admin", isLoggedIn, (req, res) => {
    res.render("admin");
});

//--------------------LOGIN--------------------

router.get("/login", (req, res) => {
    res.render("login")
});
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/admin",
        failureRedirect: "/login"

    }), (req, res) => {

    });

router.get("/signup", isLoggedIn, (req, res) => {
    res.render("signup")
});
router.post("/signup", (req, res) => {
    console.log(req.body)
    const newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.redirect("/signup")
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/");
        })
    })
});

router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/")
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}

module.exports = router;