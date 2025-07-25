const express = require("express");
const app = express();
const path = require("path")
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const blogPostsRoute = require("./routes/blogPostsRoutes");
const userRoutes = require("./routes/userRoutes");
const commentRoutes = require("./routes/commentRoutes");
const likesRoutes = require("./routes/likesRoutes");
const disLikeRoutes = require("./routes/dislikeRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const searchRoutes = require("./routes/searchRoutes");
const subsribeRoutes = require("./routes/subscribeRoutes")
require("dotenv").config();

const cors = require("cors");

//Middleware
app.use(express.json());
app.use(cors());
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));



//Connect to the database
connectDB()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection error", err));

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/blog-posts", blogPostsRoute);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likesRoutes);
app.use("/api/dislikes", disLikeRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/subscribe",subsribeRoutes)


// app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Welcome to the Blog API!");
});

module.exports = app;

