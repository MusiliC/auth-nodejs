const User = require("../models/UserAuth");
const bcrypt = require("bcryptjs");
const errorHandler = require("../utils/error");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  console.log(req.body);

  const { username, email, password } = await req.body;

  if (!email || !password) {
    next(errorHandler(400, "All fields are required"));
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      next(errorHandler(400, "User exists"));
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });

    await newUser.save();

    res.json({ message: "Signup successful" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  //console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const validPassword = bcrypt.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(404, "Invalid password"));
    }

    const token = await jwt.sign(
      {
        id: validUser._id,
        isAdmin: validUser.isAdmin,
      },
      process.env.JWT_SECRET
    );

    const { password: userPassword, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json({ ...rest, token });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      users,
    });
  } catch (error) {
    next(error);
  }
};

const sayHello = async (req, res) => {
  res.json("Hello world");
};

module.exports = {
  register,
  login,
  sayHello,
  getUsers,
};
