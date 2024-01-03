import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import Stack from "@mui/material/Stack";
import ArticleIcon from "@mui/icons-material/Article";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const VendorsReports = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  let userFullId = localStorage.getItem("userId");

  const handleGenerateReport = async () => {
    const formData = {
      userFullId,
      selectedOption,
      startDate,
      endDate,
    };
    console.log(
      `Generating ${selectedOption} report from ${startDate} to ${endDate}`
    );
    const url = new URL(`${process.env.REACT_APP_API_URL}/report?id=${userFullId}`);
    url.searchParams.set("opt", selectedOption);
    url.searchParams.set("str", startDate);
    url.searchParams.set("end", endDate);

    try {
      const response = await axios.get(url, formData, {
        headers: {
          'Content-Type': 'application/json', 
        },
        responseType: 'blob',
      });
      console.log(response, 'response.data');
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = userFullId + '_sales_Invoice_test.xlsx';
      link.click();
    } catch (error) {
      alert("There was an issue creating your excel file.");
      console.error(error);
    }
  };

  return (
    <>
      <Container maxWidth="sm">
      <Box sx={{ width: '100%' }}>
        <Stack spacing={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Report Generator
          </Typography>

          <FormControl variant="standard" fullWidth sx={{ marginBottom: 2 }}>
            <Item>
              <InputLabel id="report-option-label">
                Select Report Option
              </InputLabel>
              <Select
                fullWidth
                labelId="report-option-label"
                id="report-option"
                value={selectedOption}
                label="Select Report Option"
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <MenuItem value="SalesByTown">Sales by Town</MenuItem>
                <MenuItem value="SalesByPharmacy">Sales by Pharmacy</MenuItem>
                <MenuItem value="SalesByBrand">Sales by Brand</MenuItem>
              </Select>
            </Item>
            </FormControl>
          <Item>
            <Typography
              variant="standard"
              sx={{ fontWeight: "bold", fontStyle: "italic" }}
            >
              From Date
            </Typography>
            <TextField
              fullWidth
              variant="standard"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
          </Item>
          <Item>
            <Typography
              sx={{ fontWeight: "bold", fontStyle: "italic" }}
            >
              To Date
            </Typography>
            <TextField
            variant="standard"
              fullWidth
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
          </Item>
          <Item>
            {/* <Box textAlign="center"> */}
              <Button
                variant="contained"
                onClick={handleGenerateReport}
                endIcon={<ArticleIcon />}
              >
                Generate Report
              </Button>
            {/* </Box> */}
          </Item>
          
        </Stack>
        </Box>
      </Container>
    </>
  );
};
export default VendorsReports;
