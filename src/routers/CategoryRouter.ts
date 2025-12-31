import { Router } from "express";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";
import { Utils } from "../utils/Utils";
import Category from "../models/Category";
import { CategoryController } from "../controllers/CategoryController";


class CategoryRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.putRoutes();
        this.deleteRoutes();
    }

    getRoutes() {
        this.router.get('/getCategories/:restaurantId', GlobalMiddleWare.auth,
                                    GlobalMiddleWare.adminRole,
                                    CategoryController.getCategoriesByRestaurant
        )
    }
    postRoutes() {
    
    }
    patchRoutes() {
       
    }
    putRoutes() { 

    }
    deleteRoutes() {

    }
}

export default new CategoryRouter().router;