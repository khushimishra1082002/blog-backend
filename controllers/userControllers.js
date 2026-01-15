const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getUsers = async (req, res) => {
  try {
    const user = await User.find();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const image = req.file ? req.file.filename : "";
    console.log(image);
    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      image,
    });
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedData = req.body;
//     console.log("updatedData", updatedData);
//     const user = await User.findByIdAndUpdate(id, updatedData, { new: true });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json({ message: "User updated successfully", user });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const updatedData = {
//       ...req.body,
//     };

//     console.log("fgdgd",updatedData);
    

//     // ✅ image agar aayi ho to add karo
//     if (req.file) {
//       updatedData.image = req.file.filename;
//     }

//     const user = await User.findByIdAndUpdate(id, updatedData, {
//       new: true,
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({
//       message: "User updated successfully",
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const updatedData = { ...req.body }; // req.body fields string me

//     // ✅ Agar image upload hui ho
//     if (req.file) {
//       updatedData.image = req.file.filename; // filename string
//     }

//     const user = await User.findByIdAndUpdate(id, updatedData, { new: true });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({
//       message: "User updated successfully",
//       user,
//     });
//   } catch (error) {
//     console.error("Edit user error:", error);
//     res.status(500).json({ message: error.message, stack: error.stack });
//   }
// };


// const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // req.body me sirf string fields rakho, image ko req.file se handle karo
//     const { name, email, password, role } = req.body;
//     const updatedData: any = { name, email, password, role };

//     // Agar file upload hui ho
//     if (req.file) {
//       updatedData.image = req.file.filename; // ✅ string
//     }

//     const user = await User.findByIdAndUpdate(id, updatedData, { new: true });

//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.status(200).json({ message: "User updated successfully", user });
//   } catch (error: any) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, email, password, role } = req.body;
    const updatedData = { name, email, password, role }; // removed :any

    // If file uploaded
    if (req.file) {
      updatedData.image = req.file.filename; // string
    }

    const user = await User.findByIdAndUpdate(id, updatedData, { new: true });

    console.log("uu", user);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};




const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: " User deleted successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(id);
    console.log(user);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    //compare password
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      res.status(400).json({ message: "Oldpassword is incorrect" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password do not match" });
    }
    //Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
};
