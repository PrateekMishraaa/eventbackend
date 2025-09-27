import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import MaterialTable from "material-table";
import CallIcon from "@material-ui/icons/Call";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import Tooltip from "@material-ui/core/Tooltip";
import Radio from "@material-ui/core/Radio";
import { useMediaQuery } from "@mui/material";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

const getFileUrl = (path) =>
  `${process.env.REACT_APP_API_BASE_URL}/${path.replace(/\\/g, "/")}`;

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

const DistrictTable = () => {
  const district = localStorage.getItem("district") || "";
  const state = localStorage.getItem("state");
  const role = localStorage.getItem("role");
  const [data, setData] = useState([]);
  const [status, setStatus] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [editRow, setEditRow] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const isMobile = useMediaQuery("(max-width:768px)");

  const handleOpenDialog = async (rowData) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/register/email/${rowData.email}`
      );
      setSelectedRow(res.data);
      setOpenDialog(true);
      setTabIndex(0);
    } catch (error) {
      console.error("Error fetching detailed data:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRow(null);
  };

  const fetchData = useCallback(async () => {
    try {
      let res;
      if (role === "admin") {
        res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/register/alldata`
        );
      } else if (role === "subadmin") {
        res = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/register/subadmindata`,
          { state, district }
        );
      }
      const temp = res.data.map((item) => ({
        id: item._id,
        schoolName: item.schoolName,
        email: item.email,
        teacherName: item.teacherName,
        teacherContact: item.teacherContact,
        isProgram: item.isProgram,
        uploadLetter: item.uploadLetter,
        uploadImage: item.uploadImage,
        uploadVideo: item.uploadVideo,
      }));
      setData(temp || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }, [role, state, district]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);



 const isAllFilesUploaded = (rowData) => {
  return (
    rowData.uploadImage?.length &&
    rowData.uploadVideo?.length
  );
};

const getMissingFilesMessage = (rowData) => {
  const missing = [];
  if (!rowData.uploadImage?.length) missing.push("Images");
  if (!rowData.uploadVideo?.length) missing.push("Videos");
  return missing.length
    ? `Missing: ${missing.join(", ")}`
    : "All files uploaded";
};

const handleStatusChange = (rowData, newStatus) => {
  if (newStatus === "accept") {
    if (!isAllFilesUploaded(rowData)) {
      alert(`❌ Cannot Accept: ${getMissingFilesMessage(rowData)}`);
      return;
    }
    alert("✅ All files verified! Process completed successfully.");
  } else {
    handleWhatsAppClick(rowData.teacherContact, rowData, true);
    alert("⚠️ Rejected: Please upload missing files and resubmit.");
  }
  setStatus((prev) => ({ ...prev, [rowData.id]: newStatus }));
};




  const handleCallClick = (phoneNumber) => {
    try {
      // Validate input
      if (!phoneNumber || typeof phoneNumber !== "string") {
        alert("Please provide a valid phone number");
        return;
      }

      let cleanedNumber = phoneNumber.replace(/[^\d+]/g, "");

      // Format as international number if needed
      if (!cleanedNumber.startsWith("+")) {
        cleanedNumber = cleanedNumber.replace(/^0+/, "");
        if (cleanedNumber.length === 10) {
          cleanedNumber = `+91${cleanedNumber}`;
        }
      }

      // Detect if it's a real mobile device
      const isRealMobile =
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) && !/Windows|Macintosh/i.test(navigator.userAgent);

      if (isRealMobile) {
        window.location.href = `tel:${cleanedNumber}`;
      } else {
        navigator.clipboard
          .writeText(cleanedNumber)
          .then(() => {
            alert(
              `Cannot make calls from desktop.\nPhone number copied to clipboard:\n${cleanedNumber}\n\nYou can paste it into your phone dialer.`
            );
          })
          .catch(() => {
            alert(
              `Phone number: ${cleanedNumber}\n\nCopy this number to your phone dialer.`
            );
          });
      }
    } catch (err) {
      alert("Failed to process phone number. Please try again.");
      console.error("Call error:", err);
    }
  };

 const handleWhatsAppClick = (phoneNumber, rowData, isRejection = false) => {
  try {
    const missingFiles = [];
    if (!rowData.uploadImage?.length) missingFiles.push("Images");
    if (!rowData.uploadVideo?.length) missingFiles.push("Videos");

    let message = "School Program Submission:\n\n";

    if (isRejection) {
      // Rejection message format
      message += "❌ SUBMISSION REJECTED ❌\n\n";
      message += "Your submission requires corrections:\n\n";

      if (missingFiles.length > 0) {
        message += "MISSING DOCUMENTS:\n";
        missingFiles.forEach((field) => {
          if (field === "Images") {
            message += "• School Program Images (min 3 photos)\n";
          }
          if (field === "Videos") {
            message += "• Program Videos (min 1 video)\n";
          }
        });
        message += "\n";
      }

      message += "ACTION REQUIRED:\n";
      message += "1. Please upload all missing documents\n";
      message += "2. Ensure documents meet requirements\n";
      message += "3. Resubmit for review\n\n";
      message += "Need help? Reply to this message.\n";
    } else {
      // Non-rejection messages
      if (missingFiles.length === 2) {
        message += "❌ PENDING: Images and Videos are missing!\n";
        message += "Please upload:\n- Images\n- Videos";
      } else if (missingFiles.length > 0) {
        message += "⚠️ PENDING: Some documents are missing\n\n";
        missingFiles.forEach((field) => {
          if (field === "Images") {
            message += "• School Images are missing (required)\n";
          }
          if (field === "Videos") {
            message += "• Program Videos are missing (required)\n";
          }
        });
        message += "\nPlease upload the missing documents.";
      } else {
        message += "✅ COMPLETED: All documents received!\n";
        message += "Thank you for your submission.";
      }
    }

    const cleanedNumber = phoneNumber
      .replace(/[^\d+]/g, "")
      .replace(/^\+/, "");
    window.open(
      `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  } catch (error) {
    console.log(error);
  }
};


  const columns = [
    {
      title: "School Name",
      field: "schoolName",
      headerStyle: { fontWeight: "bold" },
      editable: "never",
    },
    {
      title: "Teacher Name",
      field: "teacherName",
      headerStyle: { fontWeight: "bold" },
      editable: "never",
    },
    {
      title: "Contact",
      field: "teacherContact",
      headerStyle: { fontWeight: "bold" },
      editable: "onUpdate", // Enable editing on double click
    },
    {
      title: "Email",
      field: "email",
      headerStyle: { fontWeight: "bold" },
      editable: "onUpdate", // Enable editing on double click
    },
    {
      title: "isProgram",
      field: "isProgram",
      headerStyle: { fontWeight: "700" },
      editable: "never",
    },
    {
      title: "Files Status",
      headerStyle: { fontWeight: "bold" },
      render: (rowData) => (
        <span style={{ color: isAllFilesUploaded(rowData) ? "green" : "red" }}>
          {getMissingFilesMessage(rowData)}
        </span>
      ),
      editable: "never", // Prevent editing this column
    },
    {
      title: "Status",
      headerStyle: { fontWeight: "bold" },
      render: (rowData) => (
        <div>
          <FormControlLabel
            control={
              <Radio
                checked={status[rowData.id] === "accept"}
                onChange={() => handleStatusChange(rowData, "accept")}
                color="primary"
              />
            }
            label="Accept"
          />
          <FormControlLabel
            control={
              <Radio
                checked={status[rowData.id] === "reject"}
                onChange={() => handleStatusChange(rowData, "reject")}
                color="secondary"
              />
            }
            label="Reject"
          />
        </div>
      ),
      editable: "never",
    },
    {
      title: "WhatsApp Status",
      field: "whatsappStatus",
      headerStyle: { fontWeight: "bold" },
      render: (rowData) => (
        <span
          style={{
            color:
              rowData.whatsappStatus === "Read"
                ? "green"
                : rowData.whatsappStatus === "Delivered"
                ? "blue"
                : rowData.whatsappStatus === "Sent"
                ? "orange"
                : "gray",
          }}
        >
          {rowData.whatsappStatus || "Not sent"}
        </span>
      ),
      editable: "never",
    },
    {
      title: "Actions",
      render: (rowData) => (
        <div>
          <Tooltip title="Call">
            <IconButton onClick={() => handleCallClick(rowData.teacherContact)}>
              <CallIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="WhatsApp">
            <IconButton
              onClick={() =>
                handleWhatsAppClick(rowData.teacherContact, rowData)
              }
              style={{ color: "#25D366" }}
            >
              <WhatsAppIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Files">
            <IconButton
              onClick={() => handleOpenDialog(rowData)}
              color="primary"
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit">
            <IconButton
              onClick={() => {
                setEditRow(rowData);
                setOpenEditDialog(true);
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </div>
      ),
      editable: "never",
    },
    
   
  ];

  return (
    <>
      <>
        <style>{`
    .MTableBody,
    .MuiTableContainer-root {
      overflow-y: hidden !important;
      scrollbar-width: none !important;
    }
    .MTableBody::-webkit-scrollbar,
    .MuiTableContainer-root::-webkit-scrollbar {
      display: none !important;
    }
  `}</style>

        <div style={{ padding: "20px", overflow: "hidden" }}>
          <MaterialTable
            title=""
            columns={columns}
            data={data}
            //    editable={{
            //   onRowUpdate: async (newData, oldData) => {
            //     const updatedRows = [...data];
            //     const index = oldData.tableData.id;
            //     updatedRows[index] = newData;
            //     setData(updatedRows);

            //     try {
            //       await axios.put(`/api/updateUser/${newData.id}`, {
            //         email: newData.email,
            //         teacherContact: newData.teacherContact,

            //       });
            //     } catch (error) {
            //       console.error("Failed to update:", error);
            //     }
            //   },
            // }}

            options={{
              pageSize: 10,
              pageSizeOptions: [5, 10, 20, 50],
              maxBodyHeight: undefined,
              paging: true,
            }}
            style={{
              width: "100%",
              border: "5px solid #1976d2",
              borderRadius: "1rem",
              overflow: "hidden",
            }}
          />
        </div>
      </>

      <Dialog
  open={openDialog}
  onClose={handleCloseDialog}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>
    Files Viewer
    <IconButton
      onClick={handleCloseDialog}
      sx={{ position: "absolute", right: 8, top: 8 }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent dividers>
    <Tabs
      value={tabIndex}
      onChange={(e, val) => setTabIndex(val)}
      centered
    >
      <Tab label="Images" />
      <Tab label="Videos" />
      
    </Tabs>

    {/* Images Panel - now index 0 */}
    <TabPanel value={tabIndex} index={0}>
      {Array.isArray(selectedRow?.uploadImage) &&
      selectedRow.uploadImage.length > 0 ? (
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
          }}
        >
          {selectedRow.uploadImage.map(
            (img, index) =>
              img?.trim() && (
                <img
                  key={index}
                  src={getFileUrl(img)}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                  }}
                />
              )
          )}
        </div>
      ) : (
        <p>No images uploaded.</p>
      )}
    </TabPanel>

    {/* Videos Panel - now index 1 */}
    <TabPanel value={tabIndex} index={1}>
      {Array.isArray(selectedRow?.uploadVideo) &&
      selectedRow.uploadVideo.length > 0 ? (
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
          }}
        >
          {selectedRow.uploadVideo.map(
            (vid, index) =>
              vid?.trim() && (
                <video
                  key={index}
                  src={getFileUrl(vid)}
                  controls
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                  }}
                />
              )
          )}
        </div>
      ) : (
        <p>No videos uploaded.</p>
      )}
    </TabPanel>
  </DialogContent>
</Dialog>


      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Email & Contact</DialogTitle>
        <DialogContent>
          <TextField
            label="Contact"
            fullWidth
            margin="dense"
            value={editRow?.teacherContact || ""}
            onChange={(e) =>
              setEditRow({ ...editRow, teacherContact: e.target.value })
            }
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={editRow?.email || ""}
            onChange={(e) => setEditRow({ ...editRow, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              console.log("EditRow data before update:", editRow); // Debug 1

              try {
                const response = await axios.put(
                  `${process.env.REACT_APP_API_BASE_URL}/api/register/updateemailandnumber/${editRow.id}`,
                  {
                    email: editRow.email,
                    teacherContact: editRow.teacherContact,
                  }
                );

                console.log("API Response:", response); // Debug 2

                if (response.status === 200) {
                  const updated = data.map((item) =>
                    item.id === editRow.id ? editRow : item
                  );
                  setData(updated);
                  setOpenEditDialog(false);
                  // alert("Update successful!");
                }
              } catch (err) {
                console.error("Update error details:", {
                  error: err,
                  response: err.response,
                }); // Debug 3
                alert(`Update failed: ${err.message}`);
              }
            }}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DistrictTable;
