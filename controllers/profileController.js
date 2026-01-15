const User = require("../models/User");

const getMyProfile = async (req, res) => {
  try {
    console.log("req.user:", req.user);
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const updateMyProfile = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const image = req.file ? req.file.path : undefined;

//     const updateData = { name, email };
//     if (image) updateData.image = image;

//     if (password) {
//       updateData.password = await bcrypt.hash(password, 10);
//     }

//     const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
//       new: true,
//     }).select("-password");

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

module.exports = { getMyProfile };
