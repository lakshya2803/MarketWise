import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    Id: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type:String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.ObjectId,
        ref: 'Category',
        required: true
    },
    image: {
        type:Buffer,
        contentType: String
    }
},{timestamps:true});

// pre-save hook to generate id for the products
productsSchema.pre('save', async function(next) {
    try {
        // Create a slug from the product name
        const slug = slugify(this.name, { lower: true });

        // Query for existing documents with the same slug
        const existingProducts = await this.constructor.find({ Id: { $regex: '^' + slug } });

        // Count the number of existing products with the same slug
        const count = existingProducts.length;

        // Generate the custom id
        this.Id = `${slug}${String(count + 1).padStart(3, '0')}`;
        next();
    } catch (error) {
        console.error('Error in pre-save hook:', error);
        next(error); // Pass error to continue save operation
    }
});


export default mongoose.model("Product",productsSchema);