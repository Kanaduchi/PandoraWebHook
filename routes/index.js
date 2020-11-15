let express = require('express'),
    createError = require('http-errors');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pandora Alarm API' });
});

router.post('/', function (req, res, next) {
  if (req.body.email && req.body.password) {
    let email = req.body.email;
    let pass = req.body.password;
    let phrase = email + ':' + pass;

    res.render('index', {title: 'Pandora Alarm API', user: Buffer.from(phrase).toString('base64')});
  } else {
    next(createError('Password or email is empty'));
  }
});

module.exports = router;
