import productModels from "../models/product.models.js";
import fs from "fs";
import slugify from "slugify";

export const createProduct = async (req,res) => {
    try {
        const {name,description,price,category} = req.fields;  // this is because of express-formidable
        const {image} = req.files;
        switch(true) {
            case !name:
                return res.status(404).json({success:false,message:"Name is required"});
            case !description:
                return res.status(404).json({success:false,message:"Description of product is required"});
            case !price:
                return res.status(404).json({success:false,message:"Price is required"});
            case !category:
                return res.status(404).json({success:false,message:"Category is required"});
            case image && image.size > 100000:
                return res.status(404).
                json({success:false,message:"Photo is required and it should be less than 10 mb"});
        }
        const imageBuffer = fs.readFileSync(image.path);
        const product = new productModels({
            name,
            slug: slugify(name),
            description,
            price,
            category,
            image: {
                data: imageBuffer,
                contentType: image.type
            }
        });

        await product.save();
        res.status(200).json({
            success: true,
            message: "Product added successfully",
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const viewProduct = async (req,res) => {
    try {
        const fetchedProduct = productModels.find({Id:req.params});
        if(!fetchedProduct){
            res.status(404).json({success:false,message:"Product not found"});
        }
        res.status(200).json({
            success:true,
            message: "product fetched is",
            fetchedProduct
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
        console.log(error);
    }
}
