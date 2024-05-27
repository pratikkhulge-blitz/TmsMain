

// const bcrypt = require("bcrypt");
// const jwtService = require("../services/JWT");
// const Admin = require("../models/Admin");
// const User = require("../models/User");

// // Admin login
// module.exports.adminLogin = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     // Find admin by email
//     const admin = await Admin.findOne({ email });
//     if (!admin) {
//       return res.status(404).send({ message: "No such admin found. Please sign up first." });
//     }

//     // Check if admin is verified
//     if (!admin.active) {
//       return res.status(401).send({ message: "Admin not verified. Please verify your email first." });
//     }

//     // Verify password
//     const passwordMatch = await bcrypt.compare(password, admin.password);
//     if (!passwordMatch) {
//       return res.status(401).send({ message: "Incorrect email or password." });
//     }

//     // Generate JWT token
//     const token = jwtService.signToken({ email: admin.email, role: "admin" });
//     res.setHeader('Authorization', `Bearer ${token}`);
//     res.status(200).send({ message: "Login successful." ,token});
//   } catch (error) {
//     console.error("Admin login error:", error);
//     res.status(500).send({ message: "Internal server error." });
//   }
// };

// // User login
// module.exports.userLogin = async (req, res) => {
//   const { email, password, organisation_name } = req.body;
//   try {
//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).send({ message: "No such user found. Please sign up first." });
//     }

//     // Check if user is verified
//     if (!user.active) {
//       return res.status(401).send({ message: "User not verified. Please verify your email first." });
//     }

//     // Check if the user belongs to the selected organization
//     if (!user.organisationNames.includes(organisation_name)) {
//       return res.status(403).send({ message: "You are not a member of the selected organization." });
//     }

//     // Verify password
//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       return res.status(401).send({ message: "Incorrect email or password." });
//     }

//     // Generate JWT token

//     const token = jwtService.signToken({ email: user.email, role: "user", organisation: organisation_name });
//     // !console.log("organisation passing to JWT" , organisation_name);
//     res.setHeader('Authorization', `Bearer ${token}`);
//     res.status(200).send({success:true , message: "Login successful.", token });
//   } catch (error) {
//     console.error("User login error:", error);
//     res.status(500).send({ success:false ,message: "Internal server error." });
//   }
// };



// module.exports.userLoginWithOtp = async (req, res) => {
//   const { email, otp, organisation_name } = req.body;
//   try {
//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).send({ message: "No such user found. Please sign up first." });
//     }

//     // Check if user is verified
//     if (!user.active) {
//       return res.status(401).send({ message: "User not verified. Please verify your email first." });
//     }

//     // Check if the user belongs to the selected organization
//     if (!user.organisationNames.includes(organisation_name)) {
//       return res.status(403).send({ message: "You are not a member of the selected organization." });
//     }

//     // Verify otp
//     console.log(otp)
//     console.log(user.otp.code)
//     const { code, createdAt } = user.otp;
//     const currentTime = new Date();
//     const timeDifference = currentTime - new Date(createdAt);
//     if (code !== otp || timeDifference > 60000) {
//       res.status(402).send({success:false, message:"Invalid or expired OTP"});
//     }

//     // Generate JWT token

//     const token = jwtService.signToken({ email: user.email, role: "user", organisation: organisation_name });
//     // !console.log("organisation passing to JWT" , organisation_name);
//     res.setHeader('Authorization', `Bearer ${token}`);
//     const updatedUser = await User.findByIdAndUpdate(user._id, {
//       $unset: { otp: 1 }, // Remove OTP from user's record
//     });

//     res.status(200).send({ success:true , message: "Login successful.", token });
//   } catch (error) {
//     console.error("User login error:", error);
//     res.status(500).send({ message: "Internal server error." });
//   }
// };



