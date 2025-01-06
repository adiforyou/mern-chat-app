import bcrypt from "bcryptjs"
import zod from "zod";
import User from "../models/user.model.js"
import { generatetoken } from "../lib/utils.js";

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


export const login =(req,res)=>{
    res.send("login router");
};
export const logout =(req,res)=>{
    res.send("logout router");
};