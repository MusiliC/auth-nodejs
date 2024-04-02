const express = require("express");
const { register, login, sayHello, getUsers} = require("../controllers/auth.controller");

const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.get("/hello", sayHello)
router.get("/users", getUsers)


module.exports = router;
