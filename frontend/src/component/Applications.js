import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  makeStyles,
  Paper,
  Typography,
  Modal,
} from "@material-ui/core";

import axios from "axios";

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  statusBlock: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
  },
  jobTileOuter: {
    padding: "30px",
    margin: "20px 0",
    boxSizing: "border-box",
    width: "100%",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const ApplicationTile = (props) => {
  const classes = useStyles();
  const { application, getData } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);

  const updateStatus = (status) => {
    const address = `${apiList.applications}/${application._id}`;
    const statusData = {
      status: status,
    };
    axios
      .put(address, statusData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        getData();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        console.log(err.response);
      });
  };

  const appliedOn = new Date(application.dateOfApplication);
  const joinedOn = new Date(application.dateOfJoining);


  const handleClose = () => {
    setOpen(false);
  };

  const colorSet = {
    applied: "#3454D1",
    shortlisted: "#09BC8A",
    accepted: "#09BC8A",
    rejected: "#D1345B",
    deleted: "#B49A67",
    cancelled: "#FF8484",
    finished: "#4EA5D9",
  };

  return (
    <Paper className={classes.jobTileOuter} elevation={3}>
      <Grid container>
        <Grid container item xs={9} spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5">{application.job.title}</Typography>
          </Grid>
          <Grid item>Posted By: {application.recruiter.name}</Grid>
          {application.job.companyName && (
            <Grid item>Company : {application.job.companyName}</Grid>
          )}
          {application.job.location && (
            <Grid item>Location : {application.job.location}</Grid>
          )}
          {application.job.description && (
            <Grid item>Description : {application.job.description}</Grid>
          )}
          {application.job.bond && (
            <Grid item>Bond : {application.job.bond}</Grid>
          )}
          {application.job.website && (
            <Grid item>
              Company Website:{" "}
              <a href={application.job.website.startsWith("http") ? application.job.website : `https://${application.job.website}`} target="_blank" rel="noopener noreferrer" style={{color: "#3f51b5", textDecoration: "none"}}>
                {application.job.website}
              </a>
            </Grid>
          )}
          {application.job.jobDescription && (
            <Grid item>
              <a
                href={application.job.jobDescription}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <Button variant="outlined" color="primary" size="small">
                  View Job Description File
                </Button>
              </a>
            </Grid>
          )}
          <Grid item>Role : {application.job.jobType}</Grid>
          <Grid item>Salary : {isNaN(application.job.salary) ? application.job.salary : `\u20B9 ${application.job.salary} per month`}</Grid>
          <Grid item>
            Duration :{" "}
            {application.job.duration !== 0
              ? `${application.job.duration} month`
              : `Flexible`}
          </Grid>
          <Grid item>
            {application.job.skillsets.map((skill) => (
              <Chip label={skill} style={{ marginRight: "2px" }} />
            ))}
          </Grid>
          <Grid item>Applied On: {appliedOn.toLocaleDateString()}</Grid>
          {application.status === "accepted" ||
          application.status === "finished" ? (
            <Grid item>Joined On: {joinedOn.toLocaleDateString()}</Grid>
          ) : null}
        </Grid>
        <Grid
          item
          container
          direction="column"
          xs={3}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "stretch",
            height: "100%",
            gap: "10px",
          }}
        >
          <Grid item xs>
            <Paper
              className={classes.statusBlock}
              style={{
                background: colorSet[application.status],
                color: "#ffffff",
                minHeight: "40px",
              }}
            >
              {application.status}
            </Paper>
          </Grid>
          {(application.status === "applied" ||
            application.status === "shortlisted") && (
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                style={{
                  background: "#ff3d00",
                  color: "#ffffff",
                  width: "100%",
                  height: "40px",
                }}
                onClick={() => updateStatus("cancelled")}
              >
                Not Interested
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>

    </Paper>
  );
};

const Applications = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = () => {
    axios
      .get(apiList.applications, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setApplications(response.data);
      })
      .catch((err) => {
        // console.log(err.response);
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h2" style={{color:"white",fontWeight:"bold"}}>Applications</Typography>
      </Grid>

      <Grid
        container
        item
        xs
        direction="column"
        style={{ width: "100%" }}
        alignItems="stretch"
        justify="center"
      >
        {applications.length > 0 ? (
          applications.map((obj) => (
            <Grid item>
              <ApplicationTile application={obj} getData={getData} />
            </Grid>
          ))
        ) : (
          <Typography variant="h5" style={{ height:"50px", textAlign: "center",
          background:"rgba(255,255,255,0.5)",marginLeft:"25%",marginRight:"25%",paddingTop:"15px"}}>
            No Applications Found
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Applications;
