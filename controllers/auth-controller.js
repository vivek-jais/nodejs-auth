const User = require("../models/User");
const jwt = require("jsonwebtoken")
//hashing passwords and verification
const bcrypt = require("bcryptjs");

// register controller
const registerUser = async (req, res) => {
  try {
    //extract use info from request body
    const { username, email, password, role } = req.body;

    //check if user is already exist in db
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User is already exists!!.Please try with different username or email",
      });
    }

    //hash user Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create a new user and save to DB
    const newCreatedUser = new User({
      username,
      email,
      password:hashedPassword,
      role:role||'user'
    })

    await newCreatedUser.save();

    if(newCreatedUser){
      res.status(201).json({
        success:true,
        message:'User registered Successfully'
      })
    }
    else{
       res.status(400).json({
        success:false,
        message:'Unable to register user. Please try again'
      })
    }


  } catch (e) {
    console.log(e);
    res.status(404).json({
      success: false,
      message: "Some error occured, try again later",
    });
  }
};

//login controller
const loginUser = async (req, res) => {
  try {
    const {username,password} = req.body;

    //find if the current user exit or not in DB
    const user = await User.findOne({username});//this holds all info of curr user

    if(!user){
      return res.status(400).json({
        success: false,
        message:'User not exists!'
      })
    }
    //if password is correct or not
    const isPasswordMatch = await bcrypt.compare(password,user.password)

    if(!isPasswordMatch){
       return res.status(400).json({
        success: false,
        message:'Inavalid credentials!'
      })
    }

    //create user token (jsonweb token)
     const accessToken = jwt.sign({
      userId: user._id,
      username:user.username,
      role:user.role
     },process.env.JWT_SECERET_KEY,{
      expiresIn:'30m'
     })

     res.status(200).json({
      success:true,
      message: 'Logged in successfull',
      accessToken
     })

  } catch (e) {
    console.log(e);
    res.status(404).json({
      success: false,
      message: "Some error occured, try again later",
    });
  }
};

const changePassword = async(req,res)=>{
  try{
    const userId = req.userInfo.userId;

    //extract old and new password
    const {oldPassword,newPassword} = req.body;

    //find the correct logged in user
    const user = await User.findById(userId);

    if(!user){
      return res.status(400).json({
        success:false,
        message: 'User not found'
      })
    }

    //check if the old password is correct
    const isPasswordMatch  = await bcrypt.compare(oldPassword,user.password)

    if(!isPasswordMatch){
      return res.status(400).json({
        success:false,
        message: 'Incorrect Old Password!.Please try again'
      })
    }

    //hash the new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword =  await bcrypt.hash(newPassword,salt)

    //update user password
    user.password = newHashedPassword;

    await user.save();

    return res.status(200).json({
      success:true,
      message:'Password changed successfully!',
      data: user
    })


  }
  catch(e){
     console.log(e);
    res.status(404).json({
      success: false,
      message: "Some error occured, try again later",
    });
  }
}

module.exports = { registerUser, loginUser,changePassword };
