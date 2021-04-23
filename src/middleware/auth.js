const jwt = require('jsonwebtoken')
const schema = require('../models/user')
const User = schema["radiography"]
const auth = async(req,res,next)=>{
 
    try{
        const token = req.header('Authorization').replace('Bearer ',"")
   
        const decoded = jwt.verify(token,'pneumoniaDetection')
        const user = await User.findOne({_id : decoded._id,'tokens.token':token})
        
        if (!user){
            throw new Error()
        }
    
        req.user = user
        req.token = token
      
        next()
    }catch(e){
       
        res.send("Please Login")
        
    }

}

module.exports =auth