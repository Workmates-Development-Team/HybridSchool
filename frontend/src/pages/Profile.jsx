import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  Paper,
  Table,
  TableRow,
} from "@material-ui/core";
import {
  Autocomplete,
  DialogTitle,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TextField,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { axiosInstance } from "../utils/axios";
import AuthGaurd from "@/gaurd/AuthGaurd";
import Navbar from "@/components/Navbar";
import 'bootstrap-icons/font/bootstrap-icons.css';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function Profile() {
  const { mentors, user, getProfile } = useContext(AuthContext);
  const [selectedMentors, setSelectedMentors] = useState([]);

  const handleMentorsChange = (event, value) => {
    setSelectedMentors(value);
  };
  console.log(user?.mentors);
  console.log(mentors);

  const handleAdd = async () => {
    try {
      const mentorIds = selectedMentors.map((item) => item._id);

      const { data } = await axiosInstance.put("api/v1/user/add-mentor", {
        mentorIds,
      });

      console.log(data);
      getProfile()
      setSelectedMentors([])
    } catch (error) {
      console.log(error);
    }
  };

  const [open, setOpen] = React.useState(false);

  const [id, setId] = useState(null);

  const handleClickOpen = (id) => {
    setOpen(true);
    setId(id);
  };

  const handleClose = () => {
    setOpen(false);
    setId(null);
  };

  const handleRemove = async () => {
    try {
      const { data } = await axiosInstance.delete("api/v1/user/mentors/" + id);
      console.log(data);
      getProfile()
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthGaurd>    
    
  <main>
  <div class="mx-auto bg-beta text-ta-black flex items-center">
        <div class="container max-w-7xl w-full grid grid-cols-6 items-center gap-5 py-16">
          <div class="col-span-6 md:col-span-5 flex flex-col gap-5">
            <div class="font-medium text-2xl sm:text-4xl md:text-5xl">Note</div>
            <div class="flex items-center flex-wrap gap-4 sm:gap-8">
              <div class="flex items-center gap-2">
                <img
                  alt="book"
                  loading="lazy"
                  width="24"
                  height="24"
                  decoding="async"
                  data-nimg="1"
                  src="https://tutorai.me/icon/book.svg"
                  style={{ color: "transparent" }}
                />
                <p class="opacity-70 text-sm sm:text-base md:text-lg"></p>
              </div>
              Name : {user && user.name} || Role: {user && user.userType}
            </div>
           
          </div>
        </div>
      </div>   
   
    <div
      style={{
        width: "93%",
        display: "flex",
        flexDirection: "column",
        background: "white",
        margin: "0 auto", // Center the div horizontally
        padding: "16px", // Optional: add padding for better spacing
        
      }}
    >
      <Box p={3}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Autocomplete
            sx={{background: '#fff', borderRadius: '6px'}}
              multiple
              limitTags={2}
              id="multiple-limit-tags"
              options={mentors}
              onChange={handleMentorsChange}
              getOptionLabel={(option) => option?.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  // label="Mentors"
                  placeholder="Select Your Mentors"
                />
              )}
            />
          </Grid>

          <Grid item xs={4}>
            <Button
              fullWidth
              onClick={handleAdd}
              variant="contained"
              style={{ height: "100%" }}
              color="primary"
            >
              Add Mentors
            </Button>
          </Grid>

          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650 }}
                size="small"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Mentor</TableCell>
                    <TableCell>Email Id</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {user?.mentors?.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row?.name}
                      </TableCell>
                      <TableCell>{row?.email}</TableCell>
                      <TableCell align="right">
                        <button
                          onClick={() => handleClickOpen(row?._id)}
                          type="button"
                          class="btn btn-danger"
                        >
                          <i class="bi bi-trash3"></i>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Remove Mentor from Your Account?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove your mentor from your account? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            size="small"
            variant="contained"
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleRemove}
            size="small"
            variant="contained"
            autoFocus
            color="primary"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    
    

    </div>
   
    </main>
    </AuthGaurd>

  );
}
