import { User } from "../../models/user.js";
import generateToken from "../../utils/generateJWT.js";
import bcrypt from "bcrypt"

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User exists" });

    const user = await User.create({ email, password });
    const token = generateToken(user);
    res.status(201).json({ user: { id: user._id, email: user.email }, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user);
    res.status(200).json({ message: `You've succsessfuly logged in! Here is your token${token}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUserById = async (req, res) => {
  const { id } = req.params;
  const {email, password, roles } = req.body;

  const updateData = {};
  if (email) updateData.email = email;
  if (password) updateData.password = await bcrypt.hash(password, 10);
  if (roles && req.user.roles !== "admin" && roles === "admin") {
    return res.status(403).json({ message: "You can't assign admin role" });
  }
  if (roles === "moderator" || roles === "admin") {
    updateData.role = roles;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json({
      message: "User updated",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        role: updatedUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
