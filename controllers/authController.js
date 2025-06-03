import User from "../models/User.js"
import generateToken from "../utils/JWT_Generate.js"

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User exists' });

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
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.status(200).json({message: "You've succsessfuly logged in!"});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
