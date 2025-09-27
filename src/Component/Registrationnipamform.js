
// import React, { useEffect, useState, useCallback } from "react";
// import { useFormik } from "formik";
// import { useRef } from "react";

// import * as Yup from "yup";
// import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
// import { useParams } from "react-router-dom";
// import {
//   Container,
//   TextField,
//   Button,
//   Typography,
//  Grid,
//   Box,
//   Paper,
//   FormControlLabel,
//   Checkbox,
//   IconButton,
//   Stepper,
//   Step,
//   StepLabel,
//   // StepContent,
//   AccordionDetails,
//   Accordion,
//   AccordionSummary,
//   Modal,
// } from "@mui/material";
// import Yuva from "./Asset/yuva_logo.png";
// import Ndma from "./Asset/National_Disaster_Management_Authority_Logo.png";
// import bharat from "./Asset/satyamev.jpeg";
// import axios from 'axios';
// import LoaderSplash from "../layouts/LoaderSplash";
// import { Popup } from "../layouts/Popup";
// import { Analytics } from "@vercel/analytics/react"
// import CameraCapture from "./CameraCapture";
// import CameraVideoCapture from "./VideoCapture";
// import VideoPreview from "./preview/videoPreview";
// import AttachFileIcon from "@mui/icons-material/AttachFile";
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// import { PDFDownloadLink } from '@react-pdf/renderer';
// import ConfirmationFormPDF from './ConfirmationFormPDF'; 
//     // import piexif from 'piexifjs';

// // import ConfirmationFormPDF from './ConfirmationFormPDF';



// import PDF2 from './Asset/pdf2.pdf';
// import PDF1 from './Asset/pdf1.pdf';

// import image1 from './Asset/dummyImages/image1.jpg';
// import image2 from './Asset/dummyImages/image2.jpg';
// import image3 from './Asset/dummyImages/image3.jpg';
// import image4 from './Asset/dummyImages/image4.jpg';
// import image5 from './Asset/dummyImages/image5.jpg';


// import video1 from './Asset/dummyVideos/nipam_video1.mp4'
// import video2 from './Asset/dummyVideos/nipam_video2.mp4'
// //import dummyLetter from './Asset/dummyImages/WhatsApp Image 2025-06-07 at 14.53.41_97400d36.jpg'

// const dummyImages = [
//   { url: image1, alt: "Image1", type: "image/jpeg" },
//   { url: image2, alt: "Image2", type: "image/jpeg" },
//   { url: image3, alt: "Image3", type: "image/jpeg" },
//   { url: image4, alt: "Image4", type: "image/jpeg" },
//   { url: image5, alt: "Image5", type: "image/jpeg" },
// ];

// const dummyVideos = [
//   { url: video1, type: "video" },
//   { url: video2, type: "video" },
// ]


// const Registrationnipamform = () => {
//  //const navigate = useNavigate();

//   const { schoolmail } = useParams();
//   const [isLoading, setLoading] = useState(false);
//   const [expandedStep, setExpandedStep] = useState(0);
//   const [selectedMedia, setSelectedMedia] = useState(null);
  
// const imageInputRef = useRef();
// const videoInputRef = useRef();
// const letterInputRef = useRef();

//   const [uploadedImages, setUploadedImages] = useState([]);
//   const [uploadedVideos, setUploadedVideos] = useState([]);
//   const [uploadedLetter, setUploadedLetter] = useState(null);
//   const [open, setOpen] = useState(false);
//   const handleOpen = (item) => {
//     const url = item.url || URL.createObjectURL(item.item);
//     const type = item.type || item.item.type || '';
//     const name = item.name || item.item || '';

//     setSelectedMedia({ url, type, name });
//     setOpen(true);
//   };
//   const handleClose = () => {
//     setOpen(false);
//     setSelectedMedia(null);
//   }


  

  


//  const handleFileUpload = async (e, gps = null) => {
//   const files = e.target.files;
//   if (!files.length) return;

//   const formData = new FormData();
//   const fieldName = e.target.name;

//   switch (fieldName) {
//     case "uploadImage":
//       setUploadedImages(prev => [...prev, ...files]);
//       break;
//     case "uploadVideo":
//       setUploadedVideos(prev => [...prev, ...files]);
//       break;
//     case "uploadLetter":
//       setUploadedLetter(files[0]);
//       break;
//     default:
//       console.warn("Unknown upload field:", fieldName);
//   }

//   for (let file of files) {
//     formData.append(fieldName, file);
//   }

//   if (gps) {
//     formData.append("gps", JSON.stringify(gps));
//   }

//   try {
//     const response = await axios.post(
//       `${process.env.REACT_APP_API_BASE_URL}/api/upload`,
//       formData,
//       {
//         headers: { "Content-Type": "multipart/form-data" },
//       }
//     );

//     if ( response.status === 201) {
//     //  alert("✅ Files uploaded successfully");
//     } else {
//     //  alert(`❌ Upload failed: ${response.data.message || "Unknown error"}`);
//     }
//   } catch (error) {
//     alert("❌ Upload error: " + (error.response?.data?.message || error.message));
//   }
// };




//   const renderLabel = (label, isRequired = true) => (
//     <>
//       {label} {isRequired && <span style={{ color: "red" }}>*</span>}
//     </>
//   );


// const handleSubmit = (e) => {
//   e.preventDefault(); // prevent page reload

//   // ✅ Clear file input state
//   setUploadedImages([]);
//   setUploadedVideos([]);
//   setUploadedLetter(null);

//   // ✅ Optionally reset file input elements
//   if (imageInputRef.current) imageInputRef.current.value = "";
//   if (videoInputRef.current) videoInputRef.current.value = "";
//   if (letterInputRef.current) letterInputRef.current.value = "";

//   // ✅ Show success message
//   Popup("success", "Success", "Participant registered successfully!", 4000);
// };

 


//  const handleRemoveVideo = (index) => {
//   const updated = [...uploadedVideos];
//   updated.splice(index, 1);
//   setUploadedVideos(updated);
// };


//   const steps = [
// {
//   label: 'Details about Program',
//   description: (
//     <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//       <Typography>
//         This is a dummy description about the disaster awareness program conducted at your school. Include information such as date, number of participants, type of activities, and any guest speakers involved.
//       </Typography>

//       {/* PDF 1 */}
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           gap: 2,
//           padding: 1,
//           border: "1px solid #ccc",
//           borderRadius: 2,
//           backgroundColor: "#f9f9f9",
//           "&:hover": { backgroundColor: "#f1f1f1" },
//           cursor: "pointer",
//         }}
//         onClick={() => window.open(PDF1, "_blank")}
//       >
//         <PictureAsPdfIcon sx={{ color: "#2356fe" }} />
//         <Typography sx={{ color: "#2356fe", fontWeight: 500 }}>
//           Pledge 1
//         </Typography>
//       </Box>

//       {/* PDF 2 */}
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           gap: 2,
//           padding: 1,
//           border: "1px solid #ccc",
//           borderRadius: 2,
//           backgroundColor: "#f9f9f9",
//           "&:hover": { backgroundColor: "#f1f1f1" },
//           cursor: "pointer",
//         }}
//         onClick={() => window.open(PDF2, "_blank")}
//       >
//         <PictureAsPdfIcon sx={{ color: "#2356fe" }} />
//         <Typography sx={{ color: "#2356fe", fontWeight: 500 }}>
//           Pledge 2
//         </Typography>
//       </Box>
//     </Box>
//   )
// }

// ,


 






//     {
//       label: 'Upload Image',
//       description: (
//         <>

//           <Box
//             sx={{
//               border: '1px solid rgba(0, 0, 0, 0.23)',
//               borderRadius: '8px',
//               padding: '10px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               '&:hover': { borderColor: 'grey' },
//               '&:focus-within': {
//                 borderColor: 'grey',
//                 boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.1)',
//               },
//             }}
//           >

//             {/* Input Section */}
//             <Typography
//               component={"input"}
//               sx={{
//                 display: "none",
//               }}
//               name="uploadImage"
//               type="file"
//               id="fileElem-image"
//               accept="image/*"
//               onChange={async (event) => {
//                 const inputFiles = event.currentTarget.files;
//                 if (!inputFiles || inputFiles.length === 0) return;

//                 const files = Array.from(inputFiles);
//                 console.log(files)
//                 // Get GPS coordinates
//                 const gps = await new Promise((resolve) => {
//                   navigator.geolocation.getCurrentPosition(
//                     (pos) => resolve({
//                       latitude: pos.coords.latitude,
//                       longitude: pos.coords.longitude
//                     }),
//                     () => resolve(null),
//                     { enableHighAccuracy: true }
//                   );
//                 });

//                 // Call your existing upload function with files and GPS data
//                 handleFileUpload(event, gps);

//               }}

//               style={{ width: '100%' }}

//             />

//             {/* Label for the Image Input */}
//             <Typography
//               component={"label"}
//               sx={{
//                 padding: "10px",
//                 cursor: "pointer",
//                 borderRadius: "6px",
//                 minWidth: "100%",
//                 maxWidth: "100%",
//                 boxSizing: "border-box",
//                 border: "2px dashed black",
//                 height: "150px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 backgroundColor: "#f6f6f6",
//                 ":hover": {
//                   backgroundColor: "#e9e9e9",
//                 },
//                 ":active": {
//                   backgroundColor: "#f6f6f6",
//                 },
//               }}
//               htmlFor="fileElem-image"
//             >
//               <Typography
//                 component={"div"}
//                 sx={{
//                   color: "#666",
//                   userSelect: "none",
//                   textAlign: "center",
//                 }}
//               >
//                 Drag Image here or click to upload
//               </Typography>
//             </Typography>

//           </Box>


//           <CameraCapture handleFileUpload={handleFileUpload} />


//           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
//             {uploadedImages?.map((item, index) => {
//               const url = URL.createObjectURL(item);
//               return (
//                 <Box
//                   key={index}
//                   sx={{
//                     position: 'relative',
//                     width: 80,
//                     height: 80,
//                     borderRadius: 2,
//                     overflow: 'hidden',
//                     border: '1px solid #ddd',
//                   }}
//                 >
//                   <img
//                     onClick={() => handleOpen({ item })}
//                     src={url}
//                     alt={item.name}
//                     style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                   />
//                   <Box
//                     onClick={() => {
//                       const newFiles = [...uploadedImages];
//                       newFiles.splice(index, 1);
//                       setUploadedImages(newFiles);
//                     }}
//                     sx={{
//                       position: 'absolute',
//                       top: 2,
//                       right: 2,
//                       backgroundColor: 'rgba(0,0,0,0.6)',
//                       borderRadius: '50%',
//                       width: 20,
//                       height: 20,
//                       color: 'white',
//                       fontWeight: 'bold',
//                       textAlign: 'center',
//                       lineHeight: '20px',
//                       cursor: 'pointer',
//                     }}
//                   >
//                     &times;
//                   </Box>
//                 </Box>

//               );
//             })}
//           </Box>


//           <p>Dummy Images: </p>
//           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
//             {dummyImages?.map((item, index) => {
//               return (
//                 <>
//                   <Box
//                     key={index}
//                     sx={{
//                       position: "relative",
//                       width: 80,
//                       height: 80,
//                       borderRadius: 2,
//                       overflow: "hidden",
//                       border: "1px solid #ddd"
//                     }}
//                   >

//                     <img
//                       onClick={() => handleOpen(item)}
//                       src={item.url}
//                       alt={item.alt}
//                       style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                     />
//                   </Box>
//                 </>
//               )
//             })}
//           </Box>


//         </>
//       ),
//     },
//     {
//       label: 'Upload Video',
//       description: (
//         <>
//           <Box
//             sx={{
//               border: '1px solid rgba(0, 0, 0, 0.23)',
//               borderRadius: '8px',
//               padding: '10px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               '&:hover': { borderColor: 'grey' },
//               '&:focus-within': {
//                 borderColor: 'grey',
//                 boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.1)',
//               },
//             }}
//           >
//             <Typography
//               component={"input"}
//               sx={{
//                 display: "none",
//               }}
//               type="file"
//               name="uploadVideo"
//               id="fileElem-video"
//               accept="video/*"
//               multiple
//               //                 onChange={(event) => {
//               //   const files = Array.from(event.currentTarget.files);
//               //   formik.setFieldValue('uploadVideo', [...formik.values.uploadVideo, ...files]);
//               // }}
//               onChange={handleFileUpload}
//               style={{ width: '100%' }}
//             />
//             {/* Label for the Image Input */}
//             <Typography
//               component={"label"}
//               sx={{
//                 padding: "10px",
//                 cursor: "pointer",
//                 borderRadius: "6px",
//                 minWidth: "100%",
//                 maxWidth: "100%",
//                 boxSizing: "border-box",
//                 border: "2px dashed black",
//                 height: "150px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 backgroundColor: "#f6f6f6",
//                 ":hover": {
//                   backgroundColor: "#e9e9e9",
//                 },
//                 ":active": {
//                   backgroundColor: "#f6f6f6",
//                 },
//               }}
//               htmlFor="fileElem-video"
//             >
//               <Typography
//                 component={"div"}
//                 sx={{
//                   color: "#666",
//                   userSelect: "none",
//                   textAlign: "center",
//                 }}
//               >
//                 Drag Video here or click to upload
//               </Typography>
//             </Typography>
//           </Box>
//           <CameraVideoCapture handleFileUpload={handleFileUpload} />



