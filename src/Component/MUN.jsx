import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Paper,
  FormControlLabel,
  Checkbox,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import Yuva from "./Asset/yuva_logo.png";
import caqm from "./Asset/caqm.png";
import bharat from "./Asset/satyamev.png";
import axios from "axios";
import LoaderSplash from "../layouts/LoaderSplash";
import { Popup } from "../layouts/Popup";
import { Analytics } from "@vercel/analytics/react";
import CameraCapture from "./CameraCapture";
import CameraVideoCapture from "./VideoCapture";
import VideoPreview from "./preview/videoPreview";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AttachFileIcon from "@mui/icons-material/AttachFile";


import image1 from "./Asset/dummyImages/mun_image1.jpeg";
import image2 from "./Asset/dummyImages/mun_image2.jpeg";
import image3 from "./Asset/dummyImages/mun_image3.jpeg";
import image4 from "./Asset/dummyImages/mun_image4.jpeg";

import video1 from "./Asset/dummyVideos/mun_video1.mp4";
import video2 from "./Asset/dummyVideos/mun_video2.mp4";

const dummyImages = [
  { url: image1, alt: "Image1", type: "image/jpeg" },
  { url: image2, alt: "Image2", type: "image/jpeg" },
  { url: image3, alt: "Image3", type: "image/jpeg" },
  { url: image4, alt: "Image4", type: "image/jpeg" },
];

const dummyVideos = [
  { url: video1, type: "video" },
  { url: video2, type: "video" },
];

const MUN = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { schoolmail } = useParams();
  const [isLoading, setLoading] = useState(false);
  const [expandedStep, setExpandedStep] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [uploadedReport, setUploadedReport] = useState([]);

  const validationSchema = Yup.object({
    schoolName: Yup.string().required("School name is required"),
    teacherName: Yup.string().required("Teacher's name is required"),
    email: Yup.string().required("email Id is required"),
    teacherContact: Yup.string()
      .matches(/^\d{10}$/, "Enter a valid 10-digit number")
      .required("Teacher's contact number is required"),
    schoolType: Yup.string().required("School type is required"),
    state: Yup.string().required("State is required"),
    district: Yup.string().required("district is required"),
    address: Yup.string().required("Address is required"),
    pincode: Yup.string().required("Pincode is required"),
    designation: Yup.string().required("Designation is required"),
    malestudentCount: Yup.number()
      .typeError("Male student count must be a number")
      .min(0, "Value cannot be negative"),
      // .required("Male student count is required"),
    femalestudentCount: Yup.number()
      .typeError("Female student count must be a number")
      .min(0, "Value cannot be negative"),
      // .required("Female student count is required"),
    malestaffCount: Yup.number()
      .typeError("Male staff count must be a number")
      .min(0, "Value cannot be negative"),
      // .required("Male staff count is required"),
    femalestaffCount: Yup.number()
      .typeError("Female staff count must be a number")
      .min(0, "Value cannot be negative"),
      // .required("Female staff count is required"),
    agree: Yup.bool()
      .oneOf([true], "You must accept the pledge.")
      .required("You must accept the pledge."),
  });

  const formik = useFormik({
    initialValues: {
      schoolName: "",
      teacherName: "",
      teacherContact: "",
      email: "",
      schoolType: "",
      state: "",
      district: "",
      address: "",
      pincode: "",
      designation: "",
      malestudentCount: "",
      femalestudentCount: "",
      malestaffCount: "",
      femalestaffCount: "",
      schoolMail: schoolmail,
      agree: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        if (uploadedImages.length === 0 || uploadedVideos.length === 0 | uploadedReport===0) {
          Popup(
            "error",
            "Missing Videos or Images",
            "Please upload both images and videos before submitting.",
            4000
          );
          setLoading(false);
          return;
        }

        const gps = await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) =>
              resolve({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              }),
            () => resolve(null),
            { enableHighAccuracy: true }
          );
        });

        const formData = new FormData();
        formData.append("schoolName", values.schoolName);
        formData.append("teacherName", values.teacherName);
        formData.append("teacherContact", values.teacherContact);
        formData.append("email", values.email);
        formData.append("schoolType", values.schoolType);
        formData.append("state", values.state);
        formData.append("district", values.district);
        formData.append("address", values.address);
        formData.append("pincode", values.pincode);
        formData.append("designation", values.designation);
        formData.append("malestudentCount", values.malestudentCount);
        formData.append("femalestudentCount", values.femalestudentCount);
        formData.append("malestaffCount", values.malestaffCount);
        formData.append("femalestaffCount", values.femalestaffCount);
        formData.append("gps", JSON.stringify(gps));

        uploadedImages.forEach((file) => formData.append("uploadImage", file));
        uploadedVideos.forEach((file) => formData.append("uploadVideo", file));
        formData.append("uploadedReport", uploadedReport[0] )
        // console.log('formData', formData)

        // ✅ Submit
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/register/mun/email/update-form`,
          formData,
          // { headers: { "Content-Type": "application/json" } }
        );

        setLoading(false);
        Popup(
          "success",
          "Success",
          "Participant registered successfully!",
          4000
        );

        if (response.status === 200) {
          resetForm();
          if (imageInputRef.current) imageInputRef.current.value = "";
          if (videoInputRef.current) videoInputRef.current.value = "";
          setUploadedImages([]);
          setUploadedVideos([]);
          setUploadedReport([])
        }
      } catch (error) {
        setLoading(false);
        console.log(error)
        Popup(
          "error",
          "Error",
          "Something went wrong. Please try again.",
          4000
        );
      }
    },
    onReset: () => {},
  });

    const fetchExistingData = async () => {
      // if (!schoolmail) return;
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/register/mun/email/${formik.values.email}`
        );
        console.log(response)

        if (response.data.success) {
          console.log(response.data)
          const data = response.data.data;
          formik.setValues({
            ...formik.values,
            schoolName: data.schoolName || "",
            teacherName: data.teacherName || "",
            teacherContact: data.teacherContact || "",
            email: data.email || "",
            schoolType: data.schoolType || "",
            state: data.state || "",
            district: data.district || "",
            address: data.address || "",
            pincode: data.pincode || "",
            designation: data.designation || "",
            malestudentCount: data.malestudentCount || "",
            femalestudentCount: data.femalestudentCount || "",
            malestaffCount: data.malestaffCount || "",
            femalestaffCount: data.femalestaffCount || "",
          });
        }
      } catch (err) {
        console.log("No data found or error:", err.message);
      }
    };

    console.log(formik.values.email)

  useEffect(() => {
  const timeout = setTimeout(() => {
    if (formik.values.email) {
      fetchExistingData();
    }
  }, 1000); 

  return () => clearTimeout(timeout);
}, [formik.values.email]);


  useEffect(() => {
    const fetchExistingData = async () => {
      if (!schoolmail) return; // no email in route

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/register/mun/${schoolmail}`
        );

        if (response.data.success) {
          const data = response.data.data;

          // Prefill form with fetched values
          formik.setValues({
            schoolName: data.schoolName || "",
            teacherName: data.teacherName || "",
            teacherContact: data.teacherContact || "",
            email: data.email || "",
            schoolType: data.schoolType || "",
            state: data.state || "",
            district: data.district || "",
            address: data.address || "",
            pincode: data.pincode || "",
            designation: data.designation || "",
            malestudentCount: data.malestudentCount || "",
            femalestudentCount: data.femalestudentCount || "",
            malestaffCount: data.malestaffCount || "",
            femalestaffCount: data.femalestaffCount || "",
            gps: data.gps || null, // optional if you're using gps
          });
        }
      } catch (err) {
        console.log("No data found for this email or error:", err.message);
      }
    };

    fetchExistingData();
  }, [schoolmail]); // dependency is the email from route

  console.log('uploadedReport', uploadedReport)

  const handleFileUpload = async (e, gps = null) => {
    const files = e.target.files;
    if (!files.length) return;
    const formData = new FormData();
    const fieldName = e.target.name;

    switch (fieldName) {
      case "uploadImage":
        setUploadedImages((prev) => [...prev, ...files]);
        break;
      case "uploadVideo":
        setUploadedVideos((prev) => [...prev, ...files]);
        break;
      // case "uploadLetter":
      //   setUploadedLetter(files[0]);
      //   break;
      default:
        console.warn("Unknown upload field:", fieldName);
    }

    for (let file of files) {
      formData.append(fieldName, file);
    }

    if (gps) {
      formData.append("gps", JSON.stringify(gps));
    }
    console.log("email",formik.values.email)
    if (!formik.values.email) {
      console.warn("Skipping upload: no email provided");
      return;
    }
    // try {
    //   const response = await axios.post(
    //     `${process.env.REACT_APP_API_BASE_URL}/api/register/mun/email/upload-files/${formik.values.email}`,
    //     formData // Must be constructed with formData.append()
    //   );

    //   if (response.status === 201) {
    //     //     alert("Files uploaded successfully");
    //   } else {
    //     //     alert(`Upload failed: ${response.data.message || "Unknown error"}`);
    //   }
    // } catch (error) {
    //   // alert("Upload error: " + (error.response?.data?.message || error.message));
    // }
  };

  const renderLabel = (label, isRequired = true) => (
    <>
      {label} {isRequired && <span style={{ color: "red" }}>*</span>}
    </>
  );

  const handleOpen = (item) => {
    const url = item.url || URL.createObjectURL(item.item);
    const type = item.type || item.item.type || "";
    const name = item.name || item.item || "";
    setSelectedMedia({ url, type, name });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMedia(null);
  };

  const handleRemoveVideo = (index) => {
    const newFiles = [...uploadedVideos];
    newFiles.splice(index, 1);
    setUploadedVideos(newFiles);
  };

  const steps = [
    {
      label: "Details about Program",
      description: `This is a sample description about the air quality awareness program conducted at your school. Please include information such as date, number of participants, type of activities carried out, and any guest speakers or experts`,
    },
    {
    label: 'Upload Report',
    description: (
      <>
      <Box
      sx={{
        border: '1px solid rgba(0, 0, 0, 0.23)',
        borderRadius: '8px',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '&:hover': { borderColor: 'grey' },
        '&:focus-within': {
          borderColor: 'grey',
          boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Typography
                        component={"input"}
                        sx={{
                          display: "none",
                        }}
                        type="file"
                        name="uploadLetter"
                        id="fileElem-letter"
                        accept=".pdf,.doc,.docx, image/*"
                        onChange={(event) => {
                      const file = event.currentTarget.files;
                      if(file){
                       setUploadedReport(file)
                      }
                    }}
                        
                style={{ width: '100%' }}

                      />
                      {/* Label for the Image Input */}
                      <Typography
                        component={"label"}
                        sx={{
                          padding: "10px",
                          cursor: "pointer",
                          borderRadius: "6px",
                          minWidth: "100%",
                          maxWidth: "100%",
                          boxSizing: "border-box",
                          border: "2px dashed black",
                          height: "150px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#f6f6f6",
                          ":hover": {
                            backgroundColor: "#e9e9e9",
                          },
                          ":active": {
                            backgroundColor: "#f6f6f6",
                          },
                        }}
                        htmlFor="fileElem-letter"
                      >
                        <Typography
                          component={"div"}
                          sx={{
                            color: "#666",
                            userSelect: "none",
                            textAlign: "center",
                          }}
                        >
                          Drag File here or click to upload
                        </Typography>
                      </Typography>

    </Box> 

    <Box sx={{ my: 2 }}>
  <label htmlFor="fileElem-letter" style={{ cursor: 'pointer' }}>
    <IconButton color="action" component="span">
      <AttachFileIcon />
    </IconButton>
  </label>
</Box>



    {uploadedReport.length !==0 && (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mt: 2,
          gap: 1,
          border: '1px solid #ddd',
          borderRadius: 1,
          padding: '6px 12px',
          position: 'relative',
        }}
      >
        <Typography variant="body2">{uploadedReport[0]?.name}</Typography>

        

        
      <Box
          onClick={() => {
            setUploadedReport([]);
          }}
          sx={{
            position: 'absolute',
            top: 2,
            right: 2,
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: '50%',
            width: 20,
            height: 20,
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: '20px',
            cursor: 'pointer',
          }}
        >
          &times;
        </Box>
        
      </Box>

      
    )}
    
      </>
    ),
  },
    {
      label: "Upload Image",
      description: (
        <>
          <Box
            sx={{
              border: "1px solid rgba(0, 0, 0, 0.23)",
              borderRadius: "8px",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              "&:hover": { borderColor: "grey" },
              "&:focus-within": {
                borderColor: "grey",
                boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <input
              style={{ display: "none" }}
              name="uploadImage"
              type="file"
              ref={imageInputRef}
              id="fileElem-image"
              accept="image/*"
              onChange={(event) => {
                const inputFiles = event.currentTarget.files;
                if (!inputFiles || inputFiles.length === 0) return;
                const files = Array.from(inputFiles);
                const images = files.filter(file => file.type.startsWith("image/"));
                setUploadedImages((prev) => [...prev, ...images]);
              }}
            />
            <label
              htmlFor="fileElem-image"
              style={{
                padding: "10px",
                cursor: "pointer",
                borderRadius: "6px",
                minWidth: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
                border: "2px dashed black",
                height: "150px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f6f6f6",
                ":hover": { backgroundColor: "#e9e9e9" },
                ":active": { backgroundColor: "#f6f6f6" },
              }}
            >
              <div style={{ color: "#666", userSelect: "none", textAlign: "center" }}>
                Drag Image here or click to upload
              </div>
            </label>
          </Box>

          <CameraCapture 
            handleFileUpload={(file) => {
              if (file.type.startsWith("image/")) {
                setUploadedImages((prev) => [...prev, file]);
              }
            }} 
          />

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
            {uploadedImages?.map((item, index) => {
              const url = URL.createObjectURL(item);
              return (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid #ddd",
                  }}
                >
                  <img
                    onClick={() => handleOpen({ item })}
                    src={url}
                    alt={item.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <Box
                    onClick={() => {
                      const newFiles = [...uploadedImages];
                      newFiles.splice(index, 1);
                      setUploadedImages(newFiles);
                    }}
                    sx={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      backgroundColor: "rgba(0,0,0,0.6)",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                      lineHeight: "20px",
                      cursor: "pointer",
                    }}
                  >
                    &times;
                  </Box>
                </Box>
              );
            })}
          </Box>

          <p>Dummy Images: </p>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
            {dummyImages?.map((item, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  width: 80,
                  height: 80,
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid #ddd",
                }}
              >
                <img
                  onClick={() => handleOpen(item)}
                  src={item.url}
                  alt={item.alt}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            ))}
          </Box>
        </>
      ),
    },
    {
      label: "Upload Video",
      description: (
        <>
          <Box
            sx={{
              border: "1px solid rgba(0, 0, 0, 0.23)",
              borderRadius: "8px",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              "&:hover": { borderColor: "grey" },
              "&:focus-within": {
                borderColor: "grey",
                boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <input
              style={{ display: "none" }}
              type="file"
              ref={videoInputRef}
              name="uploadVideo"
              id="fileElem-video"
              accept="video/*"
              multiple
              onChange={(event) => {
                const inputFiles = event.currentTarget.files;
                if (!inputFiles || inputFiles.length === 0) return;
                const files = Array.from(inputFiles);
                const videos = files.filter(file => file.type.startsWith("video/"));
                setUploadedVideos((prev) => [...prev, ...videos]);
              }}
            />
            <label
              htmlFor="fileElem-video"
              style={{
                padding: "10px",
                cursor: "pointer",
                borderRadius: "6px",
                minWidth: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
                border: "2px dashed black",
                height: "150px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f6f6f6",
                ":hover": { backgroundColor: "#e9e9e9" },
                ":active": { backgroundColor: "#f6f6f6" },
              }}
            >
              <div style={{ color: "#666", userSelect: "none", textAlign: "center" }}>
                Drag Video here or click to upload
              </div>
            </label>
          </Box>
          <CameraVideoCapture 
            handleFileUpload={(file) => {
              if (file.type.startsWith("video/")) {
                setUploadedVideos((prev) => [...prev, file]);
              }
            }} 
          />

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
            <VideoPreview
              videos={uploadedVideos}
              onRemove={handleRemoveVideo}
              handleOpen={handleOpen}
            />
          </Box>

          <p>Dummy Videos: </p>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
            {dummyVideos?.map((item, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  width: 80,
                  height: 80,
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid #ddd",
                }}
              >
                <video
                  onClick={() => handleOpen(item)}
                  src={item.url}
                  muted
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            ))}
          </Box>
        </>
      ),
    },
  ];

  const [activeStep, setActiveStep] = React.useState(0);
  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
    setExpandedStep((prev) => prev + 1);
  };
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setExpandedStep((prev) => prev - 1);
  };
  const handleReset = () => setActiveStep(0);
  const handleAccordionChange = (index) => {
    setExpandedStep(index === expandedStep ? -1 : index);
  };

  // const renderLabel = (label, isRequired = true) => (
  //   <>
  //     {label} {isRequired && <span style={{ color: "red" }}>*</span>}
  //   </>
  // );

  return (
    <>
      <Analytics />
      {isLoading && <LoaderSplash show={isLoading} />}
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          padding: "25px 0px",
          backgroundColor: "rgb(226, 238, 224)",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              backgroundColor: "rgb(251, 247, 247)",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              {[caqm, bharat, Yuva].map((logo, i) => (
                <Box
                  key={i}
                  sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "end",
                    padding: "0 13px",
                  }}
                >
                  <img
                    src={logo}
                    alt={`logo-${i}`}
                    style={{ width: "50%", height: i===1 ? "80%" : "auto", mixBlendMode: "multiply" }}
                  />
                </Box>
              ))}
            </Box>
            <Typography variant="h5" gutterBottom textAlign="center">
              CAQM FORM
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" paragraph>
                Dear Principal,
              </Typography>
              <Typography variant="body2" paragraph>
                The Commission for Air Quality Management (CAQM) is a statutory
                body established by the Government of India to address and
                monitor air quality issues, particularly in the National Capital
                Region (NCR) and adjoining areas. It is responsible for
                formulating policies, regulations, and guidelines to control air
                pollution and ensure cleaner air for all. The CAQM aims to build
                a sustainable and pollution-free environment by coordinating
                with stakeholders, enforcing compliance, and promoting awareness
                through programs and initiatives at the institutional and
                community level.
              </Typography>

              <Box>
                <Stepper activeStep={activeStep} orientation="vertical">
                  {steps.map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel
                        sx={{
                          "& .MuiStepIcon-root.Mui-active": { color: "#2e7d32" },
                          "& .MuiStepIcon-root.Mui-completed": { color: "#2e7d32" },
                        }}
                      >
                        <Accordion
                          expanded={expandedStep === index}
                          onChange={() => handleAccordionChange(index)}
                        >
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            {step.label}
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>{step.description}</Typography>
                            <Box
                              sx={{
                                mb: 2,
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleNext}
                                sx={{ mt: 1, mr: 1, borderRadius: "10px" }}
                              >
                                Continue
                              </Button>
                              <Button
                                variant="contained"
                                color="inherit"
                                disabled={index === 0}
                                onClick={handleBack}
                                sx={{ mt: 1, mr: 1 }}
                              >
                                Back
                              </Button>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
                {activeStep === steps.length && (
                  <Paper square elevation={0} sx={{ p: 3 }}>
                    <Typography>
                      All steps completed - you&apos;re finished
                    </Typography>
                    <Button
                      onClick={handleReset}
                      sx={{ mt: 1, mr: 1, textTransform: "none" }}
                      color="grey"
                    >
                      Reset
                    </Button>
                  </Paper>
                )}
              </Box>

              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-media-title"
                aria-describedby="modal-media-description"
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    height: 400,
                    border: "2px solid #000",
                    borderRadius: "20px",
                    bgcolor: "background.paper",
                    p: 2,
                  }}
                >
                  {selectedMedia?.type?.startsWith("image") && (
                    <img
                      src={selectedMedia.url}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: "12px",
                      }}
                      onLoad={() => {
                        if (selectedMedia.url?.startsWith("blob:")) {
                          URL.revokeObjectURL(selectedMedia.url);
                        }
                      }}
                    />
                  )}

                  {selectedMedia?.type?.startsWith("video") && (
                    <video
                      src={selectedMedia.url}
                      controls
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: "12px",
                      }}
                    />
                  )}

                  {selectedMedia &&
                    !selectedMedia.type?.startsWith("image") &&
                    !selectedMedia.type?.startsWith("video") && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          textAlign: "center",
                          p: 2,
                        }}
                      >
                        <p>No preview available for this file type.</p>
                        <a
                          href={selectedMedia.url}
                          download={selectedMedia.name}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            marginTop: "10px",
                            textDecoration: "underline",
                            color: "#1976d2",
                            fontWeight: "bold",
                          }}
                        >
                          Download {selectedMedia.name}
                        </a>
                      </Box>
                    )}
                </Box>
              </Modal>
            </Box>

            <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="schoolName"
                    name="schoolName"
                    label={renderLabel("School's Name")}
                    value={formik.values.schoolName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.schoolName &&
                      Boolean(formik.errors.schoolName)
                    }
                    helperText={
                      formik.touched.schoolName && formik.errors.schoolName
                    }
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderRadius: "8px" },
                        "&:hover fieldset": { borderColor: "grey !important" },
                        "&.Mui-focused fieldset": {
                          borderColor: "grey !important",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="teacherName"
                    name="teacherName"
                    label={renderLabel("Teacher's Name")}
                    value={formik.values.teacherName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.teacherName &&
                      Boolean(formik.errors.teacherName)
                    }
                    helperText={
                      formik.touched.teacherName && formik.errors.teacherName
                    }
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderRadius: "8px" },
                        "&:hover fieldset": { borderColor: "grey !important" },
                        "&.Mui-focused fieldset": {
                          borderColor: "grey !important",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="teacherContact"
                    name="teacherContact"
                    label={renderLabel("Teacher's Contact no.")}
                    value={formik.values.teacherContact}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.teacherContact &&
                      Boolean(formik.errors.teacherContact)
                    }
                    helperText={
                      formik.touched.teacherContact &&
                      formik.errors.teacherContact
                    }
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderRadius: "8px" },
                        "&:hover fieldset": { borderColor: "grey !important" },
                        "&.Mui-focused fieldset": {
                          borderColor: "grey !important",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label={renderLabel("Email Id")}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderRadius: "8px" },
                        "&:hover fieldset": { borderColor: "grey !important" },
                        "&.Mui-focused fieldset": {
                          borderColor: "grey !important",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="schoolType"
                    name="schoolType"
                    label={renderLabel("School Type")}
                    value={formik.values.schoolType}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.schoolType &&
                      Boolean(formik.errors.schoolType)
                    }
                    helperText={
                      formik.touched.schoolType && formik.errors.schoolType
                    }
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderRadius: "8px" },
                        "&:hover fieldset": { borderColor: "grey !important" },
                        "&.Mui-focused fieldset": {
                          borderColor: "grey !important",
                        },
                      },
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="malestudentCount"
                    name="malestudentCount"
                    label={"Number of Male Students"}
                    type="number"
                    value={formik.values.malestudentCount}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.malestudentCount &&
                      Boolean(formik.errors.malestudentCount)
                    }
                    helperText={
                      formik.touched.malestudentCount &&
                      formik.errors.malestudentCount
                    }
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderRadius: "8px" },
                        "&:hover fieldset": { borderColor: "grey !important" },
                        "&.Mui-focused fieldset": {
                          borderColor: "grey !important",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="femalestudentCount"
                    name="femalestudentCount"
                    label={"Number of Female Students"}
                    type="number"
                    value={formik.values.femalestudentCount}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.femalestudentCount &&
                      Boolean(formik.errors.femalestudentCount)
                    }
                    helperText={
                      formik.touched.femalestudentCount &&
                      formik.errors.femalestudentCount
                    }
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderRadius: "8px" },
                        "&:hover fieldset": { borderColor: "grey !important" },
                        "&.Mui-focused fieldset": {
                          borderColor: "grey !important",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="malestaffCount"
                    name="malestaffCount"
                    label={"Number of Male Staff"}
                    type="number"
                    value={formik.values.malestaffCount}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.malestaffCount &&
                      Boolean(formik.errors.malestaffCount)
                    }
                    helperText={
                      formik.touched.malestaffCount &&
                      formik.errors.malestaffCount
                    }
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderRadius: "8px" },
                        "&:hover fieldset": { borderColor: "grey !important" },
                        "&.Mui-focused fieldset": {
                          borderColor: "grey !important",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="femalestaffCount"
                    name="femalestaffCount"
                    label={"Number of Female Staff"}
                    type="number"
                    value={formik.values.femalestaffCount}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.femalestaffCount &&
                      Boolean(formik.errors.femalestaffCount)
                    }
                    helperText={
                      formik.touched.femalestaffCount &&
                      formik.errors.femalestaffCount
                    }
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderRadius: "8px" },
                        "&:hover fieldset": { borderColor: "grey !important" },
                        "&.Mui-focused fieldset": {
                          borderColor: "grey !important",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="state"
                    name="state"
                    label={renderLabel("State")}
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    helperText={formik.touched.state && formik.errors.state}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderRadius: "8px" },
                        "&:hover fieldset": { borderColor: "grey !important" },
                        "&.Mui-focused fieldset": {
                          borderColor: "grey !important",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="district"
                    name="district"
                    label={renderLabel("District")}
                    value={formik.values.district}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.district && Boolean(formik.errors.district)
                    }
                    helperText={
                      formik.touched.district && formik.errors.district
                    }
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderRadius: "8px" },
                        "&:hover fieldset": { borderColor: "grey !important" },
                        "&.Mui-focused fieldset": {
                          borderColor: "grey !important",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="address"
                    name="address"
                    label={renderLabel("Address")}
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.address && Boolean(formik.errors.address)
                    }
                    helperText={formik.touched.address && formik.errors.address}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderRadius: "8px" },
                        "&:hover fieldset": { borderColor: "grey !important" },
                        "&.Mui-focused fieldset": {
                          borderColor: "grey !important",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="pincode"
                    name="pincode"
                    label={renderLabel("Pin Code")}
                    value={formik.values.pincode}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.pincode && Boolean(formik.errors.pincode)
                    }
                    helperText={formik.touched.pincode && formik.errors.pincode}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderRadius: "8px" },
                        "&:hover fieldset": { borderColor: "grey !important" },
                        "&.Mui-focused fieldset": {
                          borderColor: "grey !important",
                        },
                      },
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="designation"
                    name="designation"
                    label={renderLabel("Designation")}
                    value={formik.values.designation}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.designation &&
                      Boolean(formik.errors.designation)
                    }
                    helperText={
                      formik.touched.designation && formik.errors.designation
                    }
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderRadius: "8px" },
                        "&:hover fieldset": { borderColor: "grey !important" },
                        "&.Mui-focused fieldset": {
                          borderColor: "grey !important",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.agree || false}
                        onChange={(event) => {
                          formik.setFieldValue("agree", event.target.checked);
                          formik.setTouched(
                            { ...formik.touched, agree: true },
                            true
                          );
                        }}
                        name="agree"
                        color="primary"
                      />
                    }
                    label=" I hereby agree and confirm that I voluntarily take this e-pledge and commit to uphold its values with sincerity and responsibility."
                  />
                  {formik.errors.agree && formik.touched.agree && (
                    <Typography color="error" variant="caption">
                      {formik.errors.agree}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sx={{ marginTop: "2%" }}>
                  <Grid container spacing={2} justifyContent="space-between">
                    <Grid item xs={4}>
                      <Button
                        color="secondary"
                        variant="contained"
                        fullWidth
                        type="reset"
                        sx={{ textTransform: "none", borderRadius: "8px" }}
                      >
                        Reset
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        color="primary"
                        variant="contained"
                        fullWidth
                        type="submit"
                        sx={{ textTransform: "none", borderRadius: "8px" }}
                      >
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </div>
    </>
  );
};

export default MUN;