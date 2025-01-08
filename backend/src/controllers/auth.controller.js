import bcrypt from "bcryptjs"
import zod from "zod";
import User from "../models/user.model.js"
import { generatetoken } from "../lib/utils.js";
import e from "express";
import cloudinary from "../lib/cloudinary.js";

const signupschema= zod.object({
    name:zod.string().min(1,"Name is Required"),
    email: zod.string().email(),
    password:zod.string().min(6,"Password must be atleast 6 characters long"),
})
export const signup = async (req,res)=>{

    const {success} =signupschema.safeParse(req.body);
    
    if(!success){
         return res.status(400).json({
            message: "Invalid Inputs"
       
        });
    }
    const {email,name,password}=req.body;

    try {
        const existinguser = await User.findOne({email})
    
        if(existinguser){
            return res.status(409).json({
                message:"User already exist"
            });
        }
        const hashedPassword= await bcrypt.hash(password,10);  

        const newUser= await User.create({
            name:name,
            email:email,
            password:hashedPassword,
    
        })
        if(newUser){
            generatetoken(newUser._id,res);

            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                name:newUser.name,
                email:newUser.email,
                pic: newUser.pic,
            });


        }else{
            res.status(400).json({message:"Invalid data"})
        }
        

    } catch (error) {
        console.log("Error in Signup Controller", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};


export const login =async(req,res)=>{
   const {email, password}=req.body;

   try{
   const user = await User.findOne({email})

    
   if(!user){
       return res.status(400).json({
           message:"Invalid Credentials"
       });
   }
   const validpass= await bcrypt.compare(password,user.password);
   if(!validpass){
     return res.status(400).json({message:"Invalid Credentials"});
   }
   generatetoken(user._id,res);

   res.status(200).json({
    _id:user._id,
    name:user.name,
    email:user.email,
    pic:user.pic,
   });
   }catch(error){
    console.log("Errror in login controller", error.message);
    res.status(500).json({message:"Internal Server Error"});

   }
   

};
export const logout =async (req,res)=>{
    try {
        await res.cookie("authtoken","",{maxAge:0});
        res.status(200).json({message: "Logout Sucessfully"});
        
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({message:"Internal Server Error"});

    }
};

export const update=async(req,res)=>{
    try {
        const {pic}= req.body;
        const userId=req.user._id;
        if(!pic){
            return res.status(400).json({message:"Profile pic is required"});

        }
        const uploadResponse =await cloudinary.uploader.upload(pic);
        const updatedUser= await User.findByIdAndUpdate(userId,{pic:uploadResponse.secure_url},{new:true});

        res.status.json(updatedUser);

    } catch (error) {
        console.log("Error in profile updation", error);
        res.status(500).json({message:"Internal Server Error"});

    }
};

export const check=(req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in check controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}