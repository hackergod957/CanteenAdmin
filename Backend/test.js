const bcrypt = require("bcrypt");

const password = "admin123"; // put your password here
const saltRounds = 10;

bcrypt.hash(password, saltRounds)
  .then(hash => {
    console.log("Hashed password:", hash);
  })
  .catch(err => {
    console.error(err);
  });
