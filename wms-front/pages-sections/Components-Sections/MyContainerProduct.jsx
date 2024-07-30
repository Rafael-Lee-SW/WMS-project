"use client";

// Import React and required hooks
import React, { useState, useRef, useEffect } from "react";

// Import MUI components
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Fab from "@mui/material/Fab";
import Button from "@mui/material/Button";
// 모달 페이지를 위한 Import
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

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
import {
  addClassesToRows,
  alignHeaders,
} from "/components/Test/hooksCallbacks.jsx";

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
  //API를 불러온 데이터 셋
  const [tableData, setTableData] = useState([]);
  //모달을 위한 데이터 셋
  const [ModalTableData, setModalTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isChoosingColumn, setIsChoosingColumn] = useState(false);
  const hotTableRef = useRef(null); // Reference to the Handsontable instance
  let columnCounter = 0;

  const [openModal, setOpenModal] = useState(false); // State for modal open/close
  const [columnSelectionStep, setColumnSelectionStep] = useState(0); // State for column selection steps
  const [selectedColumns, setSelectedColumns] = useState({
    barcode: null,
    name: null,
    quantity: null,
    expiry: null,
  });

  // Convert data to array of arrays and set table data
  const convertToArrayOfArrays = (data) => {
    setTableData(data);
    return data;
  };

  // Convert data to array of arrays and set table data
  const convertToArrayOfArraysModal = (data) => {
    setModalTableData(data);
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
      convertToArrayOfArraysModal(fileData);
      setOpenModal(true); // Open the modal after importing the file
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
      const response = await fetch("/api/save-json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tableData),
      });

      if (response.ok) {
        console.log("JSON data saved successfully");
      } else {
        console.error("Error saving JSON data");
      }
    } catch (error) {
      console.error("Error saving JSON data:", error);
    }
  };

  // Load the JSON data file from the local public/excel directory
  const loadJsonFromLocal = async () => {
    try {
      const response = await fetch("/api/load-json", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const jsonData = await response.json();
        setTableData(jsonData);
      } else {
        console.error("Error loading JSON data");
      }
    } catch (error) {
      console.error("Error loading JSON data:", error);
    }
  };

  // -- json save & load part

  // Apply color to the specified column
  const applyColumnColor = (columnIndex, color) => {
    const hotInstance = hotTableRef.current.hotInstance;

    hotInstance.batch(() => {
      ModalTableData.forEach((row, rowIndex) => {
        hotInstance.setCellMeta(
          rowIndex,
          columnIndex,
          "className",
          `background-color-${columnIndex}`
        );
      });
    });

    const styleElement = document.createElement("style");
    styleElement.textContent = `.background-color-${columnIndex} { background-color: ${color} !important; }`;
    document.head.append(styleElement);

    hotInstance.render();
  };

  // Handle column click event to apply color
  const handleColumnClick = (event, coords) => {
    if (columnSelectionStep >= 0) {
      const colorMap = ["blue", "green", "red", "orange"];
      const columnKeys = ["barcode", "name", "quantity", "expiry"];
      applyColumnColor(coords.col, colorMap[columnSelectionStep]);
      setSelectedColumns((prevSelected) => ({
        ...prevSelected,
        [columnKeys[columnSelectionStep]]: coords.col,
      }));
      setColumnSelectionStep(columnSelectionStep + 1);
    }
  };

  // 최종적으로 선택된 칼럼에 해당하는 데이터를 보낸다.
  const finalizeSelection = () => {
    console.log("Finalized columns:", selectedColumns);
    // Gather the selected data based on the user's column selections.
    const postData = ModalTableData.map((row) => ({
      barcode: row[selectedColumns.barcode],
      name: row[selectedColumns.name],
      quantity: row[selectedColumns.quantity],
      expiry: selectedColumns.expiry !== null ? row[selectedColumns.expiry] : null,
    }));

    // Send the gathered data to the API
    APIPOSTConnectionTest(postData);

    setOpenModal(false);
    setColumnSelectionStep(0);
    setSelectedColumns({
      barcode: null,
      name: null,
      quantity: null,
      expiry: null,
    });
  };

  // API POST 통신 테스트
  const APIPOSTConnectionTest = async (postData) => {
    try {
      const response = await fetch(
        "https://i11a508.p.ssafy.io/api/products/import",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      if (response.ok) {
        console.log("Data posted successfully");
        const result = await response.json();
        console.log(result);
      } else {
        console.error("Error posting data");
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  //API 통신 테스트
  const APIConnectionTest = async () => {
    try {
      const response = await fetch("https://i11a508.p.ssafy.io/api/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const apiConnection = await response.json();
        const products = apiConnection.result;

        // Extract only the required columns
        const formattedData = products.map((product) => ({
          name: product.productDetail.name,
          barcode: product.productDetail.barcode,
          quantity: product.quantity,
        }));

        // Define the columns
        const headers = ["name", "barcode", "quantity"];

        const formattedColumns = headers.map((head) => ({
          name: head,
          label: head,
        }));

        // Prepare the data for Handsontable
        const data = formattedData.map((product) => [
          product.name,
          product.barcode,
          product.quantity,
        ]);

        setColumns(formattedColumns);
        setTableData(data);
        console.log(products);
      } else {
        console.error("Error loading rectangles data");
      }
    } catch (error) {
      console.error("Error loading rectangles data:", error);
    }
  };

  // Start choosing columns for color change
  const startChoosingColumns = () => {
    setIsChoosingColumn(true);
    columnCounter = 0; // Reset counter when starting a new action
  };

  /**
   * UseEffect를 통해 새로고침 때마다 api로 사장님의 재고를 불러옴
   */

  useEffect(() => {
    APIConnectionTest();
  }, []);

  return (
    <div style={{ marginBottom: "1%", margin: "2%" }}>
      <div>
        <h2>재고 현황 Excel로 보고 수정하기</h2>
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
              입고 문서 업로드
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
          <Button
            variant="contained"
            color="primary"
            onClick={startChoosingColumns}
          >
            컬럼 색상 변경
          </Button>
          <Button variant="contained" color="primary" onClick={saveJsonToLocal}>
            JSON 저장
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={loadJsonFromLocal}
          >
            JSON 로드
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={APIConnectionTest}
          >
            API 데이터 받아오기
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => APIPOSTConnectionTest(tableData)}  // Updated to send current table data
          >
            Send POST Request
          </Button>
        </Grid>
      </div>
      <div>
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            {columnSelectionStep === 0 && "바코드가 있는 열을 선택하세요."}
            {columnSelectionStep === 1 && "상품 이름이 있는 열을 선택하세요."}
            {columnSelectionStep === 2 && "수량이 있는 열을 선택하세요."}
            {columnSelectionStep === 3 && "유통기한이 있는 상품들입니까?"}
            {columnSelectionStep === 4 && "유통 기한 칼럼을 선택하세요."}
            {columnSelectionStep === 5 &&
              "최종적으로 선택된 데이터를 확인하세요."}
          </DialogTitle>
          <DialogContent>
            {columnSelectionStep < 3 && (
              <div>
                <p>
                  {columnSelectionStep === 0 &&
                    "바코드가 있는 열을 선택하세요."}
                  {columnSelectionStep === 1 &&
                    "상품 이름이 있는 열을 선택하세요."}
                  {columnSelectionStep === 2 && "수량이 있는 열을 선택하세요."}
                </p>
              </div>
            )}
            {columnSelectionStep === 3 && (
              <div>
                <Button
                  onClick={() => setColumnSelectionStep(4)}
                  color="primary"
                >
                  Yes
                </Button>
                <Button
                  onClick={() => setColumnSelectionStep(5)}
                  color="primary"
                >
                  No
                </Button>
              </div>
            )}
            <HotTable
              height={600}
              ref={hotTableRef}
              data={ModalTableData}
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
          </DialogContent>
          <DialogActions>
            {columnSelectionStep === 5 && (
              <Button onClick={finalizeSelection} color="primary">
                네
              </Button>
            )}
            <Button onClick={() => setOpenModal(false)} color="primary">
              닫기
            </Button>
          </DialogActions>
        </Dialog>
        <HotTable
          height={600}
          ref={hotTableRef}
          data={tableData}
          colWidths={[200, 200, 150, 200, 150, 130, 156]}
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
        ></HotTable>
      </div>
    </div>
  );
};

export default ExcelImport;
