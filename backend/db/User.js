const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("mongoose-type-email");

let schema = new mongoose.Schema(
  {
    email: {
      type: mongoose.SchemaTypes.Email,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["recruiter", "applicant"],
      required: true,
    },
    
  },
  { collation: { locale: "en" } }
);

// Password hashing
schema.pre("save", async function () {
  let user = this;

  // if the data is not modified
  if (!user.isModified("password")) {
    return;
  }

  try {
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
  } catch (err) {
    throw err;
  }
});

// Password verification upon login
schema.methods.login = function (password) {
  let user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        reject(err);
      }
      if (result) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

module.exports = mongoose.model("userauth", schema);
