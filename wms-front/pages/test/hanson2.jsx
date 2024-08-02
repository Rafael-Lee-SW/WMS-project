import React, { useEffect, useRef } from "react";
import Handsontable from "handsontable";
import * as XLSX from "xlsx";
import Fab from "@mui/material/Fab";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import "handsontable/dist/handsontable.full.css";

//Starting point of Excel control
const ExcelImport = () => {
  const hotTableRef = useRef(null);
  const hotInstanceRef = useRef(null);

  useEffect(() => {
    hotInstanceRef.current = new Handsontable(hotTableRef.current, {
      data: [],
      colHeaders: true,
      rowHeaders: true,
      contextMenu: true,
      dropdownMenu: true,
      filters: true,
      manualRowMove: true,
      multiColumnSorting: true,
      hiddenColumns: { indicators: true },
      autoWrapCol: true,
      autoWrapRow: true,
      licenseKey: "non-commercial-and-evaluation"
    });
  }, []);

  // Convert data to JSON format
  const convertToJson = (headers, data) => {
    return data.map((row) => {
      let rowData = {};
      row.forEach((element, index) => {
        rowData[headers[index]] = element;
      });
      return rowData;
    });
  };

  // Import Excel File
  const importExcel = (input) => {
    let file;
    if (input.target && input.target.files) {
      file = input.target.files[0];
    } else {
      file = input;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event.target.result;
      const workBook = XLSX.read(bstr, { type: "binary" });
      const workSheetName = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[workSheetName];
      const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
      const headers = fileData[0];
      const data = fileData.slice(1);
      const jsonData = convertToJson(headers, data);

      // Update Handsontable instance
      hotInstanceRef.current.updateSettings({
        data: jsonData,
        columns: headers.map((header) => ({ data: header }))
      });
    };
    reader.readAsArrayBuffer(file);
  };

  // Download Excel File
  const downloadExcel = () => {
    const data = hotInstanceRef.current.getData();
    const headers = hotInstanceRef.current.getColHeader();
    const jsonData = [headers, ...data];
    const worksheet = XLSX.utils.aoa_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "ADN_project엑셀테스트.xlsx");
  };

  // Load Local Excel File
  const loadLocalExcel = async () => {
    const response = await fetch("/excel/Uniqlo.xlsx");
    const data = await response.arrayBuffer();
    const file = new File([data], "Uniqlo.xlsx", { type: "application/vnd.ms-excel" });
    importExcel(file);
  };

  return (
    <div style={{ marginBottom: "1%", margin: "2%" }}>
      <div>
        <h1>Excel 가져오기</h1>
      </div>
      <div>
        <label htmlFor="upload-photo">
          <input
            style={{ display: "none" }}
            id="upload-photo"
            name="upload_photo"
            type="file"
            onChange={importExcel}
          />
          <Fab
            color="primary"
            size="small"
            component="span"
            aria-label="add"
            variant="extended"
          >
            문서 업로드
          </Fab>
        </label>
        <Grid item xs={6} md={4}>
          <Button variant="contained" color="secondary" onClick={downloadExcel}>
            Excel 다운로드
          </Button>
          <Button variant="contained" color="primary" onClick={loadLocalExcel}>
            로컬 엑셀 파일 불러오기
          </Button>
        </Grid>
      </div>
      <div ref={hotTableRef} style={{ width: "100%", marginTop: "20px" }}></div>
    </div>
  );
};

export default ExcelImport;
