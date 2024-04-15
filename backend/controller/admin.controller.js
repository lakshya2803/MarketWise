import { admin } from "../models/admin.models.js";
import Category from "../models/category.models.js";
import slugify from "slugify";

export const addAdmin = async (req,res) => {
    try {
        const {adminName,adminId,password,address} = req.body;

        if(!adminName || !adminId ||!password){
            return res.status(400).json({success: false, message: "Fill all the required fields"});
        }

        let Admin = await admin.findOne({adminName,adminId});
        if(Admin){
            return res.status(404).json({success: false, message: "Admin already exist"});
        }

        Admin = await admin.create({
            adminName,
            adminId,
            password,
            address
        });

        res.status(200).json({
            success: true,
            message: "Ok admin registered successfully",
            Admin
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//logging in the admin
export const authAdmin = async (req,res) => {
    try {
        const {adminId, password} = req.body;
        if(!adminId || !password){
            return res.status(402).json({success: false,message:"Fill the required fields"});
        }
        const loggedAdmin = await admin.findOne({adminId}).select("+password");
        if(!loggedAdmin){
            return res.status(404).json({success:false,message:"Admin not registered"});
        }
        if(password !== loggedAdmin.password){
            return res.status(404).json({success: false, message:"Incorrect password"});
        }

        res.status(200).json({
            success:true,
            message: "Admin logged in successfully",
            Admin: {
                name: loggedAdmin.name,
                id: loggedAdmin.adminId,
                address: loggedAdmin.address
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//adding controllers for category
// controller for creating category
export const createCategory = async (req,res) => {
    try {
        const {name} = req.body;
        if(!name){
            return res.status(404).json({success:false,message:"Name is required"});
        }
        const existingCategory = await Category.findOne({name});
        if(existingCategory){
            return res.status(404).json({success:false,message:"Category already exists"});
        }
        const category = await new Category({name,slug:slugify(name)}).save();
        res.status(200).json({
            success:true,
            message:"Category is added successfully",
            category
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Something went wrong",
            error: error.message
        })
    }
}

//controller for updating category
export const updateCategory = async (req,res) => {
    try {
        const {name} = req.body;
        const {id} = req.params;
        const category = await Category.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
        res.status(200).json({
            success:true,
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//get-all category controller
export const getAllCategory = async (req,res) => {
    try {
        const allCategory = await Category.find({});
        res.status(200).json({
            success:true,
            message:"All the categories",
            allCategory
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

// controller for getting single category
export const singleCategory = async (req,res) => {
    try {
        const single = await Category.find({slug:req.params.slug});
        res.status(200).json({
            success: true,
            message: "The category requested is fetched successfully",
            single
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// controller for deleting the category
export const deleteCategory = async (req,res) => {
    try {
        const {id} = req.params;
        await Category.findByIdAndDelete({id});
        res.status(200).json({
            success:true,
            message: "category is deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}