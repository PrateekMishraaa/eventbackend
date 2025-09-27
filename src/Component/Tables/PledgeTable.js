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
import { Dialog, DialogTitle, DialogContent, Box, Tabs, Tab } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

// Utility to handle file URLs
const getFileUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${process.env.REACT_APP_API_BASE_URL}/${path.replace(/\\/g, "/")}`;
};

function TabPanel({ children, value, index }) {
  return <div hidden={value !== index}>{value === index && <Box sx={{ p: 2 }}>{children}</Box>}</div>;
}

const Eventlist = () => {
  const district = localStorage.getItem("district") || "";
  const state = localStorage.getItem("state") || "";
  const role = localStorage.getItem("role") || "";
  const [data, setData] = useState([]);
  const [status, setStatus] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [editRow, setEditRow] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const isMobile = useMediaQuery("(max-width:768px)");

  const handleOpenDialog = (rowData) => {
    if ((rowData.uploadImage?.length || 0) > 0 || (rowData.uploadVideo?.length || 0) > 0) {
      setSelectedRow(rowData);
      setOpenDialog(true);
      setTabIndex(0);
    } else {
      alert("No files available for this entry.");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRow(null);
  };

  // Fetch data
const fetchData = useCallback(async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/register/alldata");

    const temp = (res.data?.data || []).map((item) => ({
      id: item._id,
      schoolName: item.schoolName || "N/A",
      email: item.email || "N/A",
      teacherName: item.teacherName || "N/A",
      teacherContact: item.teacherContact || "N/A",
      isPledge: item.isProgram || item.isPledge || "N/A",
      uploadLetter: item.uploadLetter || null,
      uploadImage: item.uploadImage || [],
      uploadVideo: item.uploadVideo || [],
      submissionDate: item.createdAt || item.submissionDate || new Date().toISOString(),
    }));

    setData(temp.reverse());
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}, []);


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isAllFilesUploaded = (rowData) => rowData.uploadImage?.length > 0 && rowData.uploadVideo?.length > 0;

  const getMissingFilesMessage = (rowData) => {
    const missing = [];
    if (!rowData.uploadImage?.length) missing.push("Images");
    if (!rowData.uploadVideo?.length) missing.push("Videos");
    return missing.length ? `Missing: ${missing.join(", ")}` : "All files uploaded";
  };

  const handleStatusChange = (rowData, newStatus) => {
    if (newStatus === "accept") {
      if (!isAllFilesUploaded(rowData)) {
        alert(`❌ Cannot Accept: ${getMissingFilesMessage(rowData)}`);
        return;
      }
      alert(" All files verified! Process completed successfully.");
    } else {
      handleWhatsAppClick(rowData.teacherContact, rowData, true);
      alert(" Rejected: Please upload missing files and resubmit.");
    }
    setStatus((prev) => ({ ...prev, [rowData.id]: newStatus }));
  };

  const handleCallClick = (phoneNumber) => {
    if (!phoneNumber) {
      alert("Please provide a valid phone number");
      return;
    }
    let cleanedNumber = phoneNumber.replace(/[^\d+]/g, "");
    if (!cleanedNumber.startsWith("+") && cleanedNumber.length === 10) cleanedNumber = `+91${cleanedNumber}`;

    const isMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobileDevice) {
      window.location.href = `tel:${cleanedNumber}`;
    } else {
      navigator.clipboard
        .writeText(cleanedNumber)
        .then(() => alert(`Cannot make calls from desktop. Phone number copied: ${cleanedNumber}`))
        .catch(() => alert(`Phone number: ${cleanedNumber}`));
    }
  };

  const handleWhatsAppClick = (phoneNumber, rowData, isRejection = false) => {
    try {
      const missingFiles = [];
      if (!rowData.uploadImage?.length) missingFiles.push("Images");
      if (!rowData.uploadVideo?.length) missingFiles.push("Videos");

      let message = "Pledge Submission:\n\n";
      if (isRejection) {
        message += "❌ PLEDGE SUBMISSION REJECTED ❌\n\n";
        if (missingFiles.length) {
          message += "MISSING DOCUMENTS:\n";
          missingFiles.forEach((f) => {
            message += f === "Images" ? "• Pledge Images (min 3 photos)\n" : "• Pledge Videos (min 1 video)\n";
          });
        }
        message += "\nPlease upload missing documents and resubmit.";
      } else {
        message += missingFiles.length
          ? `⚠️ Pending: Missing ${missingFiles.join(", ")}\nPlease upload.`
          : "✅ All documents received! Thank you.";
      }

      const cleanedNumber = phoneNumber.replace(/[^\d+]/g, "");
      window.open(`https://wa.me/${cleanedNumber}?text=${encodeURIComponent(message)}`, "_blank");
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { title: "School Name", field: "schoolName", editable: "never" },
    { title: "Teacher Name", field: "teacherName", editable: "never" },
    { title: "Contact", field: "teacherContact", editable: "onUpdate" },
    { title: "Email", field: "email", editable: "onUpdate" },
    { title: "Events Status", field: "isPledge", editable: "never" },
    {
      title: "Files Status",
      render: (rowData) => (
        <span style={{ color: isAllFilesUploaded(rowData) ? "green" : "red" }}>
          {getMissingFilesMessage(rowData)}
        </span>
      ),
      editable: "never",
    },
    {
      title: "Submission Date",
      render: (rowData) => {
        const date = new Date(rowData.submissionDate);
        return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
      },
      editable: "never",
    },
    {
      title: "Status",
      render: (rowData) => (
        <div>
          <FormControlLabel
            control={
              <Radio checked={status[rowData.id] === "accept"} onChange={() => handleStatusChange(rowData, "accept")} />
            }
            label="Accept"
          />
          <FormControlLabel
            control={
              <Radio checked={status[rowData.id] === "reject"} onChange={() => handleStatusChange(rowData, "reject")} />
            }
            label="Reject"
          />
        </div>
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
            <IconButton onClick={() => handleWhatsAppClick(rowData.teacherContact, rowData)} style={{ color: "#25D366" }}>
              <WhatsAppIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Files">
            <IconButton onClick={() => handleOpenDialog(rowData)} color="primary">
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
      <div style={{ padding: "20px" }}>
        <MaterialTable title="" columns={columns} data={data} options={{ pageSize: 10, pageSizeOptions: [5, 10, 20] }} />
      </div>

      {/* Files Viewer Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Files Viewer
          <IconButton onClick={handleCloseDialog} sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} centered>
            <Tab label="Images" />
            <Tab label="Videos" />
          </Tabs>

          <TabPanel value={tabIndex} index={0}>
            {selectedRow?.uploadImage?.length ? (
              <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)" }}>
                {selectedRow.uploadImage.map((img, i) => (
                  <img key={i} src={getFileUrl(img)} style={{ width: "100%", borderRadius: "8px" }} alt="pledge" />
                ))}
              </div>
            ) : (
              <p>No images uploaded.</p>
            )}
          </TabPanel>

          <TabPanel value={tabIndex} index={1}>
            {selectedRow?.uploadVideo?.length ? (
              <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)" }}>
                {selectedRow.uploadVideo.map((vid, i) => (
                  <video key={i} src={getFileUrl(vid)} controls style={{ width: "100%", borderRadius: "8px" }} />
                ))}
              </div>
            ) : (
              <p>No videos uploaded.</p>
            )}
          </TabPanel>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Email & Contact</DialogTitle>
        <DialogContent>
          <TextField
            label="Contact"
            fullWidth
            margin="dense"
            value={editRow?.teacherContact || ""}
            onChange={(e) => setEditRow({ ...editRow, teacherContact: e.target.value })}
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
              try {
                await axios.put(`http://localhost:5000/api/pledge/updateemailandnumber/${editRow.id}`, {
                  email: editRow.email,
                  teacherContact: editRow.teacherContact,
                });
                const updated = data.map((item) => (item.id === editRow.id ? editRow : item));
                setData(updated);
                setOpenEditDialog(false);
              } catch (err) {
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

export default PledgeTable;
