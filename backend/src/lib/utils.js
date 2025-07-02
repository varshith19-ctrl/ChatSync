import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie lasts for 7 days
    httpOnly: true, // Prevent JavaScript access to the cookie (security)

    //  IMPORTANT: Changed from "strict" to "none" to allow cookies in cross-site requests
    sameSite: "none",

    // IMPORTANT: 'secure' must be true when using sameSite: "none"
    // Ensures cookie is only sent over HTTPS (which Render uses in production)
    secure: true,
  });

  return token;
};

