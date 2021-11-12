const {JWT_SECRET} = require('../secrets')
const jwt= require('jsonwebtoken')
const Users= require('../users/users-model')

const providedUsernamePassword = (req,res,next)=>{
    if(!req.body.username || !req.body.password){
        res.json({message:"username and password required"})
    } else {
        next()
    }
}

const checkUsernameTakenRegister = async (req, res, next) => {
    try{
      const [user]=await Users.findBy({username: req.body.username})
      if(!user){
        next()
      } else {
        res.json({message:"username taken"})
      }
    }
    catch(err){
      next(err)
    }
  
  }

  const checkUsernameExistsLogin = async (req, res, next) => {
    try{
      const [user]=await Users.findBy({username: req.body.username})
      if(!user){
        next({ status:401, message: 'Invalid credentials'})
      } else {
        req.user=user
        next()
      }
    }
    catch(err){
      next(err)
    }
  }
module.exports={
    providedUsernamePassword,
    checkUsernameTakenRegister,
    checkUsernameExistsLogin
}