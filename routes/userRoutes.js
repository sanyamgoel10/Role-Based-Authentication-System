const express = require('express');
const router = express.Router();

const AuthMiddleware = require('../middleware/authMiddleware.js');

const UserController = require('../controllers/userController.js');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/profile', AuthMiddleware.validateJwtToken, UserController.getProfile);
router.get('/admin/users', AuthMiddleware.validateJwtToken, UserController.getUsers);
router.put('/admin/updateUserProfile/:id', AuthMiddleware.validateJwtToken, UserController.updateUserProfile);

module.exports = router;