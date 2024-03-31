const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth.route");
const cors = require("cors");
const morgan = require("morgan");


require("dotenv").config();

mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log("DB is connected!");
  })
  .catch((err) => {
    console.log(err);
  });


const cookieParser = require("cookie-parser");
//APP
const app = express();
//Middlewares


app.use(cookieParser());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());



app.use("/auth", authRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000..");
});
