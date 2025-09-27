import React, { useState } from "react";
import { useLocation } from "react-router-dom"; // Import useNavigate for navigation
import {
  Container,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  // Grid, // Import Grid component
} from "@mui/material";

const ConfirmationPage = () => {
  const location = useLocation();
  // const navigate = useNavigate(); // Initialize navigate for programmatic navigation
  const formData = location.state || {};

  // State to manage the dialog popup
  const [open, setOpen] = useState(true);

  // Function to handle closing the popup
  const handleClose = () => {
    setOpen(false);
  };

  // Function to handle edit button click
  // const handleEdit = () => {
  //   navigate('/', { state: formData }); // Navigate back to the form page with the existing form data
  // };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      {/* Congratulations Popup */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="congratulations-dialog-title"
        aria-describedby="congratulations-dialog-description"
      >
        <DialogTitle id="congratulations-dialog-title">
          Congratulations!
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Your form has been submitted successfully!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Form Details Card */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h5" color="primary" gutterBottom>
              Your Details
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Below are the details you have submitted:
            </Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Affiliation Number:</Typography>
            <Typography variant="body1">{formData.affiliationNumber || "N/A"}</Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">School Name:</Typography>
            <Typography variant="body1">{formData.schoolName}</Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Teacher Coordinator Name:</Typography>
            <Typography variant="body1">{formData.teacherCoordinatorName}</Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Teacher Coordinator Mobile:</Typography>
            <Typography variant="body1">{formData.teacherCoordinatorMobile}</Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Teacher Coordinator Email:</Typography>
            <Typography variant="body1">{formData.teacherCoordinatorEmail}</Typography>
          </Box>

          {/* Edit Button with Reduced Size
          <Grid item xs={12} sx={{ mt: 4, textAlign: "center" }}>
            <Button
              color="primary"
              variant="contained"
              onClick={handleEdit} // Add the onClick event to handle navigation
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                width: "150px", // Set a fixed width for the button to reduce its size
              }}
            >
              Edit
            </Button>
          </Grid> */}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ConfirmationPage;
