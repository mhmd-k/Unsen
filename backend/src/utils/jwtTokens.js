import jwt from "jsonwebtoken";

export const generateAccessToken = (id, email) => {
  return jwt.sign({ userId: id, email: email }, process.env.ACCESS_SECRET, {
    expiresIn: "1h",
  });
};

export const generateRefreshToken = (id, email) => {
  return jwt.sign({ userId: id, email: email }, process.env.REFRESH_SECRET, {
    expiresIn: "14d",
  });
};

export const storeRefreshTokenInCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000 * 14, // 14 day
  });
};
