import { useContext, useState } from "react";
import {
  Grid,
  Button,
  Typography,
  makeStyles,
  Paper,
  Modal,
  TextField,
} from "@material-ui/core";
import axios from "axios";
import { Redirect } from "react-router-dom";
import "../index.css"

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";

import img from './login-img.png';
const useStyles = makeStyles((theme) => ({
  body: {
    padding: "60px 60px",
  },
  inputBox: {
    width: "300px",
  },
  submitButton: {
    width: "300px",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const Login = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [loggedin, setLoggedin] = useState(isAuth());

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const [openReset, setOpenReset] = useState(false);
  const [resetDetails, setResetDetails] = useState({
    email: "",
    password: "",
  });

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: {
      error: false,
      message: "",
    },
    password: {
      error: false,
      message: "",
    },
  });

  const handleInput = (key, value) => {
    setLoginDetails({
      ...loginDetails,
      [key]: value,
    });
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        error: status,
        message: message,
      },
    });
  };

  const handleLogin = () => {
    const verified = !Object.keys(inputErrorHandler).some((obj) => {
      return inputErrorHandler[obj].error;
    });
    if (verified) {
      axios
        .post(apiList.login, loginDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Logged in successfully",
          });
          console.log(response);
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
          console.log(err.response);
        });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "Incorrect Input",
      });
    }
  };

  const handleResetPassword = () => {
    if (resetDetails.email === "" || resetDetails.password === "") {
      setPopup({
        open: true,
        severity: "error",
        message: "Please fill all fields.",
      });
      return;
    }
    axios
      .post(apiList.resetPassword, resetDetails)
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        setOpenReset(false);
        setResetDetails({ email: "", password: "" });
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Error resetting password.",
        });
      });
  };

  return loggedin ? (
    <Redirect to="/" />
  ) : (
    <>
    <Grid container direction="row" >
      <div style={{alignItems:"center", marginLeft:"15%",marginTop:""}}>
        <img src={img} alt="Login"
          width="400px" height="450px" />
      </div>
    <Paper elevation={3} className={classes.body}>
      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        <Grid container direction="column" spacing={4} alignItems="center">
        
          <Grid item>
            <Typography variant="h3" component="h2" style={{color:"#3f51b5",fontWeight:"bold"}}>
              Welcome back, Login!
            </Typography>
          </Grid>

          <Grid item>
            <EmailInput
              label="Email"
              value={loginDetails.email}
              onChange={(event) => handleInput("email", event.target.value)}
              inputErrorHandler={inputErrorHandler}
              handleInputError={handleInputError}
              className={classes.inputBox}
            />
          </Grid>
          <Grid item>
            <PasswordInput
              label="Password"
              value={loginDetails.password}
              onChange={(event) => handleInput("password", event.target.value)}
              className={classes.inputBox}
            />
          </Grid>
          <Grid item style={{ width: "300px", display: "flex", justifyContent: "flex-end", marginTop: "-16px", paddingBottom: "0" }}>
            <Button
              style={{ textTransform: "none", color: "#3f51b5", fontSize: "14px", fontWeight: "500", padding: 0 }}
              onClick={() => {
                setOpenReset(true);
              }}
            >
              Forgot Password?
            </Button>
          </Grid>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submitButton}
              style={{borderRadius:"8px",width:"130px",height:"50px"}}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  </Grid>
  <Modal
    open={openReset}
    onClose={() => setOpenReset(false)}
    className={classes.popupDialog}
  >
    <Paper
      style={{
        padding: "30px",
        outline: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minWidth: "400px",
        alignItems: "center",
        borderRadius: "10px",
      }}
    >
      <Typography variant="h5" style={{ marginBottom: "20px", fontWeight: "bold", color: "#3f51b5" }}>
        Reset Password
      </Typography>
      <TextField
        label="Email Address"
        variant="outlined"
        type="email"
        fullWidth
        value={resetDetails.email}
        onChange={(event) =>
          setResetDetails({
            ...resetDetails,
            email: event.target.value,
          })
        }
        style={{ marginBottom: "20px" }}
      />
      <TextField
        label="New Password"
        variant="outlined"
        type="password"
        fullWidth
        value={resetDetails.password}
        onChange={(event) =>
          setResetDetails({
            ...resetDetails,
            password: event.target.value,
          })
        }
        style={{ marginBottom: "30px" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleResetPassword}
        style={{ padding: "10px 40px", borderRadius: "8px" }}
      >
        Update Password
      </Button>
    </Paper>
  </Modal>
  </>
  );
};

export default Login;
