const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const cloudinary = require("cloudinary").v2;

require('dotenv').config({ path: __dirname + '/.env' });

const authRouter = require("./routers/authRouter");
const postRouter = require("./routers/postRouter");
const userRouter = require("./routers/UserRouter");

const app = express();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});




app.use(cors({
  origin: "https://social-media-apna.netlify.app",
  credentials: true,
}));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/user", userRouter);


async function main() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(" MongoDB connection error:", err.message);
  }
}

main();




