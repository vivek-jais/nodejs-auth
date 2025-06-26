const express = require("express");
const {registerUser,loginUser, changePassword} = require('../controllers/auth-controller');
const authMiddleware = require("../middleware/auth-middleware");
const router = express.Router();

//all routes related to the authentication and authorisation
router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/change-password',authMiddleware,changePassword);





module.exports = router;
