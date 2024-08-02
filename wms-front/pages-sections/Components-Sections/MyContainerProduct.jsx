"use client";

// Import React and required hooks
import React, { useState, useRef, useEffect } from "react";

// Import MUI components
import Grid from "@mui/material/Grid";
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

import MUIDataTable from "mui-datatables";

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

// 재고를 엑셀 형식으로 보면서 관리하는 Component
const MyContainerProduct = () => {
  //API를 통해 창고의 데이터를 가져오기 위한 State
  const [tableData, setTableData] = useState([]);
  //입고 데이터를 받기 위한 State
  const [ModalTableData, setModalTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isChoosingColumn, setIsChoosingColumn] = useState(false);
  const hotTableRef = useRef(null); // HandsonTable 객체 참조
  const [openModal, setOpenModal] = useState(false); // 입고 모달 열기/닫기 상태
  const [columnSelectionStep, setColumnSelectionStep] = useState(0); // 데이터 선택
  const [selectedColumns, setSelectedColumns] = useState({
    barcode: null,
    name: null,
    quantity: null,
    expiration_date: null,
  });
  // HandsonTable 엑셀 형식에서 수정하기 위한 Modal State
  const [openEditModal, setOpenEditModal] = useState(false); // 수정용 모달 열기/닫기

  // 처음 엑셀로 데이터를 받았을 때 이를 변환하는 메서드
  const convertToArrayOfArraysModal = (data) => {
    setModalTableData(data);
    return data;
  };

  // 엑셀을 통해 입고(import)했을 때의 모든 절차를 밟는 메서드
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

  // 데이터를 엑셀로 다운로드 받는 메서드
  const downloadExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([
      columns.map((col) => col.label),
      ...tableData,
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "ADN_project엑셀테스트.xlsx");
  };

  // 열의 색상을 바꾸는 메서드
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

  // 열을 클릭하면 해당하는 열의 색상을 바꾸는 메서드
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

  // 입고 시에, 최종적으로 선택된 칼럼을 DB에 보내는 메서드
  const finalizeSelection = () => {
    // 선택된 열의 데이터를 postData에 담는 과정
    const postData = ModalTableData.map((row) => ({
      barcode: row[selectedColumns.barcode],
      name: row[selectedColumns.name],
      quantity: row[selectedColumns.quantity],
      expirationDate: null,
      productStorageTypeEnum: "상온",
    }));

    // 생성된 데이터를 DB에 전송한다.
    importAPI(postData);

    // 입고 시 발생하는 설정 변경 초기화
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
  const importAPI = async (postData) => {
    try {
      // postData에 businessId와 warehouseId를 추가한다.
      const newPostData = {
        warehouseId: 2,
        businessId: 1,
        data: postData,
      };

      const response = await fetch(
        "https://i11a508.p.ssafy.io/api/products/import",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPostData),
        }
      );

      if (response.ok) {
        console.log("Data posted successfully");
      } else {
        console.error("Error posting data");
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  //API 통신 테스트
  const productGetAPI = async () => {
    try {
      const response = await fetch(
        "https://i11a508.p.ssafy.io/api/products?bussinessId=1",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const apiConnection = await response.json();
        const products = apiConnection.result;

        // Extract only the required columns
        const formattedData = products.map((product) => ({
          name: product.productDetail.name,
          barcode: product.productDetail.barcode,
          quantity: product.quantity,
          location: product.locationName,
          floorLevel: product.floorLevel,
        }));

        // Define the columns
        const headers = [
          "이름",
          "바코드(식별번호)",
          "수량",
          "적재함",
          "단(층)수",
        ];

        const formattedColumns = headers.map((head) => ({
          name: head,
          label: head,
        }));

        // Prepare the data for Handsontable
        const data = formattedData.map((product) => [
          product.name,
          product.barcode,
          product.quantity,
          product.location,
          product.floorLevel,
        ]);

        setColumns(formattedColumns);
        setTableData(data);
      } else {
        console.error("Error loading rectangles data");
      }
    } catch (error) {
      console.error("Error loading rectangles data:", error);
    }
  };

  /**
   * UseEffect를 통해 새로고침 때마다 api로 사장님의 재고를 불러옴
   */

  useEffect(() => {
    productGetAPI();
  }, [openModal]);

  return (
    <div style={{ marginBottom: "1%", margin: "2%" }}>
      {isChoosingColumn && (
        <div style={{ color: "red", fontWeight: "bold" }}>
          Choose the column that you want
        </div>
      )}
      <div>
        <Grid item xs={6} md={4}>
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
          <Button variant="contained" color="secondary" onClick={downloadExcel}>
            Excel 다운로드
          </Button>
          <Button variant="contained" color="primary" onClick={productGetAPI}>
            API 데이터 받아오기
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => importAPI(tableData)} // Updated to send current table data
          >
            Send POST Request
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenEditModal(true)}
          >
            엑셀에서 수정하기
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

        <Dialog
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>데이터를 수정하고 저장하세요.</DialogTitle>
          <DialogContent>
            <HotTable
              height={600}
              ref={hotTableRef}
              data={tableData}
              colWidths={[`120vw`, `130vw`, `50`, `100`, `100`, 130, 156]}
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
            ></HotTable>
          </DialogContent>
          <DialogActions>
            <Button color="primary">저장하기</Button>
            <Button onClick={() => setOpenEditModal(false)} color="primary">
              닫기
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <Grid item xs={12}>
        <MUIDataTable title={"상품 목록"} data={tableData} columns={columns} />
      </Grid>
    </div>
  );
};

export default MyContainerProduct;
