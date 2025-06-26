
const jwt = require('jsonwebtoken')
const authMiddleware =(req,res,next)=>{

    const authHeader = req.headers['authorization'];
    console.log(authHeader);

    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(400).json({
            success: false,
            message: 'Access denied. No token provided.Please login to continue'
        })
    }

    //decode token
    try{
        const decodedTokenInfo = jwt.verify(token,process.env.JWT_SECERET_KEY)
        console.log(decodedTokenInfo);

        req.userInfo = decodedTokenInfo
         next()

    }catch(e){
         return res.status(500).json({
            success: false,
            message: 'Access denied. No token provided.Please login to continue'
        })
    }
    


}

module.exports = authMiddleware