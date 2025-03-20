const express = require('express');
const userModel = require('../models/user.model');
const router = express.Router();
const {authMiddleware} = require("../middleware/auth.js")

router.post("/register",async(req,res,next)=>{
  try{
    const {name,email,password,mobile}=req.body
    const hashedPassword=bcrypt.hashSync(password,10);
    const user=new userModel({
      name,email,mobile, password:hashedPassword,
    });
    await user.save();
    res.json({message:"User create successfully@"}).status(200);
  }catch(err){
    next(err);
  }
})
//get id from token
//get user from id
router.get('/',async(req, res, next) => {
  try {
    const {id}=req.user;
    const user=await userModel.findById(id);//search by id 
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    res.json(user).status(200);
  } catch (err) {
    next(err);
  }
});

router.delete('/',authMiddleware, async(req, res, next) => {
  try {
    const {id}=req.user;
    const user=await userModel.findByIdAndDelete(id);//search by id 
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    res.json({message:"User deeted Successfully!"}).status(200);
  } catch (err) {
    next(err);
  }
});

router.put("/",authMiddleware, async(req,res,next)=>{
  try{
    const{id}=req.user;
    const user=await userModel.findByIdAndUpdate(id,req.body);
    if(!user){  
      return res.status(404).json({message:"User not found"});
    }
    res.json(user).status(200);

  }catch (err) {
    next(err);
  }
})

router.get("/jobs",authMiddleware,async(req,res,next)=>{
  try{
    const {createdJobs,savedJobs,appliedJobs}=req.query;
    const jobs=await userModel.findById(req.user.id);
    if(!jobs){
      return res.status(400).json({Message:"User not found"});
    }
    const query={};
    if(createdJobs){
      query.createdJobs=true
    }
    if(savedJobs){
      query.savedJobs=true
    }
    if(appliedJobs){
      query.appliedJobs=true
    }
    else{
      const jobs=await userModel.findById(req.user.id).select({...query});
      return res.json(jobs).status(200);
    }
  }catch(err){
    next(err);
  }
})


router.get("/status",authMiddleware,async(req,res,next)=>{
  try{
    const {id}=req.user;
    const user=await userModel.findById(id);
    if(!user){
      return res.status(400).json({message:"user not found"})
    }
    const applications=await applicationModel.find({user:id});// will tell no. of application filled by user
    const acceptedApplications=applications.filter(app=>app.status==="accepted");//no. of applications accepted.  
    return res.json({acceptedApplications}).status(200);
  }catch(err){
    next(err);
  }
})

module.exports = router;
