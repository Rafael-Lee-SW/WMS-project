"use client";

// Import React and required hooks
import React, { useState, useRef } from "react";

// Import MUI components
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Fab from "@mui/material/Fab";
import Button from "@mui/material/Button";

// Import SheetJS xlsx for Excel operations
import * as XLSX from "xlsx";

// Import Handsontable plugins and cell types
import {
  AutoColumnSize,
  Autofill,
  ContextMenu,
  CopyPaste,
  DropdownMenu,
  Filters,
  HiddenRows,
  registerPlugin,
} from "handsontable/plugins";
import {
  CheckboxCellType,
  NumericCellType,
  registerCellType,
} from "handsontable/cellTypes";

// Import Handsontable and its styles
import "@handsontable/react";
import { HotTable, HotColumn } from "@handsontable/react";
import "pikaday/css/pikaday.css";
import "handsontable/dist/handsontable.full.css";

// Import custom hooks and callbacks
import { addClassesToRows, alignHeaders } from "/components/Test/hooksCallbacks.jsx";

import Handsontable from "handsontable";

// Register cell types and plugins
registerCellType(CheckboxCellType);
registerCellType(NumericCellType);

registerPlugin(AutoColumnSize);
registerPlugin(Autofill);
registerPlugin(ContextMenu);
registerPlugin(CopyPaste);
registerPlugin(DropdownMenu);
registerPlugin(Filters);
registerPlugin(HiddenRows);

// Starting point of Excel control
const ExcelImport = () => {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isChoosingColumn, setIsChoosingColumn] = useState(false);
  const hotTableRef = useRef(null); // Reference to the Handsontable instance
  let columnCounter = 0;

  // Convert data to array of arrays and set table data
  const convertToArrayOfArrays = (data) => {
    setTableData(data);
    return data;
  };

  // Import Excel file and process it
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
      const formattedColumns = headers.map((head) => ({
        name: head,
        label: head,
      }));
      setColumns(formattedColumns);
      fileData.splice(0, 1);
      convertToArrayOfArrays(fileData);
    };
    reader.readAsArrayBuffer(file);
  };

  // Download the table data as an Excel file
  const downloadExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([
      columns.map((col) => col.label),
      ...tableData,
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "ADN_project엑셀테스트.xlsx");
  };

  // Load local Excel file
  const loadLocalExcel = async () => {
    const response = await fetch("/excel/Uniqlo.xlsx");
    const data = await response.arrayBuffer();
    const file = new File([data], "Uniqlo.xlsx", {
      type: "application/vnd.ms-excel",
    });
    importExcel(file);
  };

  
  // -- json save & load part

  // Save the table data as a JSON file in the local public/excel directory
  const saveJsonToLocal = async () => {
    try {
      const response = await fetch('/api/save-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tableData),
      });

      if (response.ok) {
        console.log('JSON data saved successfully');
      } else {
        console.error('Error saving JSON data');
      }
    } catch (error) {
      console.error('Error saving JSON data:', error);
    }
  };

   // Load the JSON data file from the local public/excel directory
   const loadJsonFromLocal = async () => {
    try {
      const response = await fetch('/api/load-json', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const jsonData = await response.json();
        setTableData(jsonData);
      } else {
        console.error('Error loading JSON data');
      }
    } catch (error) {
      console.error('Error loading JSON data:', error);
    }
  };

  // -- json save & load part

  // Apply color to the specified column
  const applyColumnColor = (columnIndex) => {
    const hotInstance = hotTableRef.current.hotInstance;

    hotInstance.batch(() => {
      tableData.forEach((row, rowIndex) => {
        hotInstance.setCellMeta(
          rowIndex,
          columnIndex,
          "className",
          `background-color-${columnIndex}`
        );
      });
    });

    const styleElement = document.createElement("style");
    styleElement.textContent = `.background-color-${columnIndex} { background-color: blue !important; }`;
    document.head.append(styleElement);

    hotInstance.render();
  };

  // Handle column click event to apply color
  const handleColumnClick = (event, coords) => {
    if (isChoosingColumn) {
      applyColumnColor(coords.col);
      columnCounter++;

      if (columnCounter >= 4) {
        setIsChoosingColumn(false);
        columnCounter = 0; // Reset the counter
      }
    }
  };

  // Start choosing columns for color change
  const startChoosingColumns = () => {
    setIsChoosingColumn(true);
    columnCounter = 0; // Reset counter when starting a new action
  };

  return (
    <div style={{ marginBottom: "1%", margin: "2%" }}>
      <div>
        <h1>Excel 가져오기</h1>
      </div>
      {isChoosingColumn && (
        <div style={{ color: "red", fontWeight: "bold" }}>
          Choose the column that you want
        </div>
      )}
      <div>
        <div>
          <label htmlFor="upload-photo">
            <input
              required
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
        </div>
        <Grid item xs={6} md={4}>
          <Button variant="contained" color="secondary" onClick={downloadExcel}>
            Excel 다운로드
          </Button>
          <Button variant="contained" color="primary" onClick={loadLocalExcel}>
            로컬 엑셀 파일 불러오기
          </Button>
        </Grid>
        <Grid item xs={6} md={4}>
          <Button variant="contained" color="primary" onClick={startChoosingColumns}>
            컬럼 색상 변경
          </Button>
          <Button variant="contained" color="primary" onClick={saveJsonToLocal}>
            JSON 저장
          </Button>
          <Button variant="contained" color="primary" onClick={loadJsonFromLocal}>
            JSON 로드
          </Button>
        </Grid>
      </div>
      <div>
        <HotTable
        height={600}
          ref={hotTableRef}
          data={tableData}
          colHeaders={columns.map((col) => col.label)}
          dropdownMenu={true}
          hiddenColumns={{
            indicators: true,
          }}
          contextMenu={true}
          multiColumnSorting={true}
          filters={true}
          rowHeaders={true}
          autoWrapCol={true}
          autoWrapRow={true}
          afterGetColHeader={alignHeaders}
          beforeRenderer={addClassesToRows}
          manualRowMove={true}
          navigableHeaders={true}
          licenseKey="non-commercial-and-evaluation"
          afterOnCellMouseDown={handleColumnClick}
        />
      </div>
    </div>
  );
};

export default ExcelImport;
