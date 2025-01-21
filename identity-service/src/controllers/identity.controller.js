import { User } from "../models/user.model.js";
import { generateTokens } from "../utils/generateToken.js";
import { logger } from "../utils/logger.js";
import { validateRegistration } from "../utils/validation.js";

//user registration
export const registerUser = async (req, res) => {
  logger.info("registration end point hit...");
  try {
    //validate the schema
    const { error } = validateRegistration(req.body);
    if (error) {
      logger.warn("validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { email, password, userName } = req.body;
    let user = await User.find({
      $or: [{ email }, { password }],
    });
    if (user) {
      logger.warn("User already exists");
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    user = new User.create({ email, password, userName });
    logger.warn("User saved successfully");
    const { accessToken, refreshToken } = generateTokens(user);
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    logger.error("registration error occured",err)
    return res.status(200).json({
      success: false,
      message: "Internal server error",
    });
  }
};
//user login
//refresh token
//logout