//           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
//             <VideoPreview videos={uploadedVideos} onRemove={handleRemoveVideo} handleOpen={handleOpen} />

//           </Box>

//           <p>Dummy Videos: </p>

//           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
//             {dummyVideos?.map((item, index) => {
//               return (
//                 <Box
//                   key={index}
//                   sx={{
//                     position: "relative",
//                     width: 80,
//                     height: 80,
//                     borderRadius: 2,
//                     overflow: "hidden",
//                     border: "1px solid #ddd"
//                   }}
//                 >
//                   <video
//                     onClick={() => handleOpen(item)}
//                     src={item.url}
//                     muted
//                     // controls
//                     style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                   />
//                 </Box>
//               )
//             })}
//           </Box>
//         </>
//       ),
//     },


//   ];

//   const [activeStep, setActiveStep] = React.useState(0);

//   const handleNext = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//     setExpandedStep((prevActiveStep) => prevActiveStep + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//     setExpandedStep((prevActiveStep) => prevActiveStep - 1);
//   };

//   const handleReset = () => {
//     setActiveStep(0);
//     setActiveStep(0);
//   };

//   const handleAccordionChange = (index) => {
//     setExpandedStep(index === expandedStep ? -1 : index);
//   };



//   return (
//     <>
//       <Analytics />
//       {isLoading && <LoaderSplash show={isLoading} />}
//       <div
//         style={{
//           width: "100%",
//           minHeight: "100vh",
//           padding: "25px 0px",
//           backgroundColor: "rgb(226, 238, 224)",
//         }}
//       >
//         <Container maxWidth="sm">
//           <Paper
//             elevation={3}
//             sx={{
//               padding: "20px",
//               borderRadius: "10px",
//               boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
//               backgroundColor: "rgb(251, 247, 247)",
//             }}
//           >
//             {/* Logos on top */}
//             <Box
//               sx={{
//                 width: "100%",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 mb: 2,
//               }}
//             >
//               {[Ndma, bharat, Yuva].map((logo, i) => (
//                 <Box
//                   key={i}
//                   sx={{
//                     flex: 1,
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     padding: "0 13px",
//                   }}
//                 >
//                   <img
//                     src={logo}
//                     alt={`logo-${i}`}
//                     style={{ width: "70%", height: "auto" }}
//                   />
//                 </Box>
//               ))}
//             </Box>
//             <Typography variant="h5" gutterBottom textAlign="center">
//               NIPAM COURSE
//             </Typography>

//             {/* Letter Body */}
//             <Box sx={{ mb: 3 }}>
//               <Typography variant="body1" paragraph>
//                 Dear Principal,
//               </Typography>
//               <Typography variant="body2" paragraph>
//                 National Intellectual Property Awareness Mission (NIPAM) is a government agency responsible for formulating policies, plans, and guidelines for disaster management in India. It aims to build a safe and disaster-resilient nation by coordinating and implementing effective preparedness, response.
//               </Typography>

//               <Box >
//                 <Stepper activeStep={activeStep} orientation="vertical" >
//                   {steps.map((step, index) => (
//                     <Step key={step.label}>

//                       <StepLabel

//                         sx={{
//                           '& .MuiStepIcon-root.Mui-active': {
//                             color: '#2e7d32',
//                           },
//                           '& .MuiStepIcon-root.Mui-completed': {
//                             color: '#2e7d32',
//                           },
//                         }}
//                         optional={
//                           index === steps.length - 1 ? (
//                             <Typography variant="caption">Last step</Typography>
//                           ) : null
//                         }
//                       >
//                         <Accordion
//                           expanded={expandedStep === index}
//                           onChange={() => handleAccordionChange(index)}
//                         >
//                           <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                             {step.label}
//                           </AccordionSummary>
//                           {/* </StepLabel>
//             <StepContent> */}
//                           <AccordionDetails>
//                             <Typography>{step.description}</Typography>
//                             <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
//                               <Button
//                                 variant="contained"
//                                 color="secondary"
//                                 onClick={handleNext}
//                                 sx={{ mt: 1, mr: 1, borderRadius: "10px", }}
//                               >
//                                 {/* {index === steps.length - 1 ? 'Finish' : 'Continue'} */}
//                                 {'Continue'}
//                               </Button>
//                               <Button
//                                 variant="contained"
//                                 color="inherit"
//                                 disabled={index === 0}
//                                 onClick={handleBack}
//                                 sx={{ mt: 1, mr: 1 }}
//                               >
//                                 Back
//                               </Button>
//                             </Box>
//                           </AccordionDetails>
//                           {/* </StepContent> */}
//                         </Accordion>
//                       </StepLabel>
//                     </Step>
//                   ))}
//                 </Stepper>
//                 {activeStep === steps.length && (
//                   <Paper square elevation={0} sx={{ p: 3 }}>
//                     <Typography>All steps completed - you&apos;re finished</Typography>
//                     <Button onClick={handleReset} sx={{ mt: 1, mr: 1, textTransform: 'none' }} color="grey">
//                       Reset
//                     </Button>
//                   </Paper>
//                 )}
//               </Box>




//               <Modal
//                 open={open}
//                 onClose={handleClose}
//                 aria-labelledby="modal-media-title"
//                 aria-describedby="modal-media-description"
//               >
//                 <Box
//                   sx={{
//                     position: 'absolute',
//                     top: '50%',
//                     left: '50%',
//                     transform: 'translate(-50%, -50%)',
//                     width: 400,
//                     height: 400,
//                     border: '2px solid #000',
//                     borderRadius: '20px',
//                     bgcolor: 'background.paper',
//                     p: 2,
//                   }}
//                 >
//                   {selectedMedia?.type?.startsWith('image') && (
//                     <img
//                       src={selectedMedia.url}
//                       alt="Preview"
//                       style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }}
//                       onLoad={() => {
//                         if (selectedMedia.url?.startsWith('blob:')) {
//                           URL.revokeObjectURL(selectedMedia.url);
//                         }
//                       }}
//                     />
//                   )}

//                   {selectedMedia?.type?.startsWith('video') && (
//                     <video
//                       src={selectedMedia.url}
//                       controls
//                       style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }}
//                       onLoadedData={() => {
//                         if (selectedMedia.url?.startsWith('blob:')) {
//                           URL.revokeObjectURL(selectedMedia.url);
//                         }
//                       }}
//                     />
//                   )}

//                   {selectedMedia?.type === 'application/pdf' && (
//                     <iframe
//                       src={selectedMedia.url}
//                       style={{ width: '100%', height: '100%', borderRadius: '12px' }}
//                       title="PDF Preview"
//                     />
//                   )}

//                   {selectedMedia &&
//                     !selectedMedia.type?.startsWith('image') &&
//                     !selectedMedia.type?.startsWith('video') &&
//                     selectedMedia.type !== 'application/pdf' && (
//                       <Box
//                         sx={{
//                           display: 'flex',
//                           flexDirection: 'column',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           height: '100%',
//                           textAlign: 'center',
//                           p: 2,
//                         }}
//                       >
//                         <p>No preview available for this file type.</p>
//                         <a
//                           href={selectedMedia.url}
//                           download={selectedMedia.name}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           style={{
//                             marginTop: '10px',
//                             textDecoration: 'underline',
//                             color: '#1976d2',
//                             fontWeight: 'bold',
//                           }}
//                         >
//                           Download {selectedMedia.name}
//                         </a>
//                       </Box>
//                     )}
//                 </Box>
//               </Modal>




//             </Box>

//             {/* Form */}

//             <Grid item xs={12} sx={{ marginTop: "2%" }}>
//                               <Grid container spacing={2} justifyContent="space-between">
                              
//                                 <Grid item xs={4}>
//                                  <Button
//   color="primary"
//   variant="contained"
//   fullWidth
//   onClick={handleSubmit} // <-- ✅ add this
//   sx={{ textTransform: "none", borderRadius: "8px" }}
// >
//   Submit
// </Button>

//                                 </Grid>
//                               </Grid>
//                             </Grid>
           
//           </Paper>
//         </Container>
//       </div>
//     </>
//   );
// }

// export default Registrationnipamform

