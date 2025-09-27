import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
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
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  Snackbar,
  Alert,
  Chip,
  Stack,
  styled,
} from "@mui/material";

import { Upload as UploadIcon, Close as CloseIcon } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Mock components and data (you'll need to import your actual ones)
const LoaderSplash = ({ show }) => show ? <div>Loading...</div> : null;
const Popup = (type, title, message, duration) => {
  console.log(`${type}: ${title} - ${message}`);
};
const CameraCapture = ({ handleFileUpload }) => (
  <Button variant="outlined" size="small">Camera Capture</Button>
);
const CameraVideoCapture = ({ handleFileUpload }) => (
  <Button variant="outlined" size="small">Video Capture</Button>
);
const VideoPreview = ({ videos, onRemove, handleOpen }) => (
  <div>Video Preview Component</div>
);

// Mock BASE_URL
const REACT_APP_API_BASE_URL = "https://eventbackend2.onrender.com/";

const dummyImages = [
  { url: "https://via.placeholder.com/150", alt: "Image1", type: "image/jpeg" },
  { url: "https://via.placeholder.com/150", alt: "Image2", type: "image/jpeg" },
];

const dummyVideos = [
  { url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", type: "video" },
];

const DropZone = styled("div")(({ theme, isDragActive }) => ({
  border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider
    }`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: "center",
  backgroundColor: isDragActive ? "rgba(25, 118, 210, 0.04)" : "transparent",
  cursor: "pointer",
  marginBottom: theme.spacing(2),
  transition: "all 0.2s ease",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: "rgba(25, 118, 210, 0.04)",
  },
}));

const FilePreview = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
}));

const MergedRegistrationForm = () => {
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
  const [uploadedLetter, setUploadedLetter] = useState(null);
  const [open1, setOpen1] = useState(false);
  const [udiseCode, setUdiseCode] = useState("");

  // SchoolForm states
  const [formData, setFormData] = useState({
    schoolName: "",
    teacherName: "",
    teacherContact: "",
    email: "",
    schoolType: "",
    state: "",
    district: "",
    block: "",
    udiseCode: "",
    totalStudentsMale: "",
    totalStudentsFemale: "",
    trainedStudentsMale: "",
    trainedStudentsFemale: "",
    trainedDisabledStudentsMale: "",
    trainedDisabledStudentsFemale: "",
    totalTeachersMale: "",
    totalTeachersFemale: "",
    trainedTeachersMale: "",
    trainedTeachersFemale: "",
    trainedDisabledTeachersMale: "",
    trainedDisabledTeachersFemale: "",
    hasDMPlan: "",
    rapidSurvay: "",
    hasDrill: "",
    fireDrillConducted: "",
    fireDrillCount: "",
    fireDrillLastDate: "",
    earthquakeDrillConducted: "",
    earthquakeDrillCount: "",
    earthquakeDrillLastDate: "",
    heatwaveDrillConducted: "",
    heatwaveDrillCount: "",
    heatwaveDrillLastDate: "",
    regionaldisasterDrillConducted: "",
    regionaldisasterDrillCount: "",
    regionaldisasterDrillLastDate: "",
    urbanfloodDrillConducted: "",
    urbanfloodDrillCount: "",
    urbanfloodDrillLastDate: "",
    otherDrillConducted: "",
    otherDrillCount: "",
    otherDrillLastDate: "",
    hasSDMC: "",
    hasRI: "",
    hasMap: "",
  });

  const today = new Date();
  const maxDate = today.toISOString().split("T")[0];
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const minDate = sixMonthsAgo.toISOString().split("T")[0];

  const [error, setError] = useState(false);

  // File states
  const [sdmcFile, setSdmcFile] = useState(null);
  const [riFile, setRiFile] = useState(null);
  const [mapFile, setMapFile] = useState(null);
  const [fireDrillFile, setFireDrillFile] = useState(null);
  const [earthquakeDrillFile, setEarthquakeDrillFile] = useState(null);
  const [heatwaveDrillFile, setHeatwaveDrillFile] = useState(null);
  const [regionDisasterDrillFile, setRegionDisasterDrillFile] = useState(null);
  const [urbanFloodDrillFile, setUrbanFloodDrillFile] = useState(null);
  const [otherDrillFile, setOtherDrillFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // FIXED: Simplified state management for dropdowns
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [blockName, setBlockName] = useState("");

  const [allState, setAllState] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [allblock, setAllBlock] = useState([]);

  const [loading, setLoadingForm] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Media handlers
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

  // Toast function
  const toast = {
    error: (message) => {
      setSnackbar({
        open: true,
        message,
        severity: "error",
      });
    },
    success: (message) => {
      setSnackbar({
        open: true,
        message,
        severity: "success",
      });
    }
  };

  // Formik validation schema
  const validationSchema = Yup.object({
    agree: Yup.bool()
      .oneOf([true], "You must accept the pledge.")
      .required("You must accept the pledge."),
  });

  const formik = useFormik({
    initialValues: {
      agree: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await handleSubmit();
    },
    onReset: () => { },
  });

  // Mock data for states (replace with your actual API call)
  const mockStates = [
    { stateId: "1", stateName: "Delhi", stateRegionId: "01" },
    { stateId: "2", stateName: "Maharashtra", stateRegionId: "02" },
    { stateId: "3", stateName: "Karnataka", stateRegionId: "03" },
    { stateId: "4", stateName: "Tamil Nadu", stateRegionId: "04" },
  ];

  const mockDistricts = {
    "1": [
      { districtId: "101", districtName: "New Delhi" },
      { districtId: "102", districtName: "South Delhi" }
    ],
    "2": [
      { districtId: "201", districtName: "Mumbai" },
      { districtId: "202", districtName: "Pune" }
    ],
    "3": [
      { districtId: "301", districtName: "Bangalore" },
      { districtId: "302", districtName: "Mysore" }
    ],
    "4": [
      { districtId: "401", districtName: "Chennai" },
      { districtId: "402", districtName: "Coimbatore" }
    ],
  };

  const mockBlocks = {
    "101": [{ blockName: "Central Delhi" }, { blockName: "Connaught Place" }],
    "102": [{ blockName: "Lajpat Nagar" }, { blockName: "Greater Kailash" }],
    "201": [{ blockName: "Andheri" }, { blockName: "Bandra" }],
    "202": [{ blockName: "Shivajinagar" }, { blockName: "Koregaon Park" }],
  };

  // Fetch states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        // Replace this with your actual API call
        setAllState(mockStates);

        /* 
        const res = await fetch(`${BASE_URL}/school/getStateWithId`);
        const data = await res.json();
        if (data.success) {
          const uniqueStates = Array.from(
            new Map(data.states.map((item) => [item.stateId, item])).values()
          );
          setAllState(uniqueStates);
        }
        */
      } catch (err) {
        console.error("Error fetching states:", err);
      }
    };

    fetchStates();
  }, []);

  // FIXED: State change handler
  const handleStateChange = async (event) => {
    const stateId = event.target.value;
    setSelectedStateId(stateId);

    // Find the selected state
    const selectedStateObj = allState.find(
      (state) => state.stateId === stateId
    );

    if (selectedStateObj) {
      // Update formData with state name
      setFormData((prev) => ({
        ...prev,
        state: selectedStateObj.stateName,
        district: "", // Reset district when state changes
      }));

      // Reset district and block selections
      setSelectedDistrictId("");
      setBlockName("");
      setAllBlock([]);

      try {
        // Replace with your actual API call
        const districts = mockDistricts[stateId] || [];
        setAvailableDistricts(districts);

        /*
        const response = await fetch(`${BASE_URL}/school/districts/${stateId}`);
        const data = await response.json();
        const uniqueDistricts = [
          ...new Map(data.districts.map((d) => [d.districtId, d])).values(),
        ];
        setAvailableDistricts(uniqueDistricts);
        */
      } catch (error) {
        console.error("Failed to fetch districts:", error);
        setAvailableDistricts([]);
      }
    }
  };

  // FIXED: District change handler
  const handleDistrictChange = async (event) => {
    const districtId = event.target.value;
    setSelectedDistrictId(districtId);

    // Find the selected district
    const selectedDistrict = availableDistricts.find(
      (district) => district.districtId === districtId
    );

    if (selectedDistrict) {
      // Update formData with district name
      setFormData((prev) => ({
        ...prev,
        district: selectedDistrict.districtName,
      }));

      // Reset block selection
      setBlockName("");

      try {
        // Replace with your actual API call
        const blocks = mockBlocks[districtId] || [];
        setAllBlock(blocks);

        /*
        const response = await axios.get(`${BASE_URL}/school/blocks/${districtId}`);
        setAllBlock(response.data.blocks);
        */
      } catch (error) {
        console.error("Error fetching blocks:", error);
        setAllBlock([]);
      }
    }
  };

  // FIXED: Block change handler
  const handleBlockChange = (event) => {
    const selectedBlock = event.target.value;
    setBlockName(selectedBlock);
    setFormData((prev) => ({
      ...prev,
      block: selectedBlock,
    }));
  };

  // Fetch school by UDISE code
  //  useEffect(() => {


  //   fetchSchlByUdisecode();
  // }, [formData.udiseCode]);
  const fetchSchlByUdisecode = async () => {
    if (!formData.udiseCode || formData.udiseCode === "0") return;

    try {
      const udiseCode = formData.udiseCode;
      const response = await axios.get(
        // `${REACT_APP_API_BASE_URL}/getSchoolByUdiseCode/${formData.udiseCode}`
        `${REACT_APP_API_BASE_URL}/getSchoolByUdiseCode/${udiseCode}`
        // `http://localhost:5000/api/getSchoolByUdiseCode/${udiseCode}`
      );
      const data = response.data.data.school;
      console.log("this is udise data")

      setFormData(prev => ({
        ...prev,
        schoolName: data.schoolName,
        teacherName: data.teacherName,
        teacherContact: data.teacherContact,
        email: data.email,
        schoolType: data.schoolType,
        state: data.state,
        district: data.district,
        block: data.block,
        udiseCode: data.udiseCode,

        totalStudentsMale: data.totalStudentsMale,
        totalStudentsFemale: data.totalStudentsFemale,
        totalStudents: data.totalStudents,

        trainedStudentsMale: data.trainedStudentsMale,
        trainedStudentsFemale: data.trainedStudentsFemale,
        trainedDisabledStudentsMale: data.trainedDisabledStudentsMale,
        trainedDisabledStudentsFemale: data.trainedDisabledStudentsFemale,

        totalTeachersMale: data.totalTeachersMale,
        totalTeachersFemale: data.totalTeachersFemale,
        totalTeachers: data.totalTeachers,

        trainedTeachersMale: data.trainedTeachersMale,
        trainedTeachersFemale: data.trainedTeachersFemale,
        trainedDisabledTeachersMale: data.trainedDisabledTeachersMale,
        trainedDisabledTeachersFemale: data.trainedDisabledTeachersFemale,

        programLike: data.programLike,
        disasterPlan: data.disasterPlan,
        rapidVisualSurvey: data.rapidVisualSurvey,
        drillsLastSixMonths: data.drillsLastSixMonths,
        disasterCommittee: data.disasterCommittee,
        resourceInventory: data.resourceInventory,
        evacuationPlan: data.evacuationPlan,
        hasDMPlan: data.hasDMPlan,
        rapidSurvay: data.rapidSurvay,
        hasDrill: data.hasDrill,
        fireDrillConducted: data.fireDrillConducted,
        earthquakeDrillConducted: data.earthquakeDrillConducted,
        heatwaveDrillConducted: data.heatwaveDrillConducted,
        regionaldisasterDrillConducted: data.regionaldisasterDrillConducted,
        urbanfloodDrillConducted: data.urbanfloodDrillConducted,
        otherDrillConducted: data.otherDrillConducted,

        uploadImage: data.uploadImage,
        uploadVideo: data.uploadVideo,
        uploadLetter: data.uploadLetter,
        gps: data.gps
      }));


    } catch (error) {
      console.error(error);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = Number(value);

    const currentYear = new Date().getFullYear();
    const minDateValidation = `${currentYear}-01-01`;
    const maxDateValidation = `${currentYear}-12-31`;

    // Validation logic
    if (["schoolName", "teacherName"].includes(name)) {
      const regex = /^[a-zA-Z\s]*$/;
      if (!regex.test(value)) {
        return;
      } else {
        setError("");
      }
    }

    if (name === "teacherContact") {
      const contactRegex = /^[0-9]{0,10}$/;
      if (!contactRegex.test(value)) {
        return;
      }
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        // Optional: set error state
      } else {
        setError("");
      }
    }

    if (
      [
        "fireDrillCount",
        "earthquakeDrillCount",
        "heatwaveDrillCount",
        "regionaldisasterDrillCount",
        "urbanfloodDrillCount",
        "otherDrillCount",
      ].includes(name)
    ) {
      if (numericValue < 0 || numericValue > 2) {
        return;
      }
    }

    if (
      [
        "fireDrillLastDate",
        "earthquakeDrillLastDate",
        "heatwaveDrillLastDate",
        "regionaldisasterDrillLastDate",
        "urbanfloodDrillLastDate",
        "otherDrillLastDate",
      ].includes(name)
    ) {
      if (value < minDateValidation || value > maxDateValidation) {
        toast.error("Date must be within the current year");
        return;
      }
    }

    if (Number(value) < 0) {
      setError("Value cannot be negative");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e, setter) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setter(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (setter) => (e) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const handleFileUpload = async (e, gps = null) => {
    const files = e.target.files;
    if (!files.length) return;
    const fieldName = e.target.name;

    switch (fieldName) {
      case "uploadImage":
        setUploadedImages((prev) => [...prev, ...files]);
        // Auto-save to database
        await saveFilesToDatabase(Array.from(files), 'images');
        break;
      case "uploadVideo":
        setUploadedVideos((prev) => [...prev, ...files]);
        // Auto-save to database
        await saveFilesToDatabase(Array.from(files), 'videos');
        break;
      case "uploadLetter":
        setUploadedLetter(files[0]);
        await saveFilesToDatabase([files[0]], 'letter');
        break;
      default:
        console.warn("Unknown upload field:", fieldName);
    }
  };

  // Function to save files to database immediately upon upload
  const saveFilesToDatabase = async (files, type) => {
    try {
      const formDataToSend = new FormData();

      files.forEach((file, index) => {
        formDataToSend.append(`${type}`, file);
      });

      // Add metadata
      formDataToSend.append('type', type);
      formDataToSend.append('udiseCode', formData.udiseCode);
      formDataToSend.append('email', formData.email);

      // Replace with your actual endpoint
      console.log(`Saving ${type} files to database...`, files.map(f => f.name));

      /*
      const response = await fetch(`${BASE_URL}/upload/files`, {
        method: 'POST',
        body: formDataToSend,
      });
      
      if (response.ok) {
        toast.success(`${type} uploaded successfully!`);
      }
      */

      // Mock success response
      toast.success(`${type} uploaded successfully!`);
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast.error(`Error uploading ${type}`);
    }
  };

  const renderFileUpload = (
    label,
    file,
    setter,
    accept = ".jpg,.jpeg,.png,.gif,.pdf"
  ) => {
    const handleFileChangeCustom = (e) => {
      const selectedFile = e.target.files[0];
      if (!selectedFile) return;

      const forbiddenExtensions = [".xls", ".xlsx"];
      const fileName = selectedFile.name.toLowerCase();
      if (forbiddenExtensions.some((ext) => fileName.endsWith(ext))) {
        toast.error("Excel files are not allowed");
        return;
      }

      setter(selectedFile);
      // Auto-save file to database
      saveFilesToDatabase([selectedFile], label);
    };

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          {label}
        </Typography>

        {file ? (
          <FilePreview>
            <Typography variant="body2">{file.name}</Typography>
            <CloseIcon
              fontSize="small"
              color="error"
              onClick={() => setter(null)}
              sx={{ cursor: "pointer" }}
            />
          </FilePreview>
        ) : (
          <>
            <DropZone
              isDragActive={dragActive}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={(e) => handleDrop(e, setter)}
              onClick={() => document.getElementById(`${label}-input`)?.click()}
              sx={{ cursor: "pointer" }}
            >
              <UploadIcon color="action" />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Drag and drop your file here or click to browse
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Accepted formats: {accept} (Excel files not allowed)
              </Typography>
            </DropZone>

            <input
              id={`${label}-input`}
              type="file"
              accept={accept}
              onChange={handleFileChangeCustom}
              style={{ display: "none" }}
            />
          </>
        )}
      </Box>
    );
  };

  const handleSubmit = async () => {
    setLoadingForm(true);

    // Validate required fields
    if (
      !formData.schoolName ||
      !formData.teacherName ||
      !formData.teacherContact ||
      !formData.email ||
      !formData.schoolType ||
      !formData.state ||
      !formData.district ||
      !formData.block ||
      !formData.udiseCode
    ) {
      toast.error("All required fields must be filled");
      setLoadingForm(false);
      return;
    }

    // Validate media uploads
    if (uploadedImages.length === 0 || uploadedVideos.length === 0) {
      toast.error("Please upload both images and videos before submitting.");
      setLoadingForm(false);
      return;
    }

    const formDataToSend = new FormData();

    // Add all form data
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== "") {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Add GPS if available
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000
        });
      });
      const gps = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      formDataToSend.append("gps", JSON.stringify(gps));
    } catch (error) {
      console.log("GPS not available");
    }

    // Add all files
    uploadedImages.forEach((file) => formDataToSend.append("uploadImage", file));
    uploadedVideos.forEach((file) => formDataToSend.append("uploadVideo", file));
    if (uploadedLetter) formDataToSend.append("uploadLetter", uploadedLetter);
    if (sdmcFile) formDataToSend.append("sdmcFile", sdmcFile);
    if (riFile) formDataToSend.append("riFile", riFile);
    if (mapFile) formDataToSend.append("mapFile", mapFile);
    if (fireDrillFile) formDataToSend.append("fireDrillFile", fireDrillFile);
    if (earthquakeDrillFile) formDataToSend.append("earthquakeDrillFile", earthquakeDrillFile);
    if (heatwaveDrillFile) formDataToSend.append("heatwaveDrillFile", heatwaveDrillFile);
    if (regionDisasterDrillFile) formDataToSend.append("regionDisasterDrillFile", regionDisasterDrillFile);
    if (urbanFloodDrillFile) formDataToSend.append("urbanFloodDrillFile", urbanFloodDrillFile);
    if (otherDrillFile) formDataToSend.append("otherDrillFile", otherDrillFile);

    
    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/register`, {
        method: "POST",
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Registration submitted successfully!");
        resetForm();
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Error submitting form. Please try again.");
    } finally {
      setLoadingForm(false);
    }
  };


  const resetForm = () => {
    setFormData({
      schoolName: "",
      teacherName: "",
      teacherContact: "",
      email: "",
      schoolType: "",
      state: "",
      district: "",
      block: "",
      udiseCode: "",
      totalStudentsMale: "",
      totalStudentsFemale: "",
      trainedStudentsMale: "",
      trainedStudentsFemale: "",
      trainedDisabledStudentsMale: "",
      trainedDisabledStudentsFemale: "",
      totalTeachersMale: "",
      totalTeachersFemale: "",
      trainedTeachersMale: "",
      trainedTeachersFemale: "",
      trainedDisabledTeachersMale: "",
      trainedDisabledTeachersFemale: "",
      hasDMPlan: "",
      rapidSurvay: "",
      hasDrill: "",
      fireDrillConducted: "",
      fireDrillCount: "",
      fireDrillLastDate: "",
      earthquakeDrillConducted: "",
      earthquakeDrillCount: "",
      earthquakeDrillLastDate: "",
      heatwaveDrillConducted: "",
      heatwaveDrillCount: "",
      heatwaveDrillLastDate: "",
      regionaldisasterDrillConducted: "",
      regionaldisasterDrillCount: "",
      regionaldisasterDrillLastDate: "",
      urbanfloodDrillConducted: "",
      urbanfloodDrillCount: "",
      urbanfloodDrillLastDate: "",
      otherDrillConducted: "",
      otherDrillCount: "",
      otherDrillLastDate: "",
      hasSDMC: "",
      hasRI: "",
      hasMap: "",
    });

    // Reset dropdowns
    setSelectedStateId("");
    setSelectedDistrictId("");
    setBlockName("");
    setAvailableDistricts([]);
    setAllBlock([]);

    // Reset file states
    setSdmcFile(null);
    setRiFile(null);
    setMapFile(null);
    setFireDrillFile(null);
    setEarthquakeDrillFile(null);
    setHeatwaveDrillFile(null);
    setRegionDisasterDrillFile(null);
    setUrbanFloodDrillFile(null);
    setOtherDrillFile(null);

    // Reset uploaded media
    setUploadedImages([]);
    setUploadedVideos([]);
    setUploadedLetter(null);

    if (imageInputRef.current) imageInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
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
      label: "Pledge",
      description: (
        <Box>
          <Typography>Click below to read the pledge.</Typography>
          <Button
            variant="outlined"
            color="info"
            onClick={() => setOpen1(true)}
            sx={{ mt: 2 }}
          >
            View Pledge
          </Button>

          <Dialog
            open={open1}
            onClose={() => setOpen1(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>Pledge PDF</DialogTitle>
            <DialogContent>
              <Box sx={{ height: 500 }}>
                <Typography variant="body2">
                  Pledge content would be displayed here. In your actual implementation,
                  you can embed the PDF or show the pledge text.
                </Typography>
              </Box>
            </DialogContent>
          </Dialog>
        </Box>
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
            <Typography
              component={"input"}
              sx={{
                display: "none",
              }}
              name="uploadImage"
              type="file"
              ref={imageInputRef}
              id="fileElem-image"
              accept="image/*"
              multiple
              onChange={(event) => {
                const inputFiles = event.currentTarget.files;
                if (!inputFiles || inputFiles.length === 0) return;

                const files = Array.from(inputFiles);
                const images = [];

                files.forEach((file) => {
                  if (file.type.startsWith("image/")) {
                    images.push(file);
                  }
                });

                setUploadedImages((prev) => [...prev, ...images]);
                // Auto-save to database
                saveFilesToDatabase(images, 'images');
              }}
              style={{ width: "100%" }}
            />
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
              htmlFor="fileElem-image"
            >
              <Typography
                component={"div"}
                sx={{
                  color: "#666",
                  userSelect: "none",
                  textAlign: "center",
                }}
              >
                Drag Image here or click to upload
              </Typography>
            </Typography>
          </Box>

          <CameraCapture handleFileUpload={handleFileUpload} />

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
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
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

          <Typography variant="subtitle2" sx={{ mt: 2 }}>Dummy Images:</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            {dummyImages?.map((item, index) => {
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
                    onClick={() => handleOpen(item)}
                    src={item.url}
                    alt={item.alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                  />
                </Box>
              );
            })}
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
            <Typography
              component={"input"}
              sx={{
                display: "none",
              }}
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
                const videos = [];

                files.forEach((file) => {
                  if (file.type.startsWith("video/")) {
                    videos.push(file);
                  }
                });

                setUploadedVideos((prev) => [...prev, ...videos]);
                // Auto-save to database
                saveFilesToDatabase(videos, 'videos');
              }}
              style={{ width: "100%" }}
            />
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
              htmlFor="fileElem-video"
            >
              <Typography
                component={"div"}
                sx={{
                  color: "#666",
                  userSelect: "none",
                  textAlign: "center",
                }}
              >
                Drag Video here or click to upload
              </Typography>
            </Typography>
          </Box>

          <CameraVideoCapture handleFileUpload={handleFileUpload} />

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
            {uploadedVideos?.map((video, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  width: 120,
                  height: 80,
                  borderRadius: 1,
                  overflow: "hidden",
                  border: "1px solid #ddd",
                }}
              >
                <video
                  src={URL.createObjectURL(video)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  onClick={() => handleOpen({ item: video })}
                  muted
                />
                <Box
                  onClick={() => handleRemoveVideo(index)}
                  sx={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    backgroundColor: "rgba(0,0,0,0.7)",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "white",
                    fontSize: "12px",
                  }}
                >
                  ×
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    position: "absolute",
                    bottom: 2,
                    left: 2,
                    backgroundColor: "rgba(0,0,0,0.7)",
                    color: "white",
                    px: 0.5,
                    borderRadius: 0.5,
                    fontSize: "10px",
                  }}
                >
                  {video.name}
                </Typography>
              </Box>
            ))}
          </Box>

          <Typography variant="subtitle2" sx={{ mt: 2 }}>Dummy Videos:</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            {dummyVideos?.map((item, index) => {
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
                  <video
                    onClick={() => handleOpen(item)}
                    src={item.url}
                    muted
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </>
      ),
    },
      {
    label: "Upload Letter",
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
            type="file"
            name="uploadLetter"
            id="fileElem-letter"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
          <label
            htmlFor="fileElem-letter"
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
            }}
          >
            <Typography
              sx={{
                color: "#666",
                userSelect: "none",
                textAlign: "center",
              }}
            >
              Drag Letter/Document here or click to upload
            </Typography>
          </label>
        </Box>

        {uploadedLetter && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Uploaded Letter:</Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 1,
                backgroundColor: "grey.100",
                borderRadius: 1,
                mt: 1,
              }}
            >
              <Typography variant="body2">{uploadedLetter.name}</Typography>
              <IconButton
                size="small"
                onClick={() => setUploadedLetter(null)}
                color="error"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        )}
      </>
    ),
  },
  ];

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setExpandedStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setExpandedStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setExpandedStep(0);
  };

  const handleAccordionChange = (index) => {
    setExpandedStep(index === expandedStep ? -1 : index);
  };

  // Check if UDISE code is empty or 0
  const isUdiseEmpty = !formData.udiseCode || formData.udiseCode === "0";

  return (
    <>
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
            {/* Header */}
            <Typography variant="h5" gutterBottom textAlign="center">
              NDMA FORM
            </Typography>

            {/* Letter Body */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" paragraph>
                Dear Principal,
              </Typography>
              <Typography variant="body2" paragraph>
                The Commission for Air Quality Management (NDMA) is a statutory
                body established by the Government of India to address and
                monitor air quality issues, particularly in the National Capital
                Region (NCR) and adjoining areas. It is responsible for
                formulating policies, regulations, and guidelines to control air
                pollution and ensure cleaner air for all. The NDMA aims to build
                a sustainable and pollution-free environment by coordinating
                with stakeholders, enforcing compliance, and promoting awareness
                through programs and initiatives at the institutional and
                community level.
              </Typography>

              {/* Stepper for media uploads */}
              <Box>
                <Stepper activeStep={activeStep} orientation="vertical">
                  {steps.map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel
                        sx={{
                          "& .MuiStepIcon-root.Mui-active": {
                            color: "#2e7d32",
                          },
                          "& .MuiStepIcon-root.Mui-completed": {
                            color: "#2e7d32",
                          },
                        }}
                        optional={
                          index === steps.length - 1 ? (
                            <Typography variant="caption">Last step</Typography>
                          ) : null
                        }
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
                                {"Continue"}
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

              {/* Media Preview Modal */}
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
                      onLoadedData={() => {
                        if (selectedMedia.url?.startsWith("blob:")) {
                          URL.revokeObjectURL(selectedMedia.url);
                        }
                      }}
                    />
                  )}

                  {selectedMedia?.type === "application/pdf" && (
                    <iframe
                      src={selectedMedia.url}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "12px",
                      }}
                      title="PDF Preview"
                    />
                  )}

                  {selectedMedia &&
                    !selectedMedia.type?.startsWith("image") &&
                    !selectedMedia.type?.startsWith("video") &&
                    selectedMedia.type !== "application/pdf" && (
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
                        <Typography>No preview available for this file type.</Typography>
                        <Button
                          href={selectedMedia.url}
                          download={selectedMedia.name}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ mt: 2 }}
                        >
                          Download {selectedMedia.name}
                        </Button>
                      </Box>
                    )}
                </Box>
              </Modal>
            </Box>

            {/* Comprehensive Form */}
            <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
              {/* UDISE Code at the top */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  {/* <TextField
                    label="UDISE Code"
                    name="udiseCode"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.udiseCode}
                    onChange={handleChange}
                    helperText="Enter UDISE code to auto-fill school details"
                  /> */}
                  <TextField
                    label="UDISE Code"
                    name="udiseCode"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.udiseCode}
                    onChange={(e) => {
                      handleChange(e); // keeps your existing state update
                    }}
                    onBlur={() => {
                      if (formData.udiseCode) {
                        fetchSchlByUdisecode(formData.udiseCode); // <-- call API when user leaves the field
                      }
                    }}
                    helperText="Enter UDISE code to auto-fill school details"
                  />
                </Grid>
              </Grid>

              {/* School Information Section */}
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                School Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="School Name"
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    required
                    disabled={isUdiseEmpty}
                    error={!!error}
                    helperText={error}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Teacher Name"
                    name="teacherName"
                    value={formData.teacherName}
                    onChange={handleChange}
                    required
                    disabled={isUdiseEmpty}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Teacher Contact"
                    name="teacherContact"
                    type="text"
                    value={formData.teacherContact}
                    onChange={handleChange}
                    required
                    disabled={isUdiseEmpty}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isUdiseEmpty}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel required>School Type</InputLabel>
                    <Select
                      name="schoolType"
                      value={formData.schoolType}
                      onChange={handleChange}
                      label="School Type"
                      required
                      disabled={isUdiseEmpty}
                    >
                      <MenuItem value="Private">Private</MenuItem>
                      <MenuItem value="Government">Government</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* FIXED: State Dropdown */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel required>State</InputLabel>
                    <Select
                      label="State"
                      value={selectedStateId}
                      onChange={handleStateChange}
                      disabled={isLoading || isUdiseEmpty}
                      variant="outlined"
                    >
                      {allState.map((state) => (
                        <MenuItem
                          key={state.stateId}
                          value={state.stateId}
                          sx={{ fontSize: "0.875rem" }}
                        >
                          {state.stateName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* FIXED: District Dropdown */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel required>District</InputLabel>
                    <Select
                      label="District"
                      value={selectedDistrictId}
                      onChange={handleDistrictChange}
                      required
                      disabled={!selectedStateId || isLoading || isUdiseEmpty}
                      variant="outlined"
                    >
                      {availableDistricts.map((district) => (
                        <MenuItem
                          key={district.districtId}
                          value={district.districtId}
                        >
                          {district.districtName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* FIXED: Block Dropdown */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel required>Block</InputLabel>
                    <Select
                      label="Block"
                      value={blockName}
                      onChange={handleBlockChange}
                      required
                      disabled={!selectedDistrictId || isUdiseEmpty}
                      variant="outlined"
                    >
                      {allblock.map((block, index) => (
                        <MenuItem key={index} value={block.blockName}>
                          {block.blockName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Student Information Section */}
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Student Information
              </Typography>
              <Grid container spacing={3}>
                {/* Total Students */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Total Students
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Male"
                    name="totalStudentsMale"
                    type="number"
                    value={formData.totalStudentsMale}
                    onChange={handleChange}
                    disabled={isUdiseEmpty}
                    inputProps={{ min: 0 }}
                    error={!!error}
                    helperText={error}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Female"
                    name="totalStudentsFemale"
                    type="number"
                    value={formData.totalStudentsFemale}
                    onChange={handleChange}
                    disabled={isUdiseEmpty}
                    inputProps={{ min: 0 }}
                    error={!!error}
                    helperText={error}
                  />
                </Grid>

                {/* Trained Students */}
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Trained Students
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Male"
                    name="trainedStudentsMale"
                    type="number"
                    value={formData.trainedStudentsMale}
                    onChange={handleChange}
                    disabled={isUdiseEmpty}
                    inputProps={{ min: 0 }}
                    error={!!error}
                    helperText={error}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Female"
                    name="trainedStudentsFemale"
                    type="number"
                    value={formData.trainedStudentsFemale}
                    onChange={handleChange}
                    disabled={isUdiseEmpty}
                    inputProps={{ min: 0 }}
                    error={!!error}
                    helperText={error}
                  />
                </Grid>

                {/* Trained Disabled Students */}
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Trained Disabled Students
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Male"
                    name="trainedDisabledStudentsMale"
                    type="number"
                    value={formData.trainedDisabledStudentsMale}
                    onChange={handleChange}
                    disabled={isUdiseEmpty}
                    inputProps={{ min: 0 }}
                    error={!!error}
                    helperText={error}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Female"
                    name="trainedDisabledStudentsFemale"
                    type="number"
                    value={formData.trainedDisabledStudentsFemale}
                    onChange={handleChange}
                    disabled={isUdiseEmpty}
                    inputProps={{ min: 0 }}
                    error={!!error}
                    helperText={error}
                  />
                </Grid>
              </Grid>

              {/* Teacher Information Section */}
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Teacher Information
              </Typography>
              <Grid container spacing={3}>
                {/* Total Teachers */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Total Teachers
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Male"
                    name="totalTeachersMale"
                    type="number"
                    value={formData.totalTeachersMale}
                    onChange={handleChange}
                    disabled={isUdiseEmpty}
                    inputProps={{ min: 0 }}
                    error={!!error}
                    helperText={error}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Female"
                    name="totalTeachersFemale"
                    type="number"
                    value={formData.totalTeachersFemale}
                    onChange={handleChange}
                    disabled={isUdiseEmpty}
                    inputProps={{ min: 0 }}
                    error={!!error}
                    helperText={error}
                  />
                </Grid>

                {/* Trained Teachers */}
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Trained Teachers
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Male"
                    name="trainedTeachersMale"
                    type="number"
                    value={formData.trainedTeachersMale}
                    onChange={handleChange}
                    disabled={isUdiseEmpty}
                    inputProps={{ min: 0 }}
                    error={!!error}
                    helperText={error}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Female"
                    name="trainedTeachersFemale"
                    type="number"
                    value={formData.trainedTeachersFemale}
                    onChange={handleChange}
                    disabled={isUdiseEmpty}
                    inputProps={{ min: 0 }}
                    error={!!error}
                    helperText={error}
                  />
                </Grid>
              </Grid>

              {/* Disaster Management Section */}
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Disaster Management
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl component="fieldset" required>
                    <Typography component="legend">
                      Rapid Visual Survey Done?
                    </Typography>
                    <RadioGroup
                      row
                      name="rapidSurvay"
                      value={formData.rapidSurvay}
                      onChange={handleChange}
                      required
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="Yes"
                        disabled={isUdiseEmpty}
                        required
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="No"
                        disabled={isUdiseEmpty}
                        required
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl component="fieldset" required>
                    <Typography component="legend" required>
                      Conducted any drills in last 6 months?
                    </Typography>
                    <RadioGroup
                      row
                      name="hasDrill"
                      value={formData.hasDrill}
                      onChange={handleChange}
                      required
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="Yes"
                        disabled={isUdiseEmpty}
                        required
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="No"
                        disabled={isUdiseEmpty}
                        required
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {formData.hasDrill === "yes" && (
                  <>
                    {/* Fire Drill */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">Fire Drill</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth required>
                        <InputLabel>Conducted?</InputLabel>
                        <Select
                          name="fireDrillConducted"
                          value={formData.fireDrillConducted}
                          onChange={handleChange}
                          label="Conducted?"
                          disabled={isUdiseEmpty}
                          required
                        >
                          <MenuItem value="yes">Yes</MenuItem>
                          <MenuItem value="no">No</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {formData.fireDrillConducted === "yes" && (
                      <>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Fire Drill Last Date"
                            name="fireDrillLastDate"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={formData.fireDrillLastDate}
                            onChange={handleChange}
                            disabled={isUdiseEmpty}
                            inputProps={{
                              min: minDate,
                              max: maxDate,
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Count"
                            name="fireDrillCount"
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            value={formData.fireDrillCount}
                            onChange={handleChange}
                            disabled={isUdiseEmpty}
                            inputProps={{ min: 0, max: 2 }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          {renderFileUpload(
                            "Upload Fire Drill Images/Document",
                            fireDrillFile,
                            setFireDrillFile
                          )}
                        </Grid>
                      </>
                    )}

                    {/* Earthquake Drill */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">Earthquake Drill</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth required>
                        <InputLabel>Conducted?</InputLabel>
                        <Select
                          name="earthquakeDrillConducted"
                          value={formData.earthquakeDrillConducted}
                          onChange={handleChange}
                          label="Conducted?"
                          disabled={isUdiseEmpty}
                          required
                        >
                          <MenuItem value="yes">Yes</MenuItem>
                          <MenuItem value="no">No</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {formData.earthquakeDrillConducted === "yes" && (
                      <>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Last Date"
                            name="earthquakeDrillLastDate"
                            type="date"
                            required
                            InputLabelProps={{ shrink: true }}
                            value={formData.earthquakeDrillLastDate}
                            onChange={handleChange}
                            disabled={isUdiseEmpty}
                            inputProps={{
                              min: minDate,
                              max: maxDate,
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Count"
                            name="earthquakeDrillCount"
                            type="number"
                            required
                            InputLabelProps={{ shrink: true }}
                            value={formData.earthquakeDrillCount}
                            onChange={handleChange}
                            disabled={isUdiseEmpty}
                            inputProps={{ min: 0, max: 2 }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          {renderFileUpload(
                            "Upload Earthquake Drill Images/Document",
                            earthquakeDrillFile,
                            setEarthquakeDrillFile
                          )}
                        </Grid>
                      </>
                    )}

                    {/* Heatwave Drill */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">Heatwave Drill</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth required>
                        <InputLabel>Conducted?</InputLabel>
                        <Select
                          name="heatwaveDrillConducted"
                          value={formData.heatwaveDrillConducted}
                          onChange={handleChange}
                          label="Conducted?"
                          disabled={isUdiseEmpty}
                          required
                        >
                          <MenuItem value="yes">Yes</MenuItem>
                          <MenuItem value="no">No</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {formData.heatwaveDrillConducted === "yes" && (
                      <>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Last Date"
                            name="heatwaveDrillLastDate"
                            type="date"
                            required
                            InputLabelProps={{ shrink: true }}
                            value={formData.heatwaveDrillLastDate}
                            onChange={handleChange}
                            disabled={isUdiseEmpty}
                            inputProps={{
                              min: minDate,
                              max: maxDate,
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Count"
                            name="heatwaveDrillCount"
                            type="number"
                            required
                            InputLabelProps={{ shrink: true }}
                            value={formData.heatwaveDrillCount}
                            onChange={handleChange}
                            disabled={isUdiseEmpty}
                            inputProps={{ min: 0, max: 2 }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          {renderFileUpload(
                            "Upload Heatwave Drill Images/Document",
                            heatwaveDrillFile,
                            setHeatwaveDrillFile
                          )}
                        </Grid>
                      </>
                    )}

                    {/* Region Specific Disaster Drill */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">
                        Region Specific Disaster Drill
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth required>
                        <InputLabel>Conducted?</InputLabel>
                        <Select
                          name="regionaldisasterDrillConducted"
                          value={formData.regionaldisasterDrillConducted}
                          onChange={handleChange}
                          label="Conducted?"
                          disabled={isUdiseEmpty}
                          required
                        >
                          <MenuItem value="yes">Yes</MenuItem>
                          <MenuItem value="no">No</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {formData.regionaldisasterDrillConducted === "yes" && (
                      <>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Last Date"
                            name="regionaldisasterDrillLastDate"
                            type="date"
                            required
                            InputLabelProps={{ shrink: true }}
                            value={formData.regionaldisasterDrillLastDate}
                            onChange={handleChange}
                            disabled={isUdiseEmpty}
                            inputProps={{
                              min: minDate,
                              max: maxDate,
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Count"
                            name="regionaldisasterDrillCount"
                            type="number"
                            required
                            InputLabelProps={{ shrink: true }}
                            value={formData.regionaldisasterDrillCount}
                            onChange={handleChange}
                            disabled={isUdiseEmpty}
                            inputProps={{ min: 0, max: 2 }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          {renderFileUpload(
                            "Upload Region Disaster Drill Images/Document",
                            regionDisasterDrillFile,
                            setRegionDisasterDrillFile
                          )}
                        </Grid>
                      </>
                    )}

                    {/* Urban Flood Drill */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">Urban Flood Drill</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth required>
                        <InputLabel>Conducted?</InputLabel>
                        <Select
                          name="urbanfloodDrillConducted"
                          value={formData.urbanfloodDrillConducted}
                          onChange={handleChange}
                          label="Conducted?"
                          disabled={isUdiseEmpty}
                          required
                        >
                          <MenuItem value="yes">Yes</MenuItem>
                          <MenuItem value="no">No</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {formData.urbanfloodDrillConducted === "yes" && (
                      <>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Last Date"
                            name="urbanfloodDrillLastDate"
                            type="date"
                            required
                            InputLabelProps={{ shrink: true }}
                            value={formData.urbanfloodDrillLastDate}
                            onChange={handleChange}
                            disabled={isUdiseEmpty}
                            inputProps={{
                              min: minDate,
                              max: maxDate,
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Count"
                            name="urbanfloodDrillCount"
                            type="number"
                            required
                            InputLabelProps={{ shrink: true }}
                            value={formData.urbanfloodDrillCount}
                            onChange={handleChange}
                            disabled={isUdiseEmpty}
                            inputProps={{ min: 0, max: 2 }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          {renderFileUpload(
                            "Upload Urban Flood Drill Images/Document",
                            urbanFloodDrillFile,
                            setUrbanFloodDrillFile
                          )}
                        </Grid>
                      </>
                    )}

                    {/* Other Drill */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">Other Drill</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth required>
                        <InputLabel>Conducted?</InputLabel>
                        <Select
                          name="otherDrillConducted"
                          value={formData.otherDrillConducted}
                          onChange={handleChange}
                          label="Conducted?"
                          disabled={isUdiseEmpty}
                          required
                        >
                          <MenuItem value="yes">Yes</MenuItem>
                          <MenuItem value="no">No</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {formData.otherDrillConducted === "yes" && (
                      <>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Last Date"
                            name="otherDrillLastDate"
                            type="date"
                            required
                            InputLabelProps={{ shrink: true }}
                            value={formData.otherDrillLastDate}
                            onChange={handleChange}
                            disabled={isUdiseEmpty}
                            inputProps={{
                              min: minDate,
                              max: maxDate,
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Count"
                            name="otherDrillCount"
                            type="number"
                            required
                            InputLabelProps={{ shrink: true }}
                            value={formData.otherDrillCount}
                            onChange={handleChange}
                            disabled={isUdiseEmpty}
                            inputProps={{ min: 0, max: 2 }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          {renderFileUpload(
                            "Upload Other Drill Document",
                            otherDrillFile,
                            setOtherDrillFile
                          )}
                        </Grid>
                      </>
                    )}
                  </>
                )}

                {/* SDMC */}
                <Grid item xs={12}>
                  <FormControl component="fieldset" required>
                    <Typography component="legend">
                      School Disaster Management Committee formed?
                    </Typography>
                    <RadioGroup
                      row
                      name="hasSDMC"
                      value={formData.hasSDMC}
                      onChange={handleChange}
                      required
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="Yes"
                        disabled={isUdiseEmpty}
                        required
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="No"
                        disabled={isUdiseEmpty}
                        required
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {formData.hasSDMC === "yes" && (
                  <Grid item xs={12}>
                    {renderFileUpload(
                      "Upload SDMC Document",
                      sdmcFile,
                      setSdmcFile
                    )}
                  </Grid>
                )}

                {/* Resource Inventory */}
                <Grid item xs={12}>
                  <FormControl component="fieldset" required>
                    <Typography component="legend">
                      Resource Inventory Maintained?
                    </Typography>
                    <RadioGroup
                      row
                      name="hasRI"
                      value={formData.hasRI}
                      onChange={handleChange}
                      required
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="Yes"
                        disabled={isUdiseEmpty}
                        required
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="No"
                        disabled={isUdiseEmpty}
                        required
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {formData.hasRI === "yes" && (
                  <Grid item xs={12}>
                    {renderFileUpload(
                      "Upload Resource Inventory",
                      riFile,
                      setRiFile
                    )}
                  </Grid>
                )}

                {/* Evacuation Plan */}
                <Grid item xs={12}>
                  <FormControl component="fieldset" required>
                    <Typography component="legend">
                      Evacuation plan with exit map available?
                    </Typography>
                    <RadioGroup
                      row
                      name="hasMap"
                      value={formData.hasMap}
                      onChange={handleChange}
                      required
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="Yes"
                        disabled={isUdiseEmpty}
                        required
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="No"
                        disabled={isUdiseEmpty}
                        required
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {formData.hasMap === "yes" && (
                  <Grid item xs={12}>
                    {renderFileUpload(
                      "Upload School Map / Exit Plan",
                      mapFile,
                      setMapFile,
                      ".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    )}
                  </Grid>
                )}

                {/* Disaster Management Plan */}
                <Grid item xs={12}>
                  <FormControl component="fieldset" required>
                    <Typography component="legend">
                      School Disaster Management Plan created?
                    </Typography>
                    <RadioGroup
                      row
                      name="hasDMPlan"
                      value={formData.hasDMPlan}
                      onChange={handleChange}
                      required
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="Yes"
                        disabled={isUdiseEmpty}
                        required
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="No"
                        disabled={isUdiseEmpty}
                        required
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Pledge Checkbox */}
              <Grid item xs={12} sx={{ mt: 3 }}>
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
                  label="I hereby agree and confirm that I voluntarily take this e-pledge and commit to uphold its values with sincerity and responsibility."
                />
                {formik.errors.agree && formik.touched.agree && (
                  <Typography color="error" variant="caption" display="block">
                    {formik.errors.agree}
                  </Typography>
                )}
              </Grid>

              {/* Submit Buttons */}
              <Grid item xs={12} sx={{ marginTop: "2%" }}>
                <Grid container spacing={2} justifyContent="space-between">
                  <Grid item xs={4}>
                    <Button
                      color="secondary"
                      variant="contained"
                      fullWidth
                      type="button"
                      onClick={resetForm}
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
                      disabled={loading || isUdiseEmpty || !formik.values.agree}
                      sx={{ textTransform: "none", borderRadius: "8px" }}
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MergedRegistrationForm;