const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");



const authenticateToken = (req,res,next) => {
try{

    const token = req.header('Authorization')?.replace('Bearer ','')
    if(!token){
        return next()
    }
    const userData = jwt.verify(token,process.env.JWT_SECRET)
    req.user = userData
    return next()
}
catch(error){
    res.status(401).json({error : "Invalid or expired token"})
}
}

const signInAsGuest = (req, res) => {
  try {
    const badge = jwt.sign(
      {
        role: "guest",
        permission: ["view-menu", "view-students", "view-dailyInfo"],
        restrictions: [
          "no-modify-students",
          "no-modify-menu",
          "no-admin-access",
        ],
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(200).json({
      token: badge,
      role: "guest",
      expiresIn: "7 days",
      permissions: ["view-menu", "view-students", "view-dailyInfo"],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const signInAsAdmin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res
      .status(400)
      .json({ error: "Please Provide both username and password " });
    return;
  }
  try {
    const isValidUsername = username === process.env.ADMIN_USERNAME;
    const isValidPass = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH
    );

    if( !isValidUsername || !isValidPass){
        res.status(400).json({error: "Incorrect Username Or Password"})
        return
    }

      const badge = jwt.sign(
        {
          role: "admin",
          permission: [
            "view-menu",
            "view-students",
            "view-dailyInfo",
            "modify-students",
            "modify-menu",
            "admin-access",
          ],
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      res.status(200).json({
        token: badge,
        role: "admin",
        expiresIn: "7 days",
        permissions: [
          "view-menu",
          "view-students",
          "view-dailyInfo",
          "modify-students",
          "modify-menu",
          "admin-access",
        ],
      });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
    authenticateToken,
    signInAsAdmin,
    signInAsGuest
}