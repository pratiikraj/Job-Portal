const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET || "jwt_secret";

const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");

const router = express.Router();

router.post("/signup", (req, res) => {
  const data = req.body;
  if(data.password.length <8){
    res.status(400).json({
      message:"Password must be more than 8 characters.",
    })
    return;
  }
  User.findOne({email:data.email})
  .then((user)=>{
    if(user!= null){
      res.status(400).json({
        message: "The email address you have entered is already associated with another account.",
      });
      return;
    }else{
        let user = new User({
          email: data.email,
          password: data.password,
          type: data.type,
        });

        user
          .save()
          .then(() => {
            const userDetails =
              user.type == "recruiter"
                ? new Recruiter({
                    userId: user._id,
                    name: data.name,
                    contactNumber: data.contactNumber,
                    bio: data.bio,
                    website: data.website,
                    jobDescription: data.jobDescription,
                    department: data.department,
                  })
                : new JobApplicant({
                    userId: user._id,
                    name: data.name,
                    education: data.education,
                    skills: data.skills,
                    rating: data.rating,
                    resume: data.resume,
                    profile: data.profile,
                  });

            userDetails
              .save()
              .then(() => {
                // Token
                const token = jwt.sign({ _id: user._id }, jwtSecretKey);
                res.json({
                  token: token,
                  type: user.type,
                });
              })
              .catch((err) => {
                user
                  .delete()
                  .then(() => {
                    res.status(400).json(err);
                  })
                  .catch((err) => {
                    res.json({ error: err });
                  });
                err;
              });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
        }
      })
});

router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(401).json(info);
        return;
      }
      // Token
      const token = jwt.sign({ _id: user._id }, jwtSecretKey);
      res.json({
        token: token,
        type: user.type,
      });
    }
  )(req, res, next);
});

router.post("/reset-password", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be more than 8 characters.",
    });
  }

  User.findOne({ email: email.toLowerCase() })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found with this email address." });
      }
      user.password = password;
      user.save()
        .then(() => {
          res.json({ message: "Password updated successfully." });
        })
        .catch((err) => {
          res.status(500).json({ message: "Error updating password.", error: err });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: "Database error.", error: err });
    });
});

module.exports = router;
