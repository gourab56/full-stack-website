import asyncHandler from "../utils/asynHandler.js";
import ApiError from "../utils/apierror.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.models.js";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  const token=  req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ", "");
  console.log("Access token received:", token);

   if(!token) {
    throw new ApiError(401, "Access token is required");
   }
   try{
   const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);// Verify the token FROM ENVIROMENT
   const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
   if(!user) {
    throw new ApiError(404, "User not found");
   }
    req.user = user;
    next() 
    //it gives user details   stored in database
    // Attach the user to the request object
} catch (error) {
    console.error("JWT verification error:", error);

    throw  new ApiError(401, "Invalid access token");
}
})