const express = require("express");
const { register, login, sayHello} = require("../controllers/auth.controller");

const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.get("/hello", sayHello)


module.exports = router;
