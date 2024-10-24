// src/utils/response-handlers/sendToken.js

export const sendToken = async (res, user, message, statusCode) => {
  const token = await user.getJwtToken(); // Get JWT token from user model

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Secure the token
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Adjust SameSite attribute
  };

  res
    .cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    })
    .status(200)
    .json({
      success: true,
      statusCode,
      message,
      user,
    });
  // // Send access token as a cookie
  // res.cookie("accessToken", token, cookieOptions).status(200).json({
  //   success: true,
  //   statusCode,
  //   message,
  //   user,
  // });
};

export default sendToken;
