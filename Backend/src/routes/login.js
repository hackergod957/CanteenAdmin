const express = require('express')
const { signInAsGuest, signInAsAdmin } = require('../controllers/auth')
const loginRouter = express.Router()

loginRouter.use("/guest",signInAsGuest)
loginRouter.use("/admin",signInAsAdmin)

module.exports = loginRouter