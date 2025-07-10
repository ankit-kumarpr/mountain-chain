const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const path = require("path");
const fs = require("fs");
// const sendemail =require('../Mailtemplate/')
// register admiin

const RegisterAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hash,
      role: "Admin",
    });
    res.status(201).json({
      success: true,
      message: "Admin register successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// register other users

const RegisterotherRoles = async (req, res) => {
  const { name, email, phone, role } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });

    const user = await User.create({ name, email, phone, role });
    const html = fs.readFileSync(
      path.join(__dirname, "../Mailtemplate/setPasswordTemplate.html"),
      "utf-8"
    );
    const link = `${process.env.CLIENT_URL}/set-password/${email}`;
    console.log("link", link);
    const mailContent = html
      .replace("{{name}}", name)
      .replace("{{setPasswordLink}}", link);
    console.log("mailcontent", mailContent);
    await sendEmail(email, "Set your password - Mountain Chain", mailContent);

    res.status(201).json({
      success: true,
      message: "User created and email sent",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// set users password

const SetPassword = async (req, res) => {
  const { email } = req.params;
  try {
    const { password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        message: false,
        message: "User not found",
      });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return res.status(200).json({
      sucsess: true,
      message: "Password Set successfully You can lgin now",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Resend email

const ResendEmailToAnyRole = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    const html = fs.readFileSync(
      path.join(__dirname, "../Mailtemplate/setPasswordTemplate.html"),
      "utf-8"
    );
    const link = `${process.env.CLIENT_URL}/set-password/${email}`;
    const mailContent = html
      .replace("{{name}}", user.name)
      .replace("{{setPasswordLink}}", link);

    await sendEmail(
      email,
      "Set your password - Mountain Chain (Resent)",
      mailContent
    );

    return res.status(200).json({
      success: true,
      message: "Email Send Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// login user

const LoginAnyUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.password)
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });

    const token = generateToken(user);
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// delete any user

const DeleteAnyUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }

    const deluser = await User.findByIdAndDelete(id);
    if (!deluser) {
      return res.status(404).json({
        success: false,
        message: "User Not delete|| User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User Deleted successfully",
      data: deluser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  RegisterAdmin,
  RegisterotherRoles,
  SetPassword,
  ResendEmailToAnyRole,
  LoginAnyUser,
  DeleteAnyUser,
};
