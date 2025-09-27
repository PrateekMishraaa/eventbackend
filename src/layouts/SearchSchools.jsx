import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { Typography, Box, Button, Card, CardContent, MenuItem, FormControl, Select, InputLabel } from "@mui/material";
import { State, City } from 'country-state-city';

const SearchSchools = () => {
    const [schoolList, setSchoolList] = useState([
        { name: "Springfield High School" },
        { name: "Riverside Academy" },
        { name: "Greenwood School" },
        { name: "Hillside College" },
        { name: "Maple Leaf School" }]);
    const [error, setError] = useState(null);
    const [isSearched, setIsSearched] = useState(false); // New state to track if a search has been performed

    const fetchSchools = async (state, city) => {
        try {
            const response = await axios.post('/api/schools', {
                state: state?.label || '',
                city: city?.label || ''
            });
            return response.data.schools || [];
        } catch (error) {
            console.error("Error fetching schools: ", error);
            throw new Error("Unable to fetch schools");
        }
    };

    // Hardcoded India details as user doesn't need to interact with this.
    const india = { label: "India", value: "IN" };

    const formik = useFormik({
        initialValues: {
            state: "",
            city: ""
        },
        onSubmit: async (values) => {
            setIsSearched(true); // Set isSearched to true when a search is performed
            try {
                const schools = await fetchSchools(values.state, values.city);
                if (schools.length === 0) {
                    setSchoolList([]);
                } else {
                    setSchoolList(schools);
                }
            } catch (err) {
                setError("An error occurred while fetching the data.");
            }
        }
    });

    const updatedStates = () =>
        State.getStatesOfCountry(india.value).map((state) => ({
            label: state.name,
            value: state.isoCode
        }));

    const updatedCities = (stateCode) =>
        City.getCitiesOfState(india.value, stateCode).map((city) => ({
            label: city.name,
            value: city.name
        }));

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h5" gutterBottom textAlign="center">
                6000+ Schools so far participated are:
            </Typography>
            <form onSubmit={formik.handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* State selection using MUI Select with label and helper text */}
                    <FormControl fullWidth>
                        <InputLabel>Select State</InputLabel>
                        <Select
                            id="state"
                            name="state"
                            value={formik.values.state}
                            label="Select State"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderRadius: "8px",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "grey !important",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "grey !important",
                                    },
                                },
                            }}
                            onChange={(e) => {
                                formik.setFieldValue("state", e.target.value);
                                formik.setFieldValue("city", "");  // Reset city when state changes
                            }}
                        >
                            {updatedStates().map((state) => (
                                <MenuItem key={state.value} value={state.value}>
                                    {state.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* City selection using MUI Select with label and helper text */}
                    <FormControl fullWidth>
                        <InputLabel>Select City</InputLabel>
                        <Select
                            id="city"
                            name="city"
                            value={formik.values.city}
                            label="Select City"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderRadius: "8px",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "grey !important", // Grey on hover
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "grey !important", // Grey when focused
                                    },
                                },
                            }}
                            onChange={(e) => formik.setFieldValue("city", e.target.value)}
                            disabled={!formik.values.state}
                        >
                            {formik.values.state &&
                                updatedCities(formik.values.state).map((city) => (
                                    <MenuItem key={city.value} value={city.value}>
                                        {city.label}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>

                    <Button
                        color="primary"
                        variant="contained"
                        fullWidth
                        type="submit"
                        sx={{ textTransform: "none", borderRadius: "8px" }}
                    >
                        Submit
                    </Button>
                </Box>
            </form>

            {/* Show error message */}
            {error && (
                <Box sx={{ marginTop: 2 }}>
                    <Typography color="error">{error}</Typography>
                </Box>
            )}

            {/* Show school cards or "No College found" message based on search */}
            <Box sx={{ marginTop: 3 }}>
                {!isSearched && schoolList.length > 0 ? (
                    schoolList.map((school, index) => (
                        <Card key={index} sx={{ marginBottom: 2, boxShadow: 2, borderRadius: 2, padding: 2 }}>
                            <CardContent>{school.name}</CardContent>
                        </Card>
                    ))
                ) : isSearched && schoolList.length === 0 ? (
                    <Typography>No College found.</Typography>
                ) : null}
            </Box>
        </Box>
    );
};

export default SearchSchools;
