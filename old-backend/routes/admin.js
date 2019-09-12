var express = require('express');
var router = express.Router();

router.get('/admin', function(req, res, next) {
    console.log('here admin');
    res.render('admin', { title: 'Admin' });
});

module.exports = router;
