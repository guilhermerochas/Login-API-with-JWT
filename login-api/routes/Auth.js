const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv/config");
const pool = require("../db/database");
const schema = require("../validate");

//Route for register and creating a new user
router.post("/register", async (req, res) => {
  //Trying to validate the data
  const validation = await schema.validate({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    //Checking if there's any error messages
    const errorMessage = validation.error.details[0].message;
    return res.status(400).send(errorMessage);
  } catch {
    try {
      //Hashing the password
      const hashPassword = await bcrypt.hash(req.body.password, 10);

      //Check if user's email is already in the database
      const validateEmail = await pool.query(
        "SELECT * FROM users WHERE user_email = $1;",
        [req.body.email]
      );
      if (validateEmail.rows.length != 0) {
        return res.status(400).send("user is already registered");
      } else {
        //Inserting the new user into the database
        await pool.query(
          "INSERT INTO users(user_name, user_email, user_password) VALUES ($1, $2, $3);",
          [req.body.name, req.body.email, hashPassword]
        );
        return res.status(200).send("user registered with success");
      }
    } catch (err) {
      return res.status(400).send("Wasn't able to insert user: " + err);
    }
  }
});

//Router for the user login with his account
router.post("/login", async (req, res) => {
  //Check if email is already registered
  const User = await pool.query(
    "SELECT id,user_name ,user_email, user_password FROM users WHERE user_email = $1;",
    [req.body.email]
  );
  if (User.rows.length == 0) {
    return res.status(400).send("the email doesn't isn't registered");
  } else {
    //Check if passowrd is correct
    const validatePassword = await bcrypt.compare(
      req.body.password,
      User.rows[0].user_password
    );
    if (!validatePassword) {
      return res.status(400).send("password incorrect");
    } else {
      const token = jwt.sign(
        { id_token: User.rows[0].id },
        process.env.SECRET_TOKEN
      );
      res.header("auth-token", token);

      res.status(200).send("user logged in!");
    }
  }
});

module.exports = router;
