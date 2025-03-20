const express = require('express');
const userModel = require('../models/user.model');
const jobModel = require('../models/job.model');
const applicationModel = require('../models/application.model');
const router = express.Router();
const {authMiddleware} = require("../middleware/auth.js")   

router.post("/",authMiddleware,async(req,res,next)=>{
    try{
        const{title,description,salary,skills,location,remote}=req.body;
        const serialisedSkills=skills.split(",").map(skill=>skill.trim());
            const job=new jobModel({
                title,description,salary,skills:serialisedSkills,location,remote,
            });
            const updatedUser=await userModel.findByIdAndUpdate(req.user.id,{$push:{createdJobs:job._id}});
            if(!updatedUser){   
                return res.send(404).json({message:"User not found"})
            }
            job.createdBy=req.user.id;
            await job.save();
            res.json({message:"Job created successfully"}).status(200);
    }
    catch(err){
        next(err);
    }
})

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

router.put("/:id",authMiddleware, async(req,res,next)=>{
  try{
   
    const userId=req.user.id;
    const jobId=req.params.id;
    const{title,description,salary,skills,location,remote}=req.body;
    const job=await jobModel.findById(jobId);
    if(!job)
    {
        return res.status(404).json({message:"Job not found"})
    }
    if(!job.createdBy.toString()!==userId.toString()){
        return res.status(401).json({message:"not authorized"})
    }
    const updatedJob=await jobModel.findByIdAndUpdate(jobId,{
        title,
        description,
        salary,
        skills:skills.split(",").map(skill=>skill.trim()),
        location,
        remote

    })
    res.json(updatedJob).status(200);
   

  }catch (err) {
    next(err);
  }
})

router.get("/:id",async(req,res,next)=>{
  try{
    const{id}=req.params;
    const job=await jobModel.findById(id);
    if(!job){
        return res.status(404).json({message:"Job not found"});

    }
    res.json(job).status(200);
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
