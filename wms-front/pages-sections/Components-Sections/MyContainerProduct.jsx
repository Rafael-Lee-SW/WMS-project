import React, { useState, useRef, useEffect } from "react";

// Import MUI components
import Grid from "@mui/material/Grid";
import Fab from "@mui/material/Fab";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";

// 모달 페이지를 위한 Import
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

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
import { HotTable } from "@handsontable/react";
import "pikaday/css/pikaday.css";
import "handsontable/dist/handsontable.full.css";

// Import custom hooks and callbacks
import {
  addClassesToRows,
  alignHeaders,
} from "/components/Test/hooksCallbacks.jsx";

import MUIDataTable, { TableFilterList } from "mui-datatables";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import MoveIcon from "@mui/icons-material/MoveUp";

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
const MyContainerProduct = ({ WHId }) => {
  // 제품 목록 / 입고 / 출고 / 수정하기 / 이동하기에 쓰이는 data Table state
  const [tableData, setTableData] = useState([]);
  // 변동 내역 / 알림함에서 쓰이는 data Table state
  const [notificationTableData, setNotificationTableData] = useState([]);
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

  // 출고 데이터를 받기 위한 State
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

  // 선택된 열을 추적하기 위한 State
  const [selectedRows, setSelectedRows] = useState([]);
  const [openMoveModal, setOpenMoveModal] = useState(false); // State for move modal
  const [moveData, setMoveData] = useState([]); // State to track data for moving products

  // '상품별로 선택 이동하기' 를 위한 State
  const [bulkMoveDetails, setBulkMoveDetails] = useState({
    warehouseId: "",
    locationName: "",
    floorLevel: "",
    quantity: "",
  });

  // 에러 메세지 출력을 위한 State
  const [errors, setErrors] = useState([]);

 // '상품 한번에 이동하기' 를 위한 State
  const [isBulkMove, setIsBulkMove] = useState(true);

  // Input Section을 관리하기 위한 State
  const [showProductInputSection, setShowProductInputSection] = useState(false); // State for showing/hiding product input section
  const [newProductData, setNewProductData] = useState({
    barcode: "",
    name: "",
    quantity: "",
    expirationDate: "",
  });
  const [expectedImportList, setExpectedImportList] = useState([]); // Store expected import list

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

    // Append to expected import list
    setExpectedImportList((prevList) => [...prevList, ...postData]);

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

      console.log(postData);

      //  // 입고 시에 사용되는 데이터 양식
      const ImportArray = postData.map((product) => ({
        name: product.name,
        barcode : product.barcode,
        quantity : parseInt(product.quantity),
        productStorageType : "상온",
        expirationDate : product.expirationDate || null,
        warehouseId: parseInt(WHId),
      }));

      console.log(ImportArray);

      const response = await fetch(
        "https://i11a508.p.ssafy.io/api/products/import",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ImportArray),
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
        warehouseId: WHId,
        businessId: businessData.id,
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

  // 상품 이동 API
  const productMoveAPI = async (moveDetails) => {
    try {
      const response = await fetch(
        `https://i11a508.p.ssafy.io/api/products/move`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(moveDetails),
        }
      );

      if (response.ok) {
        console.log("Product moved successfully");
        const result = await response.json();
        console.log(result);
      } else {
        console.error("Failed to move product");
      }
    } catch (error) {
      console.error("Failed to move product:", error);
    }
  };

  // 사장님이 갖고 있는 상품들을 가져오는 API
  const productGetAPI = async (businessId) => {
    try {
      const response = await fetch(
        `https://i11a508.p.ssafy.io/api/products?businessId=${businessId}`,
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
        console.log(apiConnection);
        console.log(products); // 삭제해야 할 console.log (콘솔)

        // Extract only the required columns
        const formattedData = products.map((product) => ({
          hiddenId: product.id,
          name: product.name,
          barcode: product.barcode,
          quantity: product.quantity,
          locationName: product.locationName || "임시",
          floorLevel: product.floorLevel,
          expirationDate: product.expirationDate || "없음",
          warehouseId: product.warehouseId,
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
          "창고",
        ];

        const formattedColumns = [
          { name: "hiddenId", label: "식별자", options: { display: false } },
          { name: "name", label: "상품명" },
          { name: "barcode", label: "바코드" },
          { name: "quantity", label: "수량" },
          { name: "locationName", label: "적재함" },
          { name: "floorLevel", label: "층수" },
          { name: "expirationDate", label: "유통기한" },
          { name: "warehouseId", label: "창고" },
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
          product.warehouseId,
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

  // 모든 알림(변동내역)을 가져오는 메서드
  const getNotificationsAPI = async (businessId) => {
    try {
      const response = await fetch(
        `https://i11a508.p.ssafy.io/api/products/notification?businessId=${businessId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const apiConnection = await response.json();
        const { productFlowResponseDtos, expirationProductResponseDtos } =
          apiConnection.result;

        // Combine all notifications
        const combinedData = [...productFlowResponseDtos];

        // Sort combined data by date
        const sortedData = combinedData.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        // Set the detailed data state
        setDetailedData(sortedData);

        // Map to formatted data for initial display
        const formattedData = sortedData.map((item) => ({
          date: new Date(item.date).toLocaleDateString(),
          type: item.productFlowType,
          barcode: item.barcode,
          name: item.name,
          quantity: item.quantity,
          locationName: item.currentLocationName,
          floorLevel: item.currentFloorLevel,
          trackingNumber: item.trackingNumber,
        }));

        setNotificationTableData(formattedData);

        setColumns([
          { name: "date", label: "날짜" },
          { name: "type", label: "유형" },
          { name: "barcode", label: "바코드" },
          { name: "name", label: "상품명" },
          { name: "quantity", label: "수량" },
          { name: "locationName", label: "적재함" },
          { name: "floorLevel", label: "층수" },
          { name: "trackingNumber", label: "송장번호" },
        ]);
      } else {
        console.error("Error fetching notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // New function to show only unique import/export dates
  const showUniqueDates = async () => {

    // Group data by date and type
    const groupedData = detailedData.reduce((acc, item) => {
      const dateKey = new Date(item.date).toLocaleDateString();
      const typeKey = item.productFlowType;
      const key = `${dateKey}-${typeKey}`;

      if (!acc[key]) {
        acc[key] = {
          date: dateKey,
          type: typeKey,
          count: 0,
        };
      }

      acc[key].count += 1;
      return acc;
    }, {});

    // Format grouped data for table display
    const formattedData = Object.values(groupedData).map((entry) => ({
      date: entry.date,
      type: entry.type,
      count: entry.count,
    }));

    setNotificationTableData(formattedData);
    setColumns([
      { name: "date", label: "날짜" },
      { name: "type", label: "유형" },
      { name: "count", label: "수량" },
    ]);
  };

  // Function to handle row click and display details
  const handleRowClick = (rowData) => {
    const [selectedDate, selectedType] = rowData;

    // Filter detailed data for the selected date and type
    const filteredData = detailedData.filter(
      (item) =>
        new Date(item.date).toLocaleDateString() === selectedDate &&
        item.productFlowType === selectedType
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
      date: new Date(item.date).toLocaleDateString(),
      type: item.productFlowType,
      barcode: item.barcode,
      name: item.name,
      quantity: item.quantity,
      locationName: item.currentLocationName,
      floorLevel: item.currentFloorLevel,
      trackingNumber: item.trackingNumber,
    }));

    // Update table with detailed data
    setNotificationTableData(formattedData);
    setColumns(detailedColumns);
  };

  // 상품 정보를 수정하는 API 호출 메서드
  const productEditAPI = async (productsArray) => {

    try {
      const response = await fetch(`https://i11a508.p.ssafy.io/api/products`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productsArray),
      });

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

    // 수정을 위한 데이터를 updatedData를 통해 가져온다.
    const productsArray = updatedData.map((row) => ({
      productId: String(row[0]), // Get From HiddenId
      locationName: row[4],
      floorLevel: String(row[5]),
      productRequestDto : {
        name: row[1],
        barcode: String(row[2]),
        quantity: row[3],
        expirationDate: null,
        warehouseId: parseInt(row[7]),
      }
    }));

    // Send the array of products to the API
    productEditAPI(productsArray);

    setOpenEditModal(false); // Close modal after saving
  };

  // Function to open move modal and set selected rows
  const handleMoveButtonClick = () => {
    const selectedData = selectedRows.map((rowIndex) => ({
      productId: tableData[rowIndex][0],
      name: tableData[rowIndex][1],
      barcode: tableData[rowIndex][2],
      quantityNow: tableData[rowIndex][3],
      warehouseIdNow: tableData[rowIndex][7],
      locationNameNow: tableData[rowIndex][4],
      floorLevelNow: tableData[rowIndex][5],
      //옮길 값들
      warehouseId: bulkMoveDetails.warehouseId, // Default to bulk move values
      locationName: bulkMoveDetails.locationName, // Default to bulk move values
      floorLevel: bulkMoveDetails.floorLevel, // Default to bulk move values
      quantity: bulkMoveDetails.quantity, // Default to bulk move values
    }));

    setMoveData(selectedData);
    setOpenMoveModal(true);
  };

  // Function to handle bulk move input change
  const handleBulkInputChange = (field, value) => {
    setBulkMoveDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));

    if (field === "quantity") {
      const minQuantity = Math.min(
        ...selectedRows.map((rowIndex) => tableData[rowIndex][3])
      );

      // Check if entered quantity is greater than the minimum available
      if (parseInt(value) > minQuantity) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          bulkQuantity:
            "일부 상품들의 수량보다 많습니다 : 일부 상품은 모든 상품이 옮겨집니다.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          bulkQuantity: "",
        }));
      }
    }
  };

  // Function to handle change in new location details for detailed move
  const handleNewLocationChange = (index, field, value) => {
    setMoveData((prevMoveData) => {
      const newData = [...prevMoveData];
      const product = newData[index];
      const errors = { ...newData[index].errors };

      if (field === "quantity") {
        if (!Number.isInteger(parseInt(value)) || parseInt(value) < 0) {
          errors.quantity = "잘못된 수량입니다. 유효한 정수를 입력하세요.";
        } else if (parseInt(value) > product.quantityNow) {
          errors.quantity = `수량이 너무 큽니다. 최대 ${product.quantityNow}개 가능합니다.`;
          value = product.quantityNow; // Auto-correct the value
        } else {
          errors.quantity = "";
        }
      }

      product[field] = value;
      product.errors = errors;

      return newData;
    });
  };

  // Function to finalize move in bulk mode
  const handleFinalizeBulkMove = () => {
    const quantity = parseInt(bulkMoveDetails.quantity);
    const moveDetails = selectedRows.map((rowIndex) => {
      const product = tableData[rowIndex];
      return {
        productId: product[0],
        locationName: bulkMoveDetails.locationName,
        floorLevel: bulkMoveDetails.floorLevel,
        warehouseId: parseInt(bulkMoveDetails.warehouseId),
        quantity: Math.min(quantity, product[3]), // Move max available if over
      };
    });

    console.log("Bulk move details:", moveDetails);
    productMoveAPI(moveDetails);
    setOpenMoveModal(false);
  };

  // Function to finalize move in detailed mode
  const handleFinalizeDetailMove = () => {
    const isValid = moveData.every((product) => !product.errors.quantity);
    if (!isValid) return;

    const moveDetails = moveData.map((product) => ({
      productId: product.productId,
      locationName: product.locationName,
      floorLevel: product.floorLevel,
      warehouseId: parseInt(product.warehouseId),
      quantity: parseInt(product.quantity),
    }));

    console.log("Detail move details:", moveDetails);
    productMoveAPI(moveDetails);
    setOpenMoveModal(false);
  };

  // 선택 시에 테이블이 바뀐다.
  const [currentIndex, setCurrentIndex] = useState(0);

  // Separate options for each table view
  const productOptions = {
    selectableRows: "none", // Disable checkboxes by default
    onRowClick: (rowData) => handleRowClick(rowData),
  };

  const moveOptions = {
    selectableRows: "multiple", // Enable checkboxes for moving products
    onRowSelectionChange: (currentRowsSelected, allRowsSelected) => {
      setSelectedRows(allRowsSelected.map((row) => row.dataIndex));
    },
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <div>
        <Tooltip title="Move">
          <IconButton onClick={handleMoveButtonClick}>
            <MoveIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </div>
    ),
  };

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
      key="moveProductList"
      title={"이동 상품 목록"}
      data={tableData}
      columns={columns}
      options={moveOptions}
    />,
    <MUIDataTable
      key="importExportList"
      title={"입출고 목록"}
      data={notificationTableData}
      columns={columns}
      options={importExportOptions}
    />,
  ];

  const handleNextComponent = (index) => {
    setCurrentIndex(index);
  };

  // Handle new product data input change
  const handleNewProductInputChange = (field, value) => {
    setNewProductData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Add new product to expected import list
  const handleAddNewProduct = () => {
    setExpectedImportList((prevList) => [...prevList, newProductData]);
    setNewProductData({
      barcode: "",
      name: "",
      quantity: "",
      expirationDate: "",
    });
  };

  // Finalize import from expected import list
  const handleFinalImport = () => {
    importAPI(expectedImportList);
    setExpectedImportList([]); // Clear the list after import
    setShowProductInputSection(false);
  };

  /**
   * 유저를 부르는 Part
   */

  // 유저 및 비즈니스 정보를 담을 State
  const [userData, setUserData] = useState(null);
  const [businessData, setBusinessData] = useState(null);

  // LocalStorage(로컬 스토레이지)를 바탕으로 비즈니스 정보를 받아온다.
  const fetchBusinessData = async (userId) => {
    try {
      const response = await fetch(
        `https://i11a508.p.ssafy.io/api/users/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        const businessInfo = userData.result.business;
        // Business Data를 추출한다.
        setBusinessData(businessInfo);
        console.log("Business data loaded:", businessInfo);

        //재고 목록과 알림 내역을 불러온다.
        productGetAPI(businessInfo.id);
        getNotificationsAPI(businessInfo.id);
      } else {
        console.error("Error fetching user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  /**
   * UseEffect를 통해 새로고침 때마다 api로 사장님의 재고를 불러옴
   * + 유저정보
   */

  useEffect(() => {
    // Retrieve user data from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
        console.log("User data loaded from localStorage:", parsedUser);

        // Fetch business data using user ID
        fetchBusinessData(parsedUser.id);

      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, [openModal]);

  return (
    <div style={{ marginTop: "3rem", display: "flex" }}>
      <div
        className="sidebar"
        style={{
          width: "220px",
          height: "93vh",
          marginRight: "5px",
          padding: "15px",
          boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleNextComponent(0);
            }}
          >
            제품 목록
          </Button>
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setShowProductInputSection(true);
            }}
          >
            입고하기
          </Button>
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleNextComponent(2)}
          >
            출고하기
          </Button>
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenEditModal(true)}
          >
            수정하기
          </Button>
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleNextComponent(1)}
          >
            이동하기
          </Button>
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              getNotificationsAPI(businessData.id);
              handleNextComponent(2);
            }}
          >
            변동내역
          </Button>
        </div>
        <div>
          <Button variant="contained" color="primary">
            분석
          </Button>
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleNextComponent(2);
              showUniqueDates();
            }}
          >
            알림함
          </Button>
        </div>
      </div>

      {/* 입고하기 Section */}
      {showProductInputSection && (
        <div style={{ display: "flex", width: "100%" }}>
          <div style={{ flex: 1, padding: "1rem" }}>
            <Typography variant="h6">제품 데이터 입력</Typography>
            <TextField
              label="바코드"
              value={newProductData.barcode}
              onChange={(e) =>
                handleNewProductInputChange("barcode", e.target.value)
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="상품명"
              value={newProductData.name}
              onChange={(e) =>
                handleNewProductInputChange("name", e.target.value)
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="수량"
              value={newProductData.quantity}
              onChange={(e) =>
                handleNewProductInputChange("quantity", e.target.value)
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="유통기한"
              value={newProductData.expirationDate}
              onChange={(e) =>
                handleNewProductInputChange("expirationDate", e.target.value)
              }
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddNewProduct}
            >
              제품 추가
            </Button>

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
                style={{ marginTop: "10px" }}
              >
                엑셀로 입고하기
              </Fab>
            </label>

            <Button
              variant="contained"
              color="secondary"
              onClick={handleFinalImport}
              style={{ marginTop: "10px" }}
            >
              Final Import
            </Button>
          </div>

          <div style={{ flex: 1, padding: "1rem" }}>
            <Typography variant="h6">Expected Import List</Typography>
            <ul>
              {expectedImportList.map((product, index) => (
                <li key={index}>
                  {product.name} - {product.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

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
                {columnSelectionStep === 0 && "바코드가 있는 열을 선택하세요."}
                {columnSelectionStep === 1 &&
                  "상품 이름이 있는 열을 선택하세요."}
                {columnSelectionStep === 2 && "수량이 있는 열을 선택하세요."}
              </p>
            </div>
          )}
          {columnSelectionStep === 3 && (
            <div>
              <Button onClick={() => setColumnSelectionStep(4)} color="primary">
                Yes
              </Button>
              <Button onClick={() => setColumnSelectionStep(5)} color="primary">
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
          {columnExportSelectionStep === 0 && "바코드가 있는 열을 선택하세요."}
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
            colWidths={[
              `120vw`,
              `130vw`,
              `130vw`,
              `130vw`,
              `130vw`,
              `130vw`,
              `130vw`,
            ]}
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
          <Button onClick={handleSaveEdits} color="primary">
            저장하기
          </Button>
          <Button onClick={() => setOpenEditModal(false)} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>

      {/* 상품 이동 Modal */}
      <Dialog
        open={openMoveModal}
        onClose={() => setOpenMoveModal(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Move Products to New Location</DialogTitle>
        <DialogContent>
          {isBulkMove ? (
            <>
              <TextField
                label="창고 ID"
                value={bulkMoveDetails.warehouseId}
                onChange={(e) =>
                  handleBulkInputChange("warehouseId", e.target.value)
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="적재함 이름"
                value={bulkMoveDetails.locationName}
                onChange={(e) =>
                  handleBulkInputChange("locationName", e.target.value)
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="층수"
                value={bulkMoveDetails.floorLevel}
                onChange={(e) =>
                  handleBulkInputChange("floorLevel", e.target.value)
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="수량"
                value={bulkMoveDetails.quantity}
                onChange={(e) => handleBulkInputChange("quantity", e.target.value)}
                fullWidth
                margin="normal"
                error={!!errors.bulkQuantity}
                helperText={errors.bulkQuantity}
              />
            </>
          ) : (
            moveData.map((product, index) => (
              <div key={product.productId} style={{ marginBottom: "20px" }}>
                <h3>
                  {product.name} (Barcode: {product.barcode}) - 수량 :{" "}
                  {product.quantityNow}개
                </h3>
                <TextField
                  label="물건이 옮겨질 창고의 ID"
                  value={product.warehouseId}
                  onChange={(e) =>
                    handleNewLocationChange(index, "warehouseId", e.target.value)
                  }
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="물건이 옮겨질 적재함 이름"
                  value={product.locationName}
                  onChange={(e) =>
                    handleNewLocationChange(index, "locationName", e.target.value)
                  }
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="옮겨질 적재함의 층"
                  value={product.floorLevel}
                  onChange={(e) =>
                    handleNewLocationChange(index, "floorLevel", e.target.value)
                  }
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="옮길 수량"
                  value={product.quantity}
                  onChange={(e) =>
                    handleNewLocationChange(index, "quantity", e.target.value)
                  }
                  fullWidth
                  margin="normal"
                  error={!!product.errors.quantity}
                  helperText={product.errors.quantity}
                />
              </div>
            ))
          )}
        </DialogContent>
        <DialogActions>
          {isBulkMove ? (
            <Button onClick={handleFinalizeBulkMove} color="primary">
              Bulk Move
            </Button>
          ) : (
            <Button onClick={handleFinalizeDetailMove} color="primary">
              Detail Move
            </Button>
          )}
          <Button
            onClick={() => setIsBulkMove(!isBulkMove)}
            color="secondary"
          >
            {isBulkMove ? "Switch to Detail Move" : "Switch to Bulk Move"}
          </Button>
          <Button onClick={() => setOpenMoveModal(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <div style={{ width: "85%" }}>
        <Grid item xs={12}>
          {/* 메인 영역 */}
          {componentsArray[currentIndex]}
        </Grid>
      </div>
    </div>
  );
};

export default MyContainerProduct;
