var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const auth = require('../authentication')

/* GET home page. */
router.get('/', function(req, res, next) {
  const loggedUserId = auth.getUser(req)
  if (loggedUserId) return res.render('index', { title: 'Projects app', logout: true });
  else return res.render('index', { title: 'Projects app', register: true, login: true });
});

router.post('/register', async function(req, res, next) {
  const [existingUser] = await mongoose.model('User').find({email: req.body.email})
  if (!existingUser) {
    await mongoose.model('User').create(req.body)
    res.render('index', { title: 'Projects app', login: true, register: false });
  }
  else return res.send('This email already owns an account')
});

router.post('/login', async function(req, res, next) {
  const [user] = await mongoose.model('User').find({email: req.body.email, password: req.body.password})
  if (!user) {
    return res.render('index', { title: 'Projects app', login: false, register: true });
  }
  auth.authorize(user.id, res)
  res.redirect('/project?owner=true&archived=false');
});

router.get('/logout', async function(req, res, next) {
  auth.logout(req, res)
  res.redirect('/');
});

module.exports = router;
