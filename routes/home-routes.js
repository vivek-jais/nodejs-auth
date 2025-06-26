const express = require("express");
const authMiddleware = require('../middleware/auth-middleware')

const router = express.Router();

//protecting route with auth middleware
router.get("/welcome",authMiddleware , (req, res) => {

    const {username,userId,role} = req.userInfo
  res.json({
    message: "Welcome to home page",
    user:{
        _id:userId,
        username,
        role
    }
  });
});

module.exports = router;
