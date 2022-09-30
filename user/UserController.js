const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const LocalStorage = require('node-localstorage').LocalStorage;
const config = require('../config.js');
const jwt = require('jsonwebtoken');
localStorage = new LocalStorage('./scratch');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const User = require('./User');

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
    var token = localStorage.getItem('authtoken')
        console.log("token>>>",token)
        if (!token) {
            res.redirect('/')
        }
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                res.redirect('/')
            };
            User.findById(decoded.id, { password: 0 }, function (err, user) {
                var role = user.role
                if (role != '') {
                    
                    res.render('error.ejs')
                } else {
                    User.find({}, function (err, users) {
                        if (err) return res.status(500).send("There was a problem finding the users.");
                        
                        res.render('users.ejs',{users})
                    });
                }
            })
           
            
        });
    
});



// GETS A SINGLE USER FROM THE DATABASE
    router.get('/profile', function (req, res) {
        var token = localStorage.getItem('authtoken')
        console.log("token>>>",token)
        if (!token) {
            res.redirect('/')
        }
        jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            res.redirect('/')
        };
            User.findById(decoded.id, { password: 0 }, function (err, user) {
                if (err) {res.redirect('/')}
                if (!user) {res.redirect('/')}
                res.render('profile.ejs',{user})
            });
        });
    });

    router.get('/user', function (req, res) {
        var token = localStorage.getItem('authtoken')
        console.log("token>>>",token)
        if (!token) {
            res.redirect('/')
        }
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                res.redirect('/')
            };
            User.findById(decoded.id, { password: 0 }, function (err, user) {
                var role = user.role
                if (role != '') {
                    res.render('error.ejs')
                }
            })
            res.render('useradd.ejs')
            
        });
    });
    router.post('/add-user', function (req, res) {
        var token = localStorage.getItem('authtoken')
        console.log("token>>>",token)
        if (!token) {
            res.redirect('/')
        }
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                res.redirect('/')
            };
            User.findById(decoded.id, { password: 0 }, function (err, user) {
                var role = user.role
                if (role != '') {
                    res.render('error.ejs')
                }
            })
            User.create(req.body, (err, result) => {
                if (err) {
                    res.redirect('/')
                } else {
                    res.redirect('/users')
                }
            })
            
        });
    });

router.get('/signup',  (req, res) => {
    res.render('signup.ejs')
 });

 router.get('/logout', (req,res) => {
     localStorage.removeItem('authtoken');
     res.redirect('/');
 })

module.exports = router;