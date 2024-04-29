import User from "../models/user.models.js";
import { admin } from "../models/admin.models.js";

// registering user
export const createUser = async (req,res) => {
    try {
        const {name,email,password,address,contact} = req.body;

        if( !name || !email || !password){
            return res.status(401).json({success: false,message:"please fill the required fields"});
        }

        let user = await User.findOne({name,email});
        if(user){
            return res.status(401).json({success: false,message: "user already exist"});
        }

        // this is also a way of creating a new user 
        user = await new User({name,email,password,address,contact}).save();

        res.status(200).json({
            success: true,
            message: "ok",
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: message.error
        })
    }
}

export const loginUser = async (req,res) => {
    try {
        const { email,password } = req.body;
        if( !email || !password ) {
            return res.status(401).json({success: false, message:"please fill the required fields"});
        }
        
        const loggedUser = await User.findOne({email}).select('+password');
        if(loggedUser) {
            if(password === loggedUser.password){
                return res.status(200).json({
                    success:true,
                    message: "User logged in",
                    user: {
                        name: loggedUser.userName,
                        Id: loggedUser.email,
                        contactNo: loggedUser.contactNo
                    }
                })
            } else {
                return res.status(404).json({success:false,message:"Incorrect Password"});
            }    
        }

        const existingAdmin = await admin.findOne({email}).select('+password');
        if(existingAdmin) {
            if(password === existingAdmin.password){
                return res.status(200).json({
                    success:true,
                    message: "Admin logged in successfully",
                    Admin: {
                        name : existingAdmin.adminName,
                        Id : existingAdmin.email,
                        address : existingAdmin.address
                    },
                    redirectTo: "api/v1/admin"
                })
            } else {
                return res.status(404).json({success:false,message:"Incorrect Password"});
            }
        }
        

        return res.status(404).json({success:false,message:"Email not found"});
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//forgot password function
export const forgotPassword = async (req,res) => {
    try {
        const {email,newPassword} = req.body;
        if(!email){
            return res.status(400).json({success:false,message:"email is required"});
        }
        if(!newPassword){
            return res.status(404).json({success:false,message:"New password is required"});
        }
        const user = await User.findOne({email});
        if(!user){
            res.status(404).json({success: false,message:"email is wrong"});
        }
        await User.findByIdAndUpdate(user._id,{password:newPassword});
        res.status(200).json({
            success:true,
            message:"Password reset successfully"
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"something went wrong",
            error: error.message
        })
    }
};