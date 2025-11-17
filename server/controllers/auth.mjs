import { generateTokens } from "../core/utils.mjs";
import User from "../models/user.mjs";
import bcrypt from "bcrypt";
import { asyncHandler } from "../middleware/index.mjs";

const createUser = asyncHandler(async (req, res) => {
  const { email, password, fullName, role } = req.body;

  if (!email || !password || !fullName || !role) {
    throw new Error("Please fill all the fields");
  }

  const UserExists = await User.findOne({ email });
  if (UserExists) {
    res.status(400).send("User already exists");
    return;
  }

  // Hash the User password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({ email, password: hashedPassword, role, fullName });

  try {
    await newUser.save();
    // createToken()

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error("Invalid User data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (isPasswordValid) {
        const { accessToken, refreshToken, expiresIn } = generateTokens(
          existingUser._id
        );

        res.status(200).json({
          accessToken,
          refreshToken,
          expiresIn,
          user: {
            id: existingUser._id,
            email: existingUser.email,
            name: existingUser.fullName,
            role: existingUser.role,
          },
        });
      } else {
        res.status(401).json({ message: "Invalid Password" });
      }
    } else {
      res.status(401).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});
export { loginUser, getAllUsers, createUser };
