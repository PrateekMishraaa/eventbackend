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
import { Dialog, DialogTitle, DialogContent, Box, Grid, Tabs, Tab, Typography, Table, TableBody, TableCell, TableRow } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SchoolRegistrationForm from "../Tables/ReportGenerator"; // Import your form component
import { REACT_API_BASE_URL } from "../../utlis/helper";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;


// Utility to handle file URLs
// const getFileUrl = (path) => {
//   if (!path) return "";
//   return path.startsWith("http") ? path : `${process.env.REACT_APP_API_BASE_URL}/${path.replace(/\\/g, "/")}`;
// };
// utils/fileHelper.js

export const getFileUrl = (path) => {
  if (!path) return "";

  // If already valid http but contains C:/Users, strip local path part
  if (path.startsWith("http") && path.includes("/uploads/")) {
    const relativePath = path.split("/uploads/")[1];
    return `${REACT_API_BASE_URL}/uploads/${relativePath}`;
  }

  return path.startsWith("http")
    ? path
    : `${REACT_API_BASE_URL}/${path.replace(/\\/g, "/").replace(/^\/+/, "")}`;
};



function TabPanel({ children, value, index }) {
  return <div hidden={value !== index}>{value === index && <Box sx={{ p: 2 }}>{children}</Box>}</div>;
}


const PledgeTable = () => {
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
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const isMobile = useMediaQuery("(max-width:768px)");



  const handleOpenDialog = (rowData) => {
    if (
      (rowData.uploadImage?.length || 0) > 0 ||
      (rowData.uploadVideo?.length || 0) > 0 ||
      rowData.uploadLetter ||
      true // Always allow dialog to open for new tabs
    ) {
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
  // const fetchData = useCallback(async () => {
  //   try {
  //     const res = await axios.get("http://localhost:5000/api/register/alldata");
  //     console.log("API Response:", res.data); // Debug the full response

  //     const temp = (res.data?.data || []).map((item) => ({
  //       id: item._id,
  //       schoolName: item.schoolName || "N/A",
  //       email: item.email || "N/A",
  //       teacherName: item.teacherName || "N/A",
  //       teacherContact: item.teacherContact || "N/A",
  //       isPledge: item.isProgram || item.isPledge || "N/A",
  //       uploadLetter: item.uploadLetter || null,
  //       uploadImage: Array.isArray(item.uploadImage) ? item.uploadImage : [],
  //       uploadVideo: Array.isArray(item.uploadVideo) ? item.uploadVideo : [],
  //       submissionDate: item.createdAt || item.submissionDate || new Date().toISOString(),
  //       // School registration data
  //       udseCode: item.udseCode || "",
  //       address: item.address || "",
  //       schoolType: item.schoolType || "",
  //       state: item.state || "",
  //       district: item.district || "",
  //       // Student information
  //       totalStudents: item.totalStudents || "",
  //       maleStudents: item.maleStudents || "",
  //       femaleStudents: item.femaleStudents || "",
  //       totalTrainedStudents: item.totalTrainedStudents || "",
  //       maleTrainedStudents: item.maleTrainedStudents || "",
  //       femaleTrainedStudents: item.femaleTrainedStudents || "",
  //       totalDisabledStudents: item.totalDisabledStudents || "",
  //       maleDisabledStudents: item.maleDisabledStudents || "",
  //       femaleDisabledStudents: item.femaleDisabledStudents || "",
  //       // Teacher information
  //       totalTeachers: item.totalTeachers || "",
  //       maleTeachers: item.maleTeachers || "",
  //       femaleTeachers: item.femaleTeachers || "",
  //       totalTrainedTeachers: item.totalTrainedTeachers || "",
  //       maleTrainedTeachers: item.maleTrainedTeachers || "",
  //       femaleTrainedTeachers: item.femaleTrainedTeachers || "",
  //       programLike: item.programLike || "",
  //       // Disaster management
  //       rapidVisualSurvey: item.rapidVisualSurvey || "",
  //       drillsLastSixMonths: item.drillsLastSixMonths || "",
  //       disasterCommittee: item.disasterCommittee || "",
  //       resourceInventory: item.resourceInventory || "",
  //       evacuationPlan: item.evacuationPlan || "",
  //       disasterPlan: item.disasterPlan || "",
  //     }));

  //     // Sort by submissionDate in descending order (latest first)
  //     temp.sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));
  //     setData(temp);
  //   } catch (err) {
  //     console.error("Error fetching data:", err);
  //   }
  // }, []);

const fetchData = useCallback(async () => {
  try {
    let apiUrl = "";


if (role === "admin") {
  apiUrl = `${BASE_URL}/register/alldata`;
  // apiUrl = "http://localhost:5000/api/register/alldata";
} else if (role === "subadmin") {
  const district = "delhi"; // Replace with actual district dynamically
  apiUrl = `${BASE_URL}/subadmindata?district=${encodeURIComponent(district)}`;
      // apiUrl = `http://localhost:5000/api/subadmindata?district=${district}`;
} else {
  console.error("Unknown role:", role);
  return;
}


    const res = await axios.get(apiUrl);
    console.log("API Response:", res.data);

    // Handle different response structures
    let rawData = [];
    if (Array.isArray(res.data)) {
      rawData = res.data;
    } else if (res.data?.data && Array.isArray(res.data.data)) {
      rawData = res.data.data;
    } else if (res.data?.results && Array.isArray(res.data.results)) {
      rawData = res.data.results;
    } else {
      console.error("Unexpected API response structure:", res.data);
      setData([]);
      return;
    }

    console.log("Raw data array:", rawData);
    console.log("Number of items:", rawData.length);

    const temp = rawData.map((item) => {
      return {
        id: item._id,
        schoolName: item.schoolName || "N/A",
        email: item.email || "N/A",
        teacherName: item.teacherName || "N/A",
        teacherContact: item.teacherContact || "N/A",
        isPledge: item.isProgram || item.isPledge || "N/A",
        uploadLetter: item.uploadLetter || null,
        uploadImage: Array.isArray(item.uploadImage) ? item.uploadImage : [],
        uploadVideo: Array.isArray(item.uploadVideo) ? item.uploadVideo : [],
        submissionDate: item.createdAt || item.submissionDate || new Date().toISOString(),

        udiseCode: item.udiseCode || "",
        address: item.address || "",
        schoolType: item.schoolType || "",
        state: item.state || "",
        district: item.district || "",
        block: item.block || "",

        totalStudents: String((item.totalStudentsMale || 0) + (item.totalStudentsFemale || 0)),
        maleStudents: String(item.totalStudentsMale || 0),
        femaleStudents: String(item.totalStudentsFemale || 0),
        totalTrainedStudents: String((item.trainedStudentsMale || 0) + (item.trainedStudentsFemale || 0)),
        maleTrainedStudents: String(item.trainedStudentsMale || 0),
        femaleTrainedStudents: String(item.trainedStudentsFemale || 0),
        totalDisabledStudents: String((item.trainedDisabledStudentsMale || 0) + (item.trainedDisabledStudentsFemale || 0)),
        maleDisabledStudents: String(item.trainedDisabledStudentsMale || 0),
        femaleDisabledStudents: String(item.trainedDisabledStudentsFemale || 0),

        totalTeachers: String((item.totalTeachersMale || 0) + (item.totalTeachersFemale || 0)),
        maleTeachers: String(item.totalTeachersMale || 0),
        femaleTeachers: String(item.totalTeachersFemale || 0),
        totalTrainedTeachers: String((item.trainedTeachersMale || 0) + (item.trainedTeachersFemale || 0)),
        maleTrainedTeachers: String(item.trainedTeachersMale || 0),
        femaleTrainedTeachers: String(item.trainedTeachersFemale || 0),

        rapidVisualSurvey: item.rapidSurvay || "N/A",
        disasterPlan: item.hasDMPlan || "N/A",

        fireDrillConducted: item.fireDrillConducted || "N/A",
        earthquakeDrillConducted: item.earthquakeDrillConducted || "N/A",
        heatwaveDrillConducted: item.heatwaveDrillConducted || "N/A",
        regionaldisasterDrillConducted: item.regionaldisasterDrillConducted || "N/A",
        urbanfloodDrillConducted: item.urbanfloodDrillConducted || "N/A",
        otherDrillConducted: item.otherDrillConducted || "N/A",

        gpsLatitude: item.gps?.latitude || "",
        gpsLongitude: item.gps?.longitude || "",
      };
    });

    temp.sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));
    setData(temp);
    console.log("Final data set to state:", temp.length, "items");
  } catch (err) {
    console.error("Error fetching data:", err);
    console.error("Error response:", err.response?.data);
  }
}, [role]); 



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
        alert(` Cannot Accept: ${getMissingFilesMessage(rowData)}`);
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


  // Fixed WhatsApp handler - Always sends message regardless of file status
  const handleWhatsAppClick = (phoneNumber, rowData) => {
    try {
      const missingFiles = [];
      if (!rowData.uploadImage?.length) missingFiles.push("Images");
      if (!rowData.uploadVideo?.length) missingFiles.push("Videos");
      if (!rowData.uploadLetter) missingFiles.push("Confirmation Letter");

      let message;

      // Create different messages based on file status
      if (missingFiles.length === 0) {
        // All files uploaded - send confirmation message
        message = `REGISTRATION COMPLETE\n\nDear ${rowData.teacherName || 'Teacher'},\n\nYour school registration has been completed successfully!\n\nAll required documents have been uploaded:\n• Images ✅\n• Videos ✅\n• Confirmation Letter ✅\n\nThank you for your participation.\n\nSchool: ${rowData.schoolName}`;
      } else {
        // Missing files - send urgent message
        message = ` URGENT: Upload missing documents: ${missingFiles.join(", ")}\n\nDear ${rowData.teacherName || 'Teacher'},\n\nYour registration is incomplete. Please upload:\n`;

        missingFiles.forEach((file) => {
          if (file === "Images") message += "• School Images (Required)\n";
          if (file === "Videos") message += "• School Videos (Required)\n";
          if (file === "Confirmation Letter") message += "• Signed Letter (Required)\n";
        });

        message += `\nComplete your submission immediately.\n\nSchool: ${rowData.schoolName}`;
      }

      // Clean and format phone number
      let cleanNumber = phoneNumber.replace(/[^\d]/g, "");
      if (cleanNumber.length === 10) cleanNumber = '91' + cleanNumber;

      console.log("Sending WhatsApp message to:", cleanNumber);
      console.log("Message:", message);

      // Always open WhatsApp - no conditions
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      // Log the action
      console.log(`WhatsApp opened for ${cleanNumber} - Files status: ${missingFiles.length === 0 ? 'Complete' : 'Missing: ' + missingFiles.join(", ")}`);

    } catch (error) {
      console.error("WhatsApp Error:", error);
      alert("Failed to open WhatsApp. Please try again.");
    }
  };


  // const generatePDFReport = (rowData) => {
  //   // Create a printable version of the report
  //   const printWindow = window.open('', '_blank');
  //   printWindow.document.write(`
  //     <html>
  //       <head>
  //         <title>School Registration Report - ${rowData.schoolName}</title>
  //         <style>
  //           body { font-family: Arial, sans-serif; margin: 20px; }
  //           h1 { color: #1976d2; }
  //           h2 { color: #2e7d32; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
  //           table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  //           th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
  //           th { background-color: #f2f2f2; }
  //           .section { margin-bottom: 30px; }
  //         </style>
  //       </head>
  //       <body>
  //         <h1>School Registration Report</h1>
  //         <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>

  //         <div class="section">
  //           <h2>School Information</h2>
  //           <table>
  //             <tr><th>School Name</th><td>${rowData.schoolName || 'N/A'}</td></tr>
  //             <tr><th>UDSE Code</th><td>${rowData.udseCode || 'N/A'}</td></tr>
  //             <tr><th>Address</th><td>${rowData.address || 'N/A'}</td></tr>
  //             <tr><th>Teacher's Name</th><td>${rowData.teacherName || 'N/A'}</td></tr>
  //             <tr><th>Teacher's Contact</th><td>${rowData.teacherContact || 'N/A'}</td></tr>
  //             <tr><th>Email</th><td>${rowData.email || 'N/A'}</td></tr>
  //             <tr><th>School Type</th><td>${rowData.schoolType || 'N/A'}</td></tr>
  //             <tr><th>State</th><td>${rowData.state || 'N/A'}</td></tr>
  //             <tr><th>District</th><td>${rowData.district || 'N/A'}</td></tr>
  //           </table>
  //         </div>

  //         <div class="section">
  //           <h2>Student Information</h2>
  //           <table>
  //             <tr><th>Total Students</th><td>${rowData.totalStudents || 'N/A'}</td></tr>
  //             <tr><th>Male Students</th><td>${rowData.maleStudents || 'N/A'}</td></tr>
  //             <tr><th>Female Students</th><td>${rowData.femaleStudents || 'N/A'}</td></tr>
  //             <tr><th>Total Trained Students</th><td>${rowData.totalTrainedStudents || 'N/A'}</td></tr>
  //             <tr><th>Male Trained Students</th><td>${rowData.maleTrainedStudents || 'N/A'}</td></tr>
  //             <tr><th>Female Trained Students</th><td>${rowData.femaleTrainedStudents || 'N/A'}</td></tr>
  //             <tr><th>Total Disabled Students</th><td>${rowData.totalDisabledStudents || 'N/A'}</td></tr>
  //             <tr><th>Male Disabled Students</th><td>${rowData.maleDisabledStudents || 'N/A'}</td></tr>
  //             <tr><th>Female Disabled Students</th><td>${rowData.femaleDisabledStudents || 'N/A'}</td></tr>
  //           </table>
  //         </div>

  //         <div class="section">
  //           <h2>Teacher Information</h2>
  //           <table>
  //             <tr><th>Total Teachers</th><td>${rowData.totalTeachers || 'N/A'}</td></tr>
  //             <tr><th>Male Teachers</th><td>${rowData.maleTeachers || 'N/A'}</td></tr>
  //             <tr><th>Female Teachers</th><td>${rowData.femaleTeachers || 'N/A'}</td></tr>
  //             <tr><th>Total Trained Teachers</th><td>${rowData.totalTrainedTeachers || 'N/A'}</td></tr>
  //             <tr><th>Male Trained Teachers</th><td>${rowData.maleTrainedTeachers || 'N/A'}</td></tr>
  //             <tr><th>Female Trained Teachers</th><td>${rowData.femaleTrainedTeachers || 'N/A'}</td></tr>
  //             <tr><th>Program Like</th><td>${rowData.programLike || 'N/A'}</td></tr>
  //           </table>
  //         </div>

  //         <div class="section">
  //           <h2>Disaster Management</h2>
  //           <table>
  //             <tr><th>Rapid Visual Survey Done?</th><td>${rowData.rapidVisualSurvey || 'N/A'}</td></tr>
  //             <tr><th>Conducted any drills in last 6 months?</th><td>${rowData.drillsLastSixMonths || 'N/A'}</td></tr>
  //             <tr><th>School Disaster Management Committee formed?</th><td>${rowData.disasterCommittee || 'N/A'}</td></tr>
  //             <tr><th>Resource Inventory Maintained?</th><td>${rowData.resourceInventory || 'N/A'}</td></tr>
  //             <tr><th>Evacuation plan with exit map</th><td>${rowData.evacuationPlan || 'N/A'}</td></tr>
  //             <tr><th>School Disaster Management Plan created?</th><td>${rowData.disasterPlan || 'N/A'}</td></tr>
  //           </table>
  //         </div>

  //         <div class="section">
  //           <h2>Submission Details</h2>
  //           <table>
  //             <tr><th>Submission Date</th><td>${new Date(rowData.submissionDate).toLocaleDateString() || 'N/A'}</td></tr>
  //             <tr><th>Files Status</th><td>${getMissingFilesMessage(rowData)}</td></tr>
  //           </table>
  //         </div>
  //       </body>
  //     </html>
  //   `);

  //   printWindow.document.close();
  //   setTimeout(() => {
  //     printWindow.print();
  //   }, 250);
  // };

  const generatePDFReport = async (rowData) => {
    const fetchImageAsDataURL = async (url) => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Network error");
        const blob = await res.blob();
        return await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.warn("Falling back to raw URL:", url);
        return url;
      }
    };

    // Always create 4 image slots - repeat images if necessary
    const createFourImages = () => {
      if (!Array.isArray(rowData.uploadImage) || rowData.uploadImage.length === 0) {
        return []; // No images available
      }

      const fourImages = [];
      for (let i = 0; i < 4; i++) {
        // Use modulo to repeat images if we have fewer than 4
        const imageIndex = i % rowData.uploadImage.length;
        fourImages.push(rowData.uploadImage[imageIndex]);
      }
      return fourImages;
    };

    const imagesToShow = createFourImages();
    const resolvedImageUrls = imagesToShow.length > 0
      ? await Promise.all(imagesToShow.map((img) => fetchImageAsDataURL(getFileUrl(img))))
      : [];

    const html = `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>School Registration Report</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px; 
          line-height: 1.4;
        }
        h1 { 
          color: #1976d2; 
          margin-bottom: 10px; 
          text-align: center;
          border-bottom: 2px solid #1976d2;
          padding-bottom: 10px;
        }
        h2 { 
          color: #2e7d32; 
          border-bottom: 1px solid #ccc; 
          padding-bottom: 3px; 
          margin-top: 20px; 
          margin-bottom: 10px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-bottom: 15px; 
          font-size: 12px; 
        }
        th, td { 
          border: 1px solid #ddd; 
          padding: 8px; 
          text-align: left; 
        }
        th { 
          background: #f5f5f5; 
          font-weight: bold;
          width: 40%;
        }
        .container { 
          display: flex; 
          gap: 20px; 
          margin-top: 20px;
        }
        .left { 
          flex: 2; 
        }
        .right { 
          flex: 1; 
          min-width: 300px;
        }
        .images-container {
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 10px; 
          align-content: start;
        }
        .image-slot {
          border: 2px solid #ddd;
          border-radius: 8px;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background-color: #f9f9f9;
        }
        .image-slot img { 
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
          border-radius: 6px;
        }
        .no-image {
          color: #999;
          font-size: 11px;
          text-align: center;
        }
        .images-title {
          color: #2e7d32; 
          border-bottom: 1px solid #ccc; 
          padding-bottom: 3px; 
          margin-bottom: 15px;
          font-size: 16px;
          font-weight: bold;
        }
        @media print {
          body { margin: 10px; }
          .container { display: flex; }
          .images-container { grid-template-columns: 1fr 1fr; }
          h1 { font-size: 18px; }
          h2 { font-size: 14px; }
        }
      </style>
    </head>
    <body>
      <h1>School Registration Report</h1>
      <p style="text-align: center; color: #666; margin-bottom: 10px;">
        <strong>UDISE Code:</strong> ${rowData.udseCode || "N/A"} | 
        <strong>Generated on:</strong> ${new Date().toLocaleDateString()}
      </p>
      
      <div class="container">
        <div class="left">
          <h2>School Information</h2>
          <table>
            <tr><th>School Name</th><td>${rowData.schoolName || "N/A"}</td></tr>
            <tr><th>Address</th><td>${rowData.address || "N/A"}</td></tr>
            <tr><th>Teacher's Name</th><td>${rowData.teacherName || "N/A"}</td></tr>
            <tr><th>Teacher's Contact</th><td>${rowData.teacherContact || "N/A"}</td></tr>
            <tr><th>Email</th><td>${rowData.email || "N/A"}</td></tr>
            <tr><th>School Type</th><td>${rowData.schoolType || "N/A"}</td></tr>
            <tr><th>State</th><td>${rowData.state || "N/A"}</td></tr>
            <tr><th>District</th><td>${rowData.district || "N/A"}</td></tr>
          </table>

          <h2>Student Information</h2>
          <table>
            <tr><th>Total Students</th><td>${rowData.totalStudents || "N/A"}</td></tr>
            <tr><th>Male Students</th><td>${rowData.maleStudents || "N/A"}</td></tr>
            <tr><th>Female Students</th><td>${rowData.femaleStudents || "N/A"}</td></tr>
          </table>

          <h2>Teacher Information</h2>
          <table>
            <tr><th>Total Teachers</th><td>${rowData.totalTeachers || "N/A"}</td></tr>
            <tr><th>Male Teachers</th><td>${rowData.maleTeachers || "N/A"}</td></tr>
            <tr><th>Female Teachers</th><td>${rowData.femaleTeachers || "N/A"}</td></tr>
            <tr><th>Program Like</th><td>${rowData.programLike || "N/A"}</td></tr>
          </table>

          <h2>Disaster Management</h2>
          <table>
            <tr><th>Rapid Visual Survey Done?</th><td>${rowData.rapidVisualSurvey || "N/A"}</td></tr>
            <tr><th>Conducted Drills (Last 6 Months)?</th><td>${rowData.drillsLastSixMonths || "N/A"}</td></tr>
            <tr><th>Disaster Committee Formed?</th><td>${rowData.disasterCommittee || "N/A"}</td></tr>
            <tr><th>Resource Inventory Maintained?</th><td>${rowData.resourceInventory || "N/A"}</td></tr>
            <tr><th>Evacuation Plan with Exit Map</th><td>${rowData.evacuationPlan || "N/A"}</td></tr>
            <tr><th>Disaster Management Plan Created?</th><td>${rowData.disasterPlan || "N/A"}</td></tr>
          </table>
        </div>

        <div class="right">
          <div class="images-title">School Images</div>
          <div class="images-container">
            ${Array.from({ length: 4 }, (_, index) => {
      const imageUrl = resolvedImageUrls[index];
      return `
                <div class="image-slot">
                  ${imageUrl
          ? `<img src="${imageUrl}" alt="School Image ${index + 1}" />`
          : `<div class="no-image">No Image ${index + 1}</div>`
        }
                </div>
              `;
    }).join('')}
          </div>
          
          ${resolvedImageUrls.length > 0
        ? `<p style="text-align: center; margin-top: 10px; font-size: 10px; color: #666;">
                 ${resolvedImageUrls.length === 1 ? 'Same image repeated 4 times' : `${Math.min(rowData.uploadImage?.length || 0, 4)} images shown`}
               </p>`
        : ''
      }
        </div>
      </div>
    </body>
  </html>
`;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for images to load before printing
    setTimeout(() => {
      printWindow.print();
    }, 1000); // Increased timeout for better image loading
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

  // console.log("selectedRow?.uploadVideo", selectedRow?.uploadVideo);
  // console.log("selectedRow?.uploadVideo", selectedRow?.uploadImage);

  return (
    <>
      {showRegistrationForm ? (
        <SchoolRegistrationForm onBack={() => setShowRegistrationForm(false)} />
      ) : (
        <>

          <div style={{ padding: "20px" }}>

            <MaterialTable title="" columns={columns} data={data} options={{ pageSize: 10, pageSizeOptions: [5, 10, 20] }} />
          </div>

          {/* Files Viewer Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle>
              Files Viewer - {selectedRow?.schoolName || "School"}
              <IconButton onClick={handleCloseDialog} sx={{ position: "absolute", right: 8, top: 8 }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} centered>
                <Tab label="Images" />
                <Tab label="Videos" />
                <Tab label="Confirmation Letter" />
                <Tab label="Report" />
              </Tabs>

              <TabPanel value={tabIndex} index={0}>
                {selectedRow?.uploadImage?.length ? (
                  <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)" }}>
                    {selectedRow.uploadImage.map((img, i) => {
                      const url = getFileUrl(img);
                      console.log("Image URL:", url); // <-- This will print the actual URL
                      return (
                        <img
                          key={i}
                          src={url}
                          style={{ width: "100%", borderRadius: "8px" }}
                          alt="pledge"
                        />
                      );
                    })}
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

              <TabPanel value={tabIndex} index={2}>
                {selectedRow?.uploadLetter ? (
                  <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: isMobile ? "1fr" : "repeat(1, 1fr)" }}>
                    <iframe
                      src={getFileUrl(selectedRow.uploadLetter)}
                      style={{ width: "100%", height: "500px", borderRadius: "8px" }}
                      title="Confirmation Letter"
                    />
                  </div>
                ) : (
                  <p>No confirmation letter uploaded.</p>
                )}
              </TabPanel>

              <TabPanel value={tabIndex} index={3}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    School Registration Report - {selectedRow?.schoolName || "School"}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<PictureAsPdfIcon />}
                    onClick={() => generatePDFReport(selectedRow)}
                    style={{ marginBottom: "20px" }}
                  >
                    Download PDF Report
                  </Button>

                  <Typography variant="body1" paragraph>
                    <strong>Generated on:</strong> {new Date().toLocaleDateString()}
                  </Typography>

                  {/* <Typography variant="h6" gutterBottom>School Information</Typography>
                  <Typography variant="body2" paragraph>
                    <strong>School Name:</strong> {selectedRow?.schoolName || "N/A"}<br />
                    <strong>UDSE Code:</strong> {selectedRow?.udseCode || "N/A"}<br />
                    <strong>Address:</strong> {selectedRow?.address || "N/A"}<br />
                    <strong>Teacher's Name:</strong> {selectedRow?.teacherName || "N/A"}<br />
                    <strong>Teacher's Contact:</strong> {selectedRow?.teacherContact || "N/A"}<br />
                    <strong>Email:</strong> {selectedRow?.email || "N/A"}<br />
                    <strong>School Type:</strong> {selectedRow?.schoolType || "N/A"}<br />
                    <strong>State:</strong> {selectedRow?.state || "N/A"}<br />
                    <strong>District:</strong> {selectedRow?.district || "N/A"}
                  </Typography>

                  <Typography variant="h6" gutterBottom>Student Information</Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Total Students:</strong> {selectedRow?.totalStudents || "N/A"}<br />
                    <strong>Male Students:</strong> {selectedRow?.maleStudents || "N/A"}<br />
                    <strong>Female Students:</strong> {selectedRow?.femaleStudents || "N/A"}<br />
                    <strong>Total Trained Students:</strong> {selectedRow?.totalTrainedStudents || "N/A"}<br />
                    <strong>Male Trained Students:</strong> {selectedRow?.maleTrainedStudents || "N/A"}<br />
                    <strong>Female Trained Students:</strong> {selectedRow?.femaleTrainedStudents || "N/A"}<br />
                    <strong>Total Disabled Students:</strong> {selectedRow?.totalDisabledStudents || "N/A"}<br />
                    <strong>Male Disabled Students:</strong> {selectedRow?.maleDisabledStudents || "N/A"}<br />
                    <strong>Female Disabled Students:</strong> {selectedRow?.femaleDisabledStudents || "N/A"}
                  </Typography>

                  <Typography variant="h6" gutterBottom>Teacher Information</Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Total Teachers:</strong> {selectedRow?.totalTeachers || "N/A"}<br />
                    <strong>Male Teachers:</strong> {selectedRow?.maleTeachers || "N/A"}<br />
                    <strong>Female Teachers:</strong> {selectedRow?.femaleTeachers || "N/A"}<br />
                    <strong>Total Trained Teachers:</strong> {selectedRow?.totalTrainedTeachers || "N/A"}<br />
                    <strong>Male Trained Teachers:</strong> {selectedRow?.maleTrainedTeachers || "N/A"}<br />
                    <strong>Female Trained Teachers:</strong> {selectedRow?.femaleTrainedTeachers || "N/A"}<br />
                    <strong>Program Like:</strong> {selectedRow?.programLike || "N/A"}
                  </Typography>

                  <Typography variant="h6" gutterBottom>Disaster Management</Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Rapid Visual Survey Done?:</strong> {selectedRow?.rapidVisualSurvey || "N/A"}<br />
                    <strong>Conducted any drills in last 6 months?:</strong> {selectedRow?.drillsLastSixMonths || "N/A"}<br />
                    <strong>School Disaster Management Committee formed?:</strong> {selectedRow?.disasterCommittee || "N/A"}<br />
                    <strong>Resource Inventory Maintained?:</strong> {selectedRow?.resourceInventory || "N/A"}<br />
                    <strong>Evacuation plan with exit map:</strong> {selectedRow?.evacuationPlan || "N/A"}<br />
                    <strong>School Disaster Management Plan created?:</strong> {selectedRow?.disasterPlan || "N/A"}
                  </Typography>

                  <Typography variant="h6" gutterBottom>Submission Details</Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Submission Date:</strong> {new Date(selectedRow?.submissionDate).toLocaleDateString() || "N/A"}<br />
                    <strong>Files Status:</strong> {selectedRow ? getMissingFilesMessage(selectedRow) : "N/A"}
                  </Typography>
                  
                  <Typography variant="h6" gutterBottom>Uploaded Images</Typography>
                  {selectedRow?.uploadImage?.length ? (
                    <Box
                      sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                      }}
                    >
                      {selectedRow.uploadImage.map((img, i) => (
                        <img
                          key={i}
                          src={getFileUrl(img)}
                          alt={`uploaded-${i}`}
                          style={{ width: "100%", borderRadius: "8px" }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2">No images uploaded.</Typography>
                  )} */}
                  <Box
                    sx={{
                      border: "2px solid #2196f3",
                      borderRadius: "8px",
                      p: 2,
                      backgroundColor: "#fff",
                      maxWidth: "900px",
                      margin: "auto",
                      fontFamily: "Arial",
                    }}
                  >
                    {/* Header */}
                    <Typography
                      variant="h5"
                      sx={{ color: "#1976d2", fontWeight: "bold", mb: 2 }}
                    >
                      SCHOOL REGISTRATION FORM
                    </Typography>

                    {/* UDISE Code */}
                    <Typography sx={{ mb: 2 }}>
                      <strong>UDISE Code:</strong> {selectedRow?.udiseCode || "N/A"}
                    </Typography>

                    {/* Main Content Grid */}
                    <Grid container spacing={3}>
                      {/* Left Side - Data */}
                      <Grid item xs={12} md={8}>
                        {/* School Information */}
                        <Typography
                          variant="h6"
                          sx={{ color: "#1976d2", fontWeight: "bold", mb: 2 }}
                        >
                          School Information
                        </Typography>
                        <Table size="small" sx={{ mb: 3 }}>
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>School Name</TableCell>
                              <TableCell>{selectedRow?.schoolName || "N/A"}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                              <TableCell>{selectedRow?.address || "N/A"}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>Teacher's Name</TableCell>
                              <TableCell>{selectedRow?.teacherName || "N/A"}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>Teacher's Contact</TableCell>
                              <TableCell>{selectedRow?.teacherContact || "N/A"}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                              <TableCell>{selectedRow?.email || "N/A"}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>School Type</TableCell>
                              <TableCell>{selectedRow?.schoolType || "N/A"}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>State</TableCell>
                              <TableCell>{selectedRow?.state || "N/A"}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>District</TableCell>
                              <TableCell>{selectedRow?.district || "N/A"}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>

                        {/* Student Information */}
                        <Typography
                          variant="h6"
                          sx={{ color: "#1976d2", fontWeight: "bold", mb: 2 }}
                        >
                          Student Information
                        </Typography>
                        <Table size="small" sx={{ mb: 3 }}>
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>Total Students</TableCell>
                              <TableCell>{selectedRow?.totalStudents || "N/A"}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>Male Students</TableCell>
                              <TableCell>{selectedRow?.totalTeachersMale || "N/A"}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>Female Students</TableCell>
                              <TableCell>{selectedRow?.totalStudentsFemale || "N/A"}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>

                        {/* Teacher Information */}
                        <Typography
                          variant="h6"
                          sx={{ color: "#1976d2", fontWeight: "bold", mb: 2 }}
                        >
                          Teacher Information
                        </Typography>
                        <Table size="small" sx={{ mb: 3 }}>
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>Total Teachers</TableCell>
                              <TableCell>{selectedRow?.totalTeachers || "N/A"}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>Male Teachers</TableCell>
                              <TableCell>{selectedRow?.totalTeachersMale || "N/A"}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>Female Teachers</TableCell>
                              <TableCell>{selectedRow?.totalTeachersFemale || "N/A"}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>Program Like</TableCell>
                              <TableCell>{selectedRow?.programLike || "N/A"}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>

                        {/* Disaster Management */}
                        <Typography
                          variant="h6"
                          sx={{ color: "#1976d2", fontWeight: "bold", mb: 2 }}
                        >
                          Disaster Management
                        </Typography>
                        <Table size="small">
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>Rapid Visual Survey Done?</TableCell>
                              <TableCell>{selectedRow?.rapidSurvay || "N/A"}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>Drills in Last 6 Months?</TableCell>
                              <TableCell>{selectedRow?.drillsLastSixMonths || "N/A"}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>Disaster Committee Formed?</TableCell>
                              <TableCell>{selectedRow?.disasterCommittee || "N/A"}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>Resource Inventory Maintained?</TableCell>
                              <TableCell>{selectedRow?.resourceInventory || "N/A"}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>Evacuation Plan with Exit Map</TableCell>
                              <TableCell>{selectedRow?.evacuationPlan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>Disaster Management Plan Created?</TableCell>
                              <TableCell>{selectedRow?.disasterPlan || "N/A"}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Grid>

                      {/* Right Side - Images */}
                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="h6"
                          sx={{ color: "#1976d2", fontWeight: "bold", mb: 2 }}
                        >
                          School Images
                        </Typography>

                        {/* Images Grid - Always show 4 images */}
                        <Grid container spacing={2}>
                          {Array.from({ length: 4 }, (_, index) => {
                            // Get the image - if there are multiple images, use them; otherwise repeat the first one
                            const imageToShow = selectedRow?.uploadImage?.length
                              ? selectedRow.uploadImage[index % selectedRow.uploadImage.length]
                              : null;

                            return (
                              <Grid item xs={6} key={index}>
                                <Box
                                  sx={{
                                    border: imageToShow ? "1px solid #ddd" : "2px dashed #ddd",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                    height: "120px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: imageToShow ? "transparent" : "#f9f9f9",
                                  }}
                                >
                                  {imageToShow ? (
                                    <img
                                      src={getFileUrl(imageToShow)}
                                      alt={`School Image ${index + 1}`}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                    />
                                  ) : (
                                    <Typography variant="caption" color="textSecondary">
                                      No Image {index + 1}
                                    </Typography>
                                  )}
                                </Box>
                              </Grid>
                            );
                          })}
                        </Grid>

                        {/* Additional images indicator */}
                        {selectedRow?.uploadImage?.length > 4 && (
                          <Typography
                            variant="caption"
                            sx={{ mt: 1, display: "block", textAlign: "center", color: "#666" }}
                          >
                            +{selectedRow.uploadImage.length - 4} more images
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
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
                    await axios.put(`http://localhost:5000/api/updateEmailAndNumberById/${editRow.id}`, {
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
      )}
    </>
  );
};

export default PledgeTable;
