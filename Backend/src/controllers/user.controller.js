import asynHandler from '../utils/asynHandler.js';
import ApiError from '../utils/apierror.js';
import { User } from '../models/user.models.js';
import { uploadCloudinary } from '../utils/cloudinary.js';
import { Apiresponse } from '../utils/Apiresponse.js';
import jwt from 'jsonwebtoken';
import { Work } from '../models/work.models.js';
const generateAcessAndRefreshToken =async(userId)=>{
  try{
    const user= await User.findById(userId);
     const accessToken=user.generateAccessToken ()
     const refreshToken=user.generateRefreshToken()
     user.refreshToken = refreshToken;
   await  user.save({validateBeforeSave: false});
return { accessToken, refreshToken };//used for token
  }
  catch(error){
    throw new ApiError(500, "Failed to generate access and refresh token");
  }
}
const registerUser = asynHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  console.log("email:", email);
  if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // Prevent duplicate users
  const existingUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists with this username or email");
  }

  // Handle file uploads
  console.log("req.files:", req.files);

  const avatarLocalPath = req.files?.["avatar"]?.[0]?.path;
  const coverImagePath = req.files?.["coverImage"]?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  const avatar = await uploadCloudinary(avatarLocalPath);
  const coverImage = await uploadCloudinary(coverImagePath);

  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar image");
  }

  // Create user in database
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    username: username.toLowerCase(),
    password,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  return res.status(201).json(
    new Apiresponse(201, createdUser, "User created successfully")
  );
});
const loginUser = asynHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAcessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true, // ❗ Use false on localhost
    sameSite: "None"
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new Apiresponse(
        200,
        {
          user: loggedInUser,
          accessToken
        },
        "Login successful"
      )
    );
});

const logoutUser = asynHandler(async (req, res) => {
 await User.findByIdAndUpdate(req.user._id,
  {
$set: { refreshToken: undefined }
  },{
    new: true
  })
  const options={
  httpOnly: true,
  secure:true,
  sameSite: "None"
 }
  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
.json(
    new Apiresponse(200, {}, "Logout successful"))

});
const refreshAccessToken = asynHandler(async (req, res) => {
  //first take token
  //match this token with environment and decoded token
  //find the id using decoded token and find the id and know all details of user
  //if incoming token and stored refresh token in databse(user) match then
  //
  const incomingRefreshToken= req.cookies.refreshToken||req.body.refreshToken
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is required");}
    //need of raw token
    try{
   const decodedToken= jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET) 
    const user= await User.findById(decodedToken?._id)
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    if(incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, " refresh token is expired");
    }
const options = {
  httpOnly: true,
  secure: true, 
}
  const {accessToken,newrefreshToken}=await generateAcessAndRefreshToken(user._id)
 return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", newrefreshToken, options)
  .json(
    new Apiresponse(200, { accessToken ,refreshToken: newrefreshToken},
      "Refresh token generated successfully"
    )
    )
  }catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }
})
  const changeCurrentPassword = asynHandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    if(!(oldPassword && newPassword)) {
      throw new ApiError(400, "Old password and new password are required");
    }
      const user=await User.findById(req.user?._id)
      if(!user) {
        throw new ApiError(404, "User not found");
      }
      const isPasswordCorrect= user.isPasswordCorrect(oldPassword)
      if(!isPasswordCorrect) {
        throw new ApiError(400, "Old password is incorrect");
      }
      user.password = newPassword;
       await user.save({validateBeforeSave: false})
       return res.status(200).json(
        new Apiresponse(200, {}, "Password changed successfully"))

  })
  const getCurrentUser = asynHandler(async (req, res) => {

    return res
    .status(200)
    .json(
      new Apiresponse(
      200, req.user, "Current user retrieved successfully")
    )
  })
  const updateAccountDetails=asynHandler(async (req, res) => {
    const{fullname,email,username}=req.body;
    if(!fullname || !email || !username) {
      throw new ApiError(400, "Fullname, email and username are required");
    }
     const user=  await User.findByIdAndUpdate(req.user?._id,{
      $set:{
        fullname,//fullname:fullnamecan be write in that way
        email,
        username: username.toLowerCase(),
      }
     },{
     new: true})
      .select("-password")
      return res.status(200).json(
        new Apiresponse(200, user, "Account details updated successfully"));
      
     })
     const updateAvatar = asynHandler(async (req, res) => {
      //login
      //change
      //uploaad
      const avatarLocalPath = req.file?.path
      if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
      }
      const avatar=  await uploadCloudinary(avatarLocalPath)//name  matches with the name 
      if (!avatar.url) {
        throw new ApiError(500, "Failed to upload avatar url");
      }
       const user=await User.findByIdAndUpdate(req.user._id, {
        $set:{
          avatar: avatar.url
        }
      }
      ,{
        new:true
      }).select("-password")
      return res.status(200).json(
        new Apiresponse(200, user, "Avatar updated successfully"));

     })
     const updateCoverImage =   asynHandler(async (req, res) => {

      const coverImageLocalPath =req.file?.path
      if(!coverImageLocalPath) {
        throw new ApiError(400, "Cover image is required");
      }
      const coverImage=await uploadCloudinary(coverImageLocalPath)
      if(!coverImage.url) {
        throw new ApiError(500, "Failed to upload cover image");
      }
     
     const user= await User.findByIdAndUpdate( req.user?._id,{
      $set: {
        coverImage: coverImage.url
      }},
        {
        new: true
        
        })
      .select("-password")
      return res.status(200).json(
        new Apiresponse(200, user, "Cover image updated successfully"));
      })
const createWork=  asynHandler(async(req,res)=>{
const{title,githubUrl,description}=req.body
const user=req.user._id;
if(!user){
  throw new ApiError(400,"user is not found increate work");
}
if(!title)
{
  throw new ApiError(401,"title is required");
}
let resumeUrl='';
if(req.file?.path){
  const uploaded=await uploadCloudinary(req.file.path)
  if(!uploaded?.url){
    throw new ApiError(500,"error due to resumeurl")
  }
  resumeUrl=uploaded.url;
}
const newWork=await Work.create({
  user:user,
  title,
  githubUrl,

  description,
  resumeUrl
  
},{new:true});
res.status(200).json(
  new Apiresponse(200,newWork,"work successfully appear")
)

})
const getMyWorks = asynHandler(async (req, res) => {
  const works = await Work.find({ user: req.user._id }).sort({ createdAt: -1 });

  return res.status(200).json(
    new Apiresponse(200, works, "Works fetched successfully")
  );
});

  const deleteWork=asynHandler(async(req,res)=>{
    const workId=req.params.id;;
    const userId=req.user._id;
    const work=await Work.findById(workId)
    if(!work){
      throw new ApiError(404,"work not found ")
    }
    if(work.user.toString()!==userId.toString()){
      throw new ApiError(403,"you are not authorized to delete");
    }
    await Work.findByIdAndDelete(workId);
    return res.status(200).json(
      new Apiresponse(200,null,"work delete successfully")
    );
  })
    
  
export { registerUser 
, loginUser,logoutUser,
refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails,updateAvatar,
updateCoverImage,
createWork,
getMyWorks,
deleteWork

};
