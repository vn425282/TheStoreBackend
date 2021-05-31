var express = require("express");

const ProductController = require("../controllers/ProductController");
var router = express.Router();

// POST
router.post("/uploadProduct", ProductController.insertProductToDB);
router.post("/uploadImage", ProductController.uploadImage);
router.post("/getProducts", ProductController.getProducts);

// GET
router.get("/getProductDetail/:id", ProductController.getProductDetail);

module.exports = router;
