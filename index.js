const express = require("express");
const app = express();
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path")

const authRoutes = require("./routes/authRoutes");
const blogPostsRoute = require("./routes/blogPostsRoutes");
const userRoutes = require("./routes/userRoutes");
const commentRoutes = require("./routes/commentRoutes");
const likesRoutes = require("./routes/likesRoutes");
const disLikeRoutes = require("./routes/dislikeRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const searchRoutes = require("./routes/searchRoutes");
const subsribeRoutes = require("./routes/subscribeRoutes")


//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

//Connect to the database
connectDB()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection error", err));

  // Routes
  app.get("/", (req, res) => {
  res.send("Welcome to the Blog API!");
});

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

const uploadsPath = path.join(__dirname,"uploads")
app.use("/uploads", express.static(uploadsPath));


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

module.exports = app
