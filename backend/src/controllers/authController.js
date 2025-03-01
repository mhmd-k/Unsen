const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" }
  );
};

class AuthController {
  generateRefreshToken(user) {
    return jwt.sign(
      { userId: user._id, email: user.email },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "1d",
      }
    );
  }

  storeRefreshTokenInCookie(res, refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1-day expiration
    });
  }

  login = async (req, res) => {
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user)
        return res.status(401).json({ message: "Invalid credentials" });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res.status(401).json({ message: "Invalid credentials" });

      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = await this.generateRefreshToken(user);

      this.storeRefreshTokenInCookie(res, refreshToken);

      res.json({ user: { ...user._doc, password: undefined, accessToken } });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  };

  signup = async (req, res) => {
    const { username, email, password, role } = req.body;

    console.log("request body: ", req.body);

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Invalid request, missing fields" });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(409).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      console.log("hashed password: ", hashedPassword);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role: role || "CUSTOMER",
      });

      console.log("new user: ", newUser);

      const createdUser = await newUser.save();

      console.log("created user._doc: ", createdUser._doc);

      const accessToken = generateAccessToken(createdUser._doc);
      console.log("access token: ", accessToken);

      const refreshToken = this.generateRefreshToken(createdUser._doc);
      console.log("refresh token: ", refreshToken);

      this.storeRefreshTokenInCookie(res, refreshToken);

      console.log("refresh token stored in cookie");

      res.status(201).json({
        ...createdUser._doc,
        id: createdUser._doc._id,
        _id: undefined,
        __v: undefined,
        password: undefined,
        accessToken,
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  };

  refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: "Refresh token required" });

    try {
      if (!storedToken)
        return res.status(403).json({ message: "Invalid refresh token" });

      jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET,
        async (err, decoded) => {
          if (err)
            return res.status(403).json({ message: "Invalid refresh token" });

          const user = await User.findById(decoded.userId);
          if (!user) return res.status(404).json({ message: "User not found" });

          const newAccessToken = this.generateAccessToken(user);
          const newRefreshToken = await this.generateRefreshToken(user);

          this.storeRefreshTokenInCookie(res, newRefreshToken);

          res.status(200).json({
            user: {
              ...user._doc,
              password: undefined,
              accessToken: newAccessToken,
            },
          });
        }
      );
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  };

  logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(204).send(); // ✅ No content if no token

    try {
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

module.exports = new AuthController();
