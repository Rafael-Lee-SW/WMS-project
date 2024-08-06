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
  const [detailedData, setDetailedData] = useState([]); // Store all import/export data
  const [ModalTableData, setModalTableData] = useState([]);
  const [columns, setColumns] = useState([]);
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
  const [editData, setEditData] = useState([]); // State to track edited data

  //출고 데이터를 받기 위한 State
  const [ModalTableExportData, setModalTableExportData] = useState([]);
  const [exportColumns, setExportColumns] = useState([]);
  const hotExportTableRef = useRef(null); // HandsonTable 객체 참조
  const [openExportModal, setOpenExportModal] = useState(false); // 입고 모달 열기/닫기 상태
  const [columnExportSelectionStep, setExportColumnSelectionStep] = useState(0); // 데이터 선택
  const [selectedExportColumns, setSelectedExportColumns] = useState({
    barcode: null,
    name: null,
    quantity: null,
    expiration_date: null,
  });

  // 엑셀로 입고(import)데이터를 받았을 때 이를 변환하는 메서드
  const convertToArrayOfArraysModal = (data) => {
    setModalTableData(data);
    return data;
  };

  // 엑셀로 출고(export)데이터를 받았을 때 이를 변환하는 메서드
  const convertToArrayOfArraysExportModal = (data) => {
    setModalTableExportData(data);
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

  // 엑셀을 통해 출고(export)했을 때의 모든 절차를 밟는 메서드
  const exportExcel = (input) => {
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
      setExportColumns(formattedColumns);
      fileData.splice(0, 1);
      convertToArrayOfArraysExportModal(fileData);
      setOpenExportModal(true); // Open the modal after exporting
      console.log("됨?");
    };
    reader.readAsArrayBuffer(file);
  };

  // 엑셀을 통해 상품 데이터를 다운로드하는 메서드
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
  // 출고 열의 색상을 바꾸는 메서드
  const applyExportColumnColor = (columnIndex, color) => {
    const hotInstance = hotExportTableRef.current.hotInstance;

    hotInstance.batch(() => {
      ModalTableExportData.forEach((row, rowIndex) => {
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

  // 출고 열을 클릭하면 해당하는 열의 색상을 바꾸는 메서드
  const handleExportColumnClick = (event, coords) => {
    if (columnSelectionStep >= 0) {
      const colorMap = ["blue", "green"];
      const columnKeys = ["barcode", "quantity"];
      applyExportColumnColor(coords.col, colorMap[columnExportSelectionStep]);
      setSelectedExportColumns((prevSelected) => ({
        ...prevSelected,
        [columnKeys[columnExportSelectionStep]]: coords.col,
      }));
      setExportColumnSelectionStep(columnExportSelectionStep + 1);
    }
  };

  // 입고 시에, 최종적으로 선택된 칼럼을 DB에 입고 API를 보내는 메서드
  const finalizeSelectionImport = () => {
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

  // 출고 시에, 최종적으로 선택된 칼럼을 DB에 출고 API를 보내는 메서드
  const finalizeSelectionExport = () => {
    // 선택된 열의 데이터를 postData에 담는 과정
    const postData = ModalTableExportData.map((row) => ({
      barcode: row[selectedExportColumns.barcode],
      quantity: row[selectedExportColumns.quantity],
      trackingNumber: "121351203",
      date: "2024-08-02",
    }));

    // 생성된 데이터를 DB에 전송한다.
    exportAPI(postData);

    // 입고 시 발생하는 설정 변경 초기화
    setOpenExportModal(false);
    setExportColumnSelectionStep(0);
    setSelectedExportColumns({
      barcode: null,
      quantity: null,
    });
  };

  // 새로운 엑셀 상품들을 입고시키는 API 메서드
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
        const result = await response.json();
        console.log(result);
      } else {
        console.error("Error posting data");
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  // 새로운 엑셀 상품들을 출고고시키는 API 메서드
  const exportAPI = async (postData) => {
    try {
      // postData에 businessId와 warehouseId를 추가한다.
      const newPostData = {
        warehouseId: 2,
        businessId: 1,
        data: postData,
      };
      console.log(newPostData);
      const response = await fetch(
        "https://i11a508.p.ssafy.io/api/products/export",
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
        const result = await response.json();
        console.log(result);
      } else {
        console.error("Error posting data");
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  // 사장님이 갖고 있는 상품들을 가져오는 API
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
        console.log(apiConnection)
        console.log(products); // 삭제해야 할 console.log (콘솔)

        // Extract only the required columns
        const formattedData = products.map((product) => ({
          hiddenId: product.id,
          name: product.productDetail.name,
          barcode: product.productDetail.barcode,
          quantity: product.quantity,
          locationName: product.locationName || "임시",
          floorLevel: product.floorLevel,
          expirationDate: product.expirationDate || "없음",
        }));

        // Define the columns
        const headers = [
          "식별자",
          "이름",
          "바코드(식별번호)",
          "수량",
          "적재함",
          "단(층)수",
          "유통기한",
        ];

        const formattedColumns = [
          { name: "hiddenId", label: "식별자", options: { display: false } },
          { name: "name", label: "상품명" },
          { name: "barcode", label: "바코드" },
          { name: "quantity", label: "수량" },
          { name: "locationName", label: "적재함" },
          { name: "floorLevel", label: "층수" },
          { name: "expirationDate", label: "유통기한" },
        ];

        // Prepare the data for Handsontable
        const data = formattedData.map((product) => [
          product.hiddenId,
          product.name,
          product.barcode,
          product.quantity,
          product.locationName,
          product.floorLevel,
          product.expirationDate,
        ]);

        setColumns(formattedColumns);
        setTableData(data);
        setEditData(data); // Initialize editData with the current table data
      } else {
        console.error("Error loading rectangles data");
      }
    } catch (error) {
      console.error("Error loading rectangles data:", error);
    }
  };

  const getImportListAPI = async () => {
    try {
      const response = await fetch(
        "https://i11a508.p.ssafy.io/api/products/import?businessId=1",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const apiConnection = await response.json();
        const importList = apiConnection.result;
        //구분을 위한 입고표시
        return importList.map((item) => ({ ...item, type: "입고" }));
      } else {
        console.error("입고 목록을 불러오지 못했습니다.");
      }
    } catch (error) {
      console.error("입고 목록을 불러오지 못했습니다.", error);
    }
  };

  const getExportListAPI = async () => {
    try {
      const response = await fetch(
        "https://i11a508.p.ssafy.io/api/products/export?businessId=1",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const apiConnection = await response.json();
        const exportList = apiConnection.result;
        //구분을 위한 출고 표시
        return exportList.map((item) => ({ ...item, type: "출고" }));
      } else {
        console.error("입고 목록을 불러오지 못했습니다.");
      }
    } catch (error) {
      console.error("입고 목록을 불러오지 못했습니다.", error);
    }
  };

  // Updated getWholeChangesAPI function
  const getWholeChangesAPI = async () => {
    try {
      const [importList, exportList] = await Promise.all([
        getImportListAPI(),
        getExportListAPI(),
      ]);

      // Combine import and export lists
      const combinedData = [...importList, ...exportList];

      // Sort combined data by date (assuming 'date' is the key in both lists)
      const sortedData = combinedData.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      // Define the columns for the combined data
      const combinedColumns = [
        { name: "date", label: "날짜" },
        { name: "type", label: "유형" },
        { name: "barcode", label: "바코드" },
        { name: "name", label: "상품명" },
        { name: "quantity", label: "수량" },
        { name: "locationName", label: "적재함" },
        { name: "floorLevel", label: "층수" },
        { name: "trackingNumber", label: "송장번호" },
      ];

      // Map sorted data to the table format
      const formattedData = sortedData.map((item) => ({
        date: item.date || "2024-08-04",
        type: item.type || (importList.includes(item) ? "입고" : "출고"), // Distinguish import/export
        barcode: item.barcode,
        name: item.name || item.productName, // Assuming name might not be available for export
        quantity: item.quantity,
        locationName: item.locationName || "임시",
        floorLevel: item.floorLevel || "분류 전",
        trackingNumber: item.trackingNumber || "입고 물품",
      }));

      // Set the formatted data to state (or directly render it)
      setTableData(formattedData);
      setColumns(combinedColumns);

      // Store detailed data for later use
      setDetailedData(sortedData);
    } catch (error) {
      console.error("Error fetching changes:", error);
    }
  };

  // New function to show only unique import/export dates
  const showUniqueDates = async () => {
    try {
      const [importList, exportList] = await Promise.all([
        getImportListAPI(),
        getExportListAPI(),
      ]);

      // Combine import and export lists
      const combinedData = [...importList, ...exportList];

      // Extract unique dates and types
      const dateSet = new Set();
      const uniqueDateData = combinedData
        .map((item) => ({
          date: item.date,
          type: item.type,
        }))
        .filter((item) => {
          const key = `${item.date}-${item.type}`;
          if (!dateSet.has(key)) {
            dateSet.add(key);
            return true;
          }
          return false;
        });

      // Define columns for the date/type view
      const dateColumns = [
        { name: "date", label: "날짜" },
        { name: "type", label: "유형" },
      ];

      // Set the formatted data to state
      setTableData(uniqueDateData);
      setColumns(dateColumns);

      // Store all data for future reference
      setDetailedData(combinedData);
    } catch (error) {
      console.error("Error fetching unique dates:", error);
    }
  };

  // Function to handle row click and display details
  const handleRowClick = (rowData) => {
    const [selectedDate, selectedType] = rowData;

    // Filter detailed data for the selected date and type
    const filteredData = detailedData.filter(
      (item) => item.date === selectedDate && item.type === selectedType
    );

    // Define columns for the detailed view
    const detailedColumns = [
      { name: "date", label: "날짜" },
      { name: "type", label: "유형" },
      { name: "barcode", label: "바코드" },
      { name: "name", label: "상품명" },
      { name: "quantity", label: "수량" },
      { name: "locationName", label: "적재함" },
      { name: "floorLevel", label: "층수" },
      { name: "trackingNumber", label: "송장번호" },
    ];

    // Map filtered data to the table format
    const formattedData = filteredData.map((item) => ({
      date: item.date || "2024-08-04",
      type: item.type,
      barcode: item.barcode,
      name: item.name || item.productName,
      quantity: item.quantity,
      locationName: item.locationName || "임시",
      floorLevel: item.floorLevel || "분류 전",
      trackingNumber: item.trackingNumber || "입고 물품",
    }));

    // Update table with detailed data
    setTableData(formattedData);
    setColumns(detailedColumns);
  };

  // 상품 정보를 수정하는 API 호출 메서드
  const productEditAPI = async (productData) => {
    try {
      const response = await fetch(
        `https://i11a508.p.ssafy.io/api/products/${productData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      if (response.ok) {
        console.log("Product updated successfully");
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  // 수정된 상품 정보를 저장하고 이를 API로 반복호출하는 메서드
  const handleSaveEdits = () => {
    const hotInstance = hotTableRef.current.hotInstance;
    const updatedData = hotInstance.getData();

    // Loop through updated data and send PUT request for each product
    updatedData.forEach((row) => {
      const productData = {
        id: row[0], // Ensure IDs are correctly mapped
        name: row[1],
        barcode: row[2],
        quantity: row[3],
        locationName: row[4],
        floorLevel: row[5],
        expirationDate: row[6],
        warehouseId: 2,
      };
      console.log(productData)
      productEditAPI(productData);
    });

    setOpenEditModal(false); // Close modal after saving
  };

  /**
   * UseEffect를 통해 새로고침 때마다 api로 사장님의 재고를 불러옴
   */

  useEffect(() => {
    productGetAPI();
  }, [openModal]);

  // 선택 시에 테이블이 바뀐다.
  const [currentIndex, setCurrentIndex] = useState(0);

  // Separate options for each table view
  const productOptions = {}; // No onRowClick for product list
  const importExportOptions = {
    onRowClick: (rowData) => handleRowClick(rowData), // Handle row click
  };

  // Define the componentsArray with separate options
  const componentsArray = [
    <MUIDataTable
      key="productList"
      title={"상품 목록"}
      data={tableData}
      columns={columns}
      options={productOptions}
    />,
    <MUIDataTable
      key="importExportList"
      title={"입출고 목록"}
      data={tableData}
      columns={columns}
      options={importExportOptions}
    />,
  ];

  const handleNextComponent = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div style={{ marginBottom: "1%", margin: "1%", display: "flex" }}>
      <div
        className="button"
        style={{
          width: "10%",
          borderRight: "1px solid black",
          marginRight: "5px",
        }}
      >
        <Grid item xs={6} md={4}>
          <div>
            <label htmlFor="upload-import">
              <input
                required
                style={{ display: "none" }}
                id="upload-import"
                name="upload-import"
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
                입고하기
              </Fab>
            </label>
          </div>
          <div>
            <label htmlFor="upload-export">
              <input
                required
                style={{ display: "none" }}
                id="upload-export"
                name="upload-export"
                type="file"
                onChange={exportExcel}
              />
              <Fab
                color="primary"
                size="small"
                component="span"
                aria-label="add"
                variant="extended"
              >
                출고하기
              </Fab>
            </label>
          </div>
          <div>
            <Button
              variant="contained"
              color="secondary"
              onClick={downloadExcel}
            >
              다운로드
            </Button>
          </div>

          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenEditModal(true)}
            >
              엑셀로 -수정하기
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleNextComponent(0);
                getWholeChangesAPI();
              }}
            >
              입-출고 내역보기
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleNextComponent(1);
                showUniqueDates();
              }}
            >
              Only See the Im-Export
            </Button>
          </div>
        </Grid>
      </div>
      <div>
        {/* 입고 Modal */}
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
              <Button onClick={finalizeSelectionImport} color="primary">
                네
              </Button>
            )}
            <Button onClick={() => setOpenModal(false)} color="primary">
              닫기
            </Button>
          </DialogActions>
        </Dialog>

        {/* 출고 Modal */}
        <Dialog
          open={openExportModal}
          onClose={() => setOpenExportModal(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            <h1>출고 데이터</h1>
            {columnExportSelectionStep === 0 &&
              "바코드가 있는 열을 선택하세요."}
            {columnExportSelectionStep === 1 && "수량이 있는 열을 선택하세요."}
            {columnExportSelectionStep === 2 &&
              "최종적으로 선택된 데이터를 확인하세요."}
          </DialogTitle>
          <DialogContent>
            {columnExportSelectionStep < 1 && (
              <div>
                <p>데이터가 충분하지 않습니다.</p>
              </div>
            )}
            <HotTable
              height={600}
              ref={hotExportTableRef}
              data={ModalTableExportData}
              colHeaders={exportColumns.map((col) => col.label)}
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
              afterOnCellMouseDown={handleExportColumnClick}
            />
          </DialogContent>
          <DialogActions>
            {columnExportSelectionStep === 2 && (
              <Button onClick={finalizeSelectionExport} color="primary">
                네
              </Button>
            )}
            <Button onClick={() => setOpenExportModal(false)} color="primary">
              닫기
            </Button>
          </DialogActions>
        </Dialog>

        {/* 상품 데이터 수정 Modal */}
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
              data={editData}
              colWidths={[`120vw`, `130vw`, `50`, `100`, `100`, `100`, `100`]}
              colHeaders={columns.map((col) => col.label)}
              dropdownMenu={true}
              hiddenColumns={{
                columns: [0], // Hide the first column (hiddenId) during editing
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
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSaveEdits} color="primary">저장하기</Button>
            <Button onClick={() => setOpenEditModal(false)} color="primary">
              닫기
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <Grid
        item
        xs={12}
        style={{
          width: "100%",
        }}
      >
        {/* 메인 영역 */}
        {componentsArray[currentIndex]}
      </Grid>
    </div>
  );
};

export default MyContainerProduct;
