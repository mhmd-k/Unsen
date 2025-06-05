import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.ACCESS_SECRET,
    { expiresIn: "1m" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.REFRESH_SECRET,
    {
      expiresIn: "14d",
    }
  );
};

export const storeRefreshTokenInCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000 * 14, // 14 day
  });
};
