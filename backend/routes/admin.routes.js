import  express  from "express";
import { 
    addAdmin,authAdmin,
    createCategory,deleteCategory,
    getAllCategory,singleCategory, 
    updateCategory 
} from "../controller/admin.controller.js";
const router = express.Router();

router.route("/register").post(addAdmin); 
router.route("/login").post(authAdmin);

//routes for category
router.route("/create-category").post(createCategory);
router.route("/update-category/:id").put(updateCategory);
router.route("/getall-category").get(getAllCategory);
router.route("/single-category/:slug").get(singleCategory);
router.route("/delete-category/:id").delete(deleteCategory)

export default router;