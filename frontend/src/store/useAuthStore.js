import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore =create((set)=>({
authUser:null,
isSigningUp:false,
isLoggingUp:false,
isUpdatingProfile:false,
isCheckingAuth:true,

checkAuth: async()=>{
    try {
        const res=await axiosInstance.get("/auth/check");
        set({authUser:res.data})
    } catch (error) {
        console.log("Error in checkAuth:",error);
        set({authUser:null})
    }finally{
        set({isCheckingAuth: false});
    }
},

signup: async (data)=>{
    set({isSigningUp: true});
    try {
        const response=await axiosInstance.post("/auth/signup",data);
        toast.success("Account created sucessfully");
        set({
            authUser: response.data
        });
        
    } catch (error) {
        toast.error(error.response.data.message);
    }finally{
        set({isSigningUp:false});
    }
},

login: async(data)=>{
set({isLoggingUp:true});
try {
    const res=await axiosInstance.post("/auth/login",data);
    set({authUser:res.data});
    toast.success("Logged in Sucessfully");
    
} catch (error) {
    toast.error(error.response.data.message);

}finally{
    set({isLoggingUp:false});
}
},



logout: async ()=>{
    try {
        await axiosInstance.post("/auth/logout");
        set({authUser: null});
        toast.success("Logout Sucessfully");
    } catch (error) {
        toast.error(error.response.data.message);
    }
},

updateProfile:async(data)=>{
    set({isUpdatingProfile:true});
    try {
        const res= await axiosInstance.put("/auth/update",data);
        set({authUser: res.data});
        toast.success("Pic Updated Sucessfully");
        
    } catch (error) {
        console.log("Error in update profile:",error);
        toast.error(error.response.data.message);
        
    }finally{
        set({isUpdatingProfile:false});
    }

},

}));


