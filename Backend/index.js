require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const studentRouter = require('./routes/student')
const dailyInfoRouter = require('./routes/dailyInfo')
const transactionRouter = require('./routes/transaction')
const menuRouter = require('./routes/menu')



const app = express()


app.use(express.json())

app.use("/api/students", studentRouter)
app.use("/api/dailyinfo",dailyInfoRouter)
app.use("/api/menu",menuRouter)
app.use("/api/transaction",transactionRouter)

// connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // only start server after DB is connected
    app.listen(process.env.PORT, () => {
      console.log('✅ Connected to DB & Listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })
