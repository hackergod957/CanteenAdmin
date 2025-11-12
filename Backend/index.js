require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()


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
