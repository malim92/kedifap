import React, { useState } from "react";
import ExcelJS from "exceljs";
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
import { toast, Toaster } from "react-hot-toast";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

let userFullId = localStorage.getItem("userId");

const VendorsReports = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleGenerateReport = async (
    userFullId,
    selectedOption,
    startDate,
    endDate
  ) => {
    console.log(
      `Generating ${selectedOption} report from ${startDate} to ${endDate}...`
    );
    const url = new URL(`${process.env.REACT_APP_API_URL}/get-report`);

    url.searchParams.set("id", userFullId);
    url.searchParams.set("str", startDate);
    url.searchParams.set("end", endDate);
    url.searchParams.set("opt", selectedOption);

    try {
      const loadingToast = toast.loading("Generating report...");

      const response = await axios.get(url, {
        timeout: 300000,
      });

      toast.dismiss(loadingToast);
      toast.success("Successfully generated!");

      console.log(response.data, "response report");

      if (response.data.length === 0) {
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const dataArray = response.data;

      if (selectedOption == "SalesByCP") {
        Object.keys(dataArray).forEach((city) => {
          const worksheet = workbook.addWorksheet(city);

          const cityData = dataArray[city];
          // cityData.forEach((record, index) => {
          //   console.log(record, "record 1");

          //   worksheet.addRow({ ...record });
          // });

          const headerRow = [
            "CUSTDES",
            "QTY",
            "NET_VALUE",
            "Discount",
            "over_all_discount",
            "VAT",
            "TOTAL_VALUE_INCL_VAT",
          ];
          worksheet.addRow(headerRow);

          cityData.forEach((record) => {
            console.log(record, "record 2");
            worksheet.addRow(Object.values(record));
          });
        });
      } else {
        const worksheet = workbook.addWorksheet("Sheet 1");

        const headerArray = Object.keys(dataArray[0]);
        worksheet.addRow(headerArray);
        dataArray.forEach((data) => {
          const valuesArray = Object.values(data);
          worksheet.addRow(valuesArray);
        });
      }

      const blob = await workbook.xlsx.writeBuffer();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([blob]));
      link.download = `${userFullId}_invoice_${selectedOption}.xlsx`;
      link.click();
    } catch (error) {
      toast.dismiss();
      toast.error("Error: ", error);
      console.error(error);
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ width: "100%" }}>
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
                  <MenuItem value="SalesByTown">Sales by city</MenuItem>
                  <MenuItem value="SalesByPharmacy">Sales by pharmacy</MenuItem>
                  <MenuItem value="SalesByBrand">Sales by brand</MenuItem>
                  <MenuItem value="SalesByProduct">Sales by product</MenuItem>
                  <MenuItem value="SalesByCP">
                    Sales by city & pharmacy
                  </MenuItem>
                  <MenuItem value="SalesByCPPB">
                    Sales by city & pharmacy & product & brand
                  </MenuItem>
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
              <Typography sx={{ fontWeight: "bold", fontStyle: "italic" }}>
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
                onClick={() =>
                  handleGenerateReport(
                    userFullId,
                    selectedOption,
                    startDate,
                    endDate
                  )
                }
                endIcon={<ArticleIcon />}
              >
                Generate Report
              </Button>
              <Toaster />
            </Item>
          </Stack>
        </Box>
      </Container>
    </>
  );
};
export default VendorsReports;
