const express = require('express');
const router = express.Router();
router.use(express.urlencoded({extended:true}));
router.use(express.json());
const { signup, login } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
