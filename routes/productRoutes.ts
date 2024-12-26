import express, { Router } from "express";
import {
    activateProduct, adminAddProduct, adminDeleteProduct,
    adminGetAllProducts, adminUpdateProduct, deactivateProduct, getadminAllProducts, getProductDetails
} from "../controller/productController";


const router: Router = express.Router();

router
    // Product Routes
    .get("/products", adminGetAllProducts)
    .post("/add-product", adminAddProduct)
    .put("/update-product/:updateId", adminUpdateProduct)
    .delete("/delete-product/:deleteId", adminDeleteProduct)
    .put("/deactivate-product/:deactiveId", deactivateProduct)
    .put("/activate-product/:activeId", activateProduct)
    .get("/product-details/:productDetailId", getProductDetails)
    .get("/get-products", getadminAllProducts);

export default router;
