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
    url.searchParams.set("opt", selectedOption);
    if (
      selectedOption !== "productsCsv" &&
      selectedOption !== "catalogueNoStock" &&
      selectedOption !== "productsExpired"
    ) {
      url.searchParams.set("str", startDate);
      url.searchParams.set("end", endDate);
    }

    try {
      const loadingToast = toast.loading("Generating report...");

      const response = await axios.get(url, {
        timeout: 600000,
      });

      toast.dismiss(loadingToast);

      console.log(response.data, "response report");

      if (response.data.length === 0) {
        toast.error("No results for this date and report option");
        return;
      }
      toast.success("Successfully generated!");

      const workbook = new ExcelJS.Workbook();
      const dataArray = response.data;

      if (selectedOption == "SalesByCP") {
        Object.keys(dataArray).forEach((city) => {
          const worksheet = workbook.addWorksheet(city);

          const cityData = dataArray[city];

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

          const keyDataTypes = {
            CUSTDES: ExcelJS.ValueType.String,
            Discount: ExcelJS.ValueType.Number,
            NET_VALUE: ExcelJS.ValueType.Number,
            QTY: ExcelJS.ValueType.Number,
            TOTAL_VALUE_INCL_VAT: ExcelJS.ValueType.Number,
            VAT: ExcelJS.ValueType.Number,
            over_all_discount: ExcelJS.ValueType.Number,
          };

          cityData.forEach((record) => {
            console.log(record, "record 2");
            const headerArray = Object.keys(record);
            console.log(Object.values(record), "Object.values(record) 2");
            console.log(Object.keys(record), "Object.values(record) 2");

            const valuesArray = headerArray.map((key) => {
              const dataType = keyDataTypes[key] || ExcelJS.ValueType.String;

              if (dataType === ExcelJS.ValueType.Number) {
                return parseFloat(record[key]);
              } else {
                return record[key];
              }
            });
            worksheet.addRow(Object.values(valuesArray));
          });

          headerRow.forEach((columnName, index) => {
            const column = worksheet.getColumn(index + 1);

            if (columnName != "CUSTDES") {
              column.numFmt = "#,##0.00";
            } else {
              column.numFmt = "General";
            }
          });
        });
      } else {
        const worksheet = workbook.addWorksheet("Sheet 1");

        const headerArray = Object.keys(dataArray[0]);
        worksheet.addRow(headerArray);

        const keyDataTypes = {
          "KEDIFAP CODE": ExcelJS.ValueType.String,
          DESCRIPTION: ExcelJS.ValueType.String,
          CATEGORY: ExcelJS.ValueType.String,
          NARCOTIC: ExcelJS.ValueType.Number,
          GHS: ExcelJS.ValueType.Number,
          LIQUID: ExcelJS.ValueType.Number,
          FRAGILE: ExcelJS.ValueType.Number,
          FRIDGE: ExcelJS.ValueType.Number,
          BRAND: ExcelJS.ValueType.String,
          BARCODE: ExcelJS.ValueType.String,
          RETAIL: ExcelJS.ValueType.Number,
          WHOLESALE: ExcelJS.ValueType.Number,
          "QUOTA QTY": ExcelJS.ValueType.Number,
          "AVAILABLE STOCK": ExcelJS.ValueType.Number,
          "RECEIVING QTY": ExcelJS.ValueType.Number,
          CUSTDES: ExcelJS.ValueType.String,
          Discount: ExcelJS.ValueType.Number,
          NET_VALUE: ExcelJS.ValueType.Number,
          QTY: ExcelJS.ValueType.Number,
          TOTAL_VALUE_INCL_VAT: ExcelJS.ValueType.Number,
          VAT: ExcelJS.ValueType.Number,
          over_all_discount: ExcelJS.ValueType.Number,
        };

        dataArray.forEach((data) => {
          const valuesArray = headerArray.map((key) => {
            const dataType = keyDataTypes[key] || ExcelJS.ValueType.String;

            if (dataType === ExcelJS.ValueType.Number) {
              return parseFloat(data[key]);
            } else {
              return data[key];
            }
          });

          worksheet.addRow(valuesArray);
        });

        headerArray.forEach((columnName, index) => {
          const column = worksheet.getColumn(index + 1);

          if (columnName == "EXPIRY DATE") {
            column.numFmt = "m/d/yyyy";
          } else if (
            columnName != "PARTNAME" &&
            columnName != "KEDIFAP CODE" &&
            columnName != "DESCRIPTION" &&
            columnName != "CATEGORY" &&
            columnName != "CUSTDES" &&
            columnName != "BRAND" &&
            columnName != "CITY" &&
            columnName != "BRAND"
          ) {
            column.numFmt = "#,##0.00";
          } else {
            column.numFmt = "general";
          }
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
                  <MenuItem value="productsCsv">Available Stock</MenuItem>
                  <MenuItem value="productsExpired">
                    Products Expiring in 6 Months
                  </MenuItem>
                  <MenuItem value="catalogueNoStock">
                    Active Parts Catalogue
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
