import { useState, useEffect } from "react";
import {
  AppBar,Toolbar,Typography,Button,makeStyles,Avatar,} from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";

import isAuth, { userType } from "../lib/isAuth";
import apiList from "../lib/apiList";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Navbar = (props) => {
  const classes = useStyles();
  let history = useHistory();
  let location = useLocation();

  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    if (isAuth() && userType() === "applicant") {
      axios
        .get(apiList.user, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setProfilePic(response.data.profile);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setProfilePic("");
    }
  }, [location]);

  const handleClick = (location) => {
    console.log(location);
    history.push(location);
  };


  return (
    <AppBar position="fixed" background= "transparent">
      <Toolbar style={{minHeight: "80px"}}>
        <Typography 
          variant="h6" 
          className={classes.title} 
          style={{fontSize: "32px",fontWeight: "800", display: "flex", alignItems: "center", cursor: "pointer"}}
          onClick={() => handleClick("/")}
        >
        <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Logo" width="40px" height="auto" style={{marginRight: "12px", borderRadius: "4px"}} />
        JOB O HUNT 
        </Typography>
        <div style={{marginTop:"20px", display: "flex", alignItems: "center"}}>
        {isAuth() ? (
          userType() === "recruiter" ? (
            <>
              
              <Button color="inherit" onClick={() => handleClick("/home")}>
              <Typography style={{fontSize:"18px"}}>Job Profiles</Typography>
              </Button>
              <Button color="inherit" onClick={() => handleClick("/addjob")}>
              <Typography style={{fontSize:"18px"}}>Add Jobs</Typography>
              </Button>
              <Button color="inherit" onClick={() => handleClick("/myjobs")}>
              <Typography style={{fontSize:"18px"}}>Applications</Typography>
              </Button>
              <Button color="inherit" onClick={() => handleClick("/employees")}>
              <Typography style={{fontSize:"18px"}}>Employees</Typography>
              </Button>
              <Button color="inherit" onClick={() => handleClick("/profile")}>
              <Typography style={{fontSize:"18px"}}>Profile</Typography>
              </Button>
              <Button color="inherit" onClick={() => handleClick("/logout")}>
              <Typography style={{fontSize:"18px"}}>Logout</Typography>
              </Button>
              <Avatar
                src={undefined}
                onClick={() => handleClick("/profile")}
                style={{
                  cursor: "pointer",
                  marginRight: "10px",
                  marginLeft: "10px",
                  width: "40px",
                  height: "40px",
                }}
              />
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => handleClick("/home")}>
              <Typography style={{fontSize:"18px"}}>Job Profiles</Typography>
              </Button>
              <Button
                color="inherit"
                onClick={() => handleClick("/applications")}
              >
                <Typography style={{fontSize:"18px"}}>Applied Jobs</Typography>
              </Button>
              <Button color="inherit" onClick={() => handleClick("/profile")}>
              <Typography style={{fontSize:"18px"}}>Profile</Typography>
              </Button>
              <Button color="inherit" onClick={() => handleClick("/logout")}>
              <Typography style={{fontSize:"18px"}}>Logout</Typography>
              </Button>
              <Avatar
                src={profilePic || undefined}
                onClick={() => handleClick("/profile")}
                style={{
                  cursor: "pointer",
                  marginRight: "10px",
                  marginLeft: "10px",
                  width: "40px",
                  height: "40px",
                }}
              />
            </>
          )
        ) : (
          <>
            <Button color="inherit" onClick={() => handleClick("/login")}>
              <Typography style={{fontSize:"18px"}}>Login</Typography>
            </Button>
            <Button color="inherit" onClick={() => handleClick("/signup")}>
            <Typography style={{fontSize:"18px"}}>SignUp</Typography>
            </Button>
          </>
        )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
