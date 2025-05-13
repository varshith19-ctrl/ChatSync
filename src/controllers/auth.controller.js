import bcrypt from "bcryptjs"
import {User} from "../models/user.model.js"
import { generateToken } from "../lib/utils.js"

export const signup =async (req,res)=>{
    const {email,fullName,password,profilePic}=req.body;
try {
   const user =await User.findOne({email})
   if(user){
    return res.status(400).json({message:"user already exists"})
   }
   if(!email || !password || !fullName){
    return res.status(400).json({message:"enter email or username or password"})
   }
const salt=await bcrypt.genSalt(10)
const hashedPassword=await bcrypt.hash(password,salt)
const newUser=await User.create({
    email,
    fullName,
    password:hashedPassword
})

if(newUser){
   generateToken(newUser._id,res);
   await newUser.save()
   res.status(201).json({
    _id:newUser._id,
    fullName:newUser.fullName,
email:newUser.email,
profilePic:newUser.profilePic,
   })
    
}
} catch (error) {
    console.log(`error occured while signing up user ${error}`);
    res.status(400).json({
        message:"internal server error "
    })
}
}
export const login =async (req,res)=>{
    const {email,password }=req.body
   try{ 
   const user= await User.findOne({email})
   if(!user){
return res.status(400).json({message:"Invalid credentials"})
   }
   const passwordCheck=await bcrypt.compare(password,user.password)
   if(!passwordCheck){
return res.status(400).json({message:"Invalid credentials"})
   } 
   generateToken(user._id,res)
    res.status(200).json({
    __id:user._id,
    fullName:user.fullName,
email:user.email,
profilePic:user.profilePic,
   }) 
} catch(error){
    console.log(`there was a login error ${error}`)
    return res.status(500).json({
        message:"internal service error"
    })
}
}   
export const logout =(req,res)=>{
    try {
        res.cookie("jwt"," ",{maxAge:0});
        res.status(200).json({
            message:"logging out successful"
        });
    } catch (error) {
        console.log(`there was an error while logging out ${error}`);
        res.status(500).json({
            message:"internal server error"
        })
        
    }
}
export const updateProfile=async(req,res)=>{

}
