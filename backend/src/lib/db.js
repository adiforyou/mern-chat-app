import moongose from "mongoose";

export const connectDb =async()=>{
    try{
         await moongose.connect(process.env.MONGO_URL);
        console.log("Connected with Database ")
    }catch(error){
        console.log("MongoDB connection error:", error);
    }
}