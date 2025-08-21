const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userController.js');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
// router.get('/profile');
// router.get('/admin/users');

module.exports = router;