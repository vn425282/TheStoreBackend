var express = require("express");

const { customLimiter } = require("../helpers/rateLimit");
const UserController = require("../controllers/UserController");
var router = express.Router();

// POST
router.post("/login", customLimiter(15, 30), UserController.userLogin);
router.post("/register", customLimiter(15, 30), UserController.insertUserToDB);
router.post("/addToCart", UserController.addToCart);

// GET
router.get("/auth", UserController.userAuth);
router.get("/getUserCart", UserController.getUserCart);

module.exports = router;
