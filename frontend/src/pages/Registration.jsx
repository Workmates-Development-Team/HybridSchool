import React, { useContext, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@mui/material/Autocomplete";
import { axiosInstance } from "../utils/axios";
import GuestGaurd from "../gaurd/GuestGuard";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      <Link color="inherit" href="https://mui.com/">
        workmates
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url()",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const role = [
  { label: "Mentor", value: "mentor" },
  { label: "Normal", value: "normal" },
];

export default function Registration() {
  const classes = useStyles();
  const [inputs, setInputs] = useState();

  const { getProfile } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInputs({ ...inputs, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(inputs);
      const { data } = await axiosInstance.post("api/v1/user/register", inputs);
      console.log(data);
      window.localStorage.setItem("token", data?.token);
      axiosInstance.defaults.headers.common["Authorization"] =
        "Bearer " + data?.token;
      getProfile();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GuestGaurd>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Registration
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                variant="standard"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
                onChange={handleChange}
              />
              <TextField
                variant="standard"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={handleChange}
              />
              <TextField
                variant="standard"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChange}
              />

              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={role}
                sx={{ width: "100%", mt: 2 }}
                onChange={(event, newValue) => {
                  setInputs({ ...inputs, userType: newValue.value });
                }}
                renderInput={(params) => (
                  <TextField variant="standard" {...params} label="Role" />
                )}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleSubmit}
              >
                Sign Up
              </Button>
              <Grid container>
                <Grid item xs>
                  {/* <Link href="#" variant="body2">
                  Forgot password?
                </Link> */}
                </Grid>
                <Grid item>
                  <Link to="/login" variant="body2">
                    {"Already have an account? Sign In"}
                  </Link>
                </Grid>
              </Grid>
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Grid>
      </Grid>
    </GuestGaurd>
  );
}
