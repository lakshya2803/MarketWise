import  express  from "express";
import { 
    addAdmin,
    createCategory,deleteCategory,
    getAllCategory,singleCategory, 
    updateCategory 
} from "../controller/admin.controller.js";
import formidable from "express-formidable";
import { createProduct } from "../controller/products.controller.js";
const router = express.Router();

router.route("/register").post(addAdmin); 

//routes for category
router.route("/create-category").post(createCategory);
router.route("/update-category/:id").put(updateCategory);
router.route("/getall-category").get(getAllCategory);
router.route("/single-category/:slug").get(singleCategory);
router.route("/delete-category/:id").delete(deleteCategory);

//routes for products
router.post("/create-product",formidable(),createProduct);

export default router;