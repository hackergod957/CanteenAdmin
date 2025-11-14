require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const studentRouter = require('./routes/student')



const app = express()


app.use(express.json())

app.use("/api/students", studentRouter)

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
