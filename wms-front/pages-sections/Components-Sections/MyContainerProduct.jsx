import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { makeStyles } from '@material-ui/core/styles';
// Import MUI components
import Grid from "@mui/material/Grid";
import Fab from "@mui/material/Fab";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
//시간 보여주기
import { format } from "date-fns";
import dayjs from "dayjs";

// 모달 페이지를 위한 Import
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { FormControlLabel } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";

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

// MUI-DataTable 관련 import
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MUIDataTable from "mui-datatables";
import Chip from "@mui/material/Chip";
import { Tooltip, InputLabel, FormControl } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MoveIcon from "@mui/icons-material/MoveUp";
import PrintIcon from "@mui/icons-material/Print";

// Import Chart.js for analytics
import { Chart, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

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

const useStyles = makeStyles(() => ({
  buttonStyle: {
    backgroundColor: "transparent",
    width: '100px',
    color: '#7D4A1A',
    marginTop: '5px',
    border: '1px solid #7D4A1A',
    height: "45px",
    borderRadius: '4px',
    '&:hover': {
        transform: 'scale(1.05)',
        backgroundColor: '#7D4A1A',
        color: 'white',
      },
    }
}));

// Create the theme with the desired overrides
const muiDatatableTheme = createTheme({
  components: {
    MuiTableBody: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            maxHeight: "400px !important", // Set your desired max height here
          },
        },
      },
    },
    MUIDataTable: {
      styleOverrides: {
        responsiveScroll: {
          maxHeight: "80vh !important", // Set your desired max height here
        },
      },
    },
  },
});

const MyContainerProduct = ({ WHId, businessId, warehouses }) => {
  const router = useRouter();
  const classes = useStyles();

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
    expirationDate: dayjs(), // Initialize with current date
  });
  const [expectedImportList, setExpectedImportList] = useState([]); // Store expected import list

  // Export input section
  const [showProductExportSection, setShowProductExportSection] =
    useState(false); // State for showing/hiding product export section
  const [newExportData, setNewExportData] = useState({
    barcode: "",
    quantity: "",
    trackingNumber: "",
  });
  const [expectedExportList, setExpectedExportList] = useState([]); // Store expected export list

  // Analytics state
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Precomputed data for analytics
  const [quantityByLocationData, setQuantityByLocationData] = useState(null);
  const [flowByDateData, setFlowByDateData] = useState(null);

  // Loading states
  const [loading, setLoading] = useState(true); // Overall loading state
  const [notificationsFetched, setNotificationsFetched] = useState(false);
  const [analyticsFetched, setAnalyticsFetched] = useState(false);

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
      console.log("Export data loaded");
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
    if (columnExportSelectionStep >= 0) {
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
    }));

    // Append to expected export list
    setExpectedExportList((prevList) => [...prevList, ...postData]);

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
        barcode: parseInt(product.barcode),
        quantity: parseInt(product.quantity),
        productStorageType: "상온",
        expirationDate: product.expirationDate || null,
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
        businessId: businessId,
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

        //result-path-창고이름별

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
        productGetAPI(businessId); // 정보가 반영된 테이블을 새로 불러온다.
      } else {
        console.error("Failed to move product");
      }
    } catch (error) {
      console.error("Failed to move product:", error);
    }
  };

  const [productColumns, setProductColumns] = useState([]);

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
        console.log("상품데이터를 성공적으로 불러왔습니다.");
        console.log(products); // 삭제해야 할 console.log (콘솔)

        // Extract only the required columns
        const formattedData = products.map((product) => ({
          hiddenId: product.id,
          name: product.name,
          barcode: product.barcode,
          quantity: product.quantity,
          locationName:
            product.locationName === "00-00" ? "임시" : product.locationName,
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

        setProductColumns(formattedColumns);
        setTableData(data);
        setEditData(data); // 둘을 분리할 필요가 있을까?

        // Precompute quantity by location data
        const locationData = products.reduce((acc, product) => {
          const locationName = product.locationName || "임시";
          acc[locationName] = (acc[locationName] || 0) + product.quantity;
          return acc;
        }, {});

        const locationLabels = Object.keys(locationData);
        const locationDataValues = Object.values(locationData);

        setQuantityByLocationData({
          labels: locationLabels,
          datasets: [
            {
              label: "Total Quantity",
              data: locationDataValues,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
        setLoading(false);
      } else {
        console.error("Error loading rectangles data");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error loading rectangles data:", error);
      setLoading(false);
    }
  };

  const [allChangingTableData, setAllChangingTableData] = useState([]);
  const [allChangingTableColumns, setAllChangingTableColumns] = useState([]);

  // 영어-한글 변환 - 입고-출고-이동
  const translationMap = {
    IMPORT: "입고",
    EXPORT: "출고",
    FLOW: "이동",
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
        const formattedData = sortedData.map((item) => {
          // Determine the content for the 'trackingNumber' field based on 'productFlowType'
          let trackingOrNote = "";
          if (item.productFlowType === "EXPORT") {
            trackingOrNote = item.trackingNumber || "송장없음";
          } else if (item.productFlowType === "IMPORT") {
            trackingOrNote = "입고품목";
          } else if (item.productFlowType === "FLOW") {
            trackingOrNote = "이동품목";
          }

          return {
            date: new Date(item.date).toLocaleDateString(),
            type: translationMap[item.productFlowType] || item.productFlowType, // Translate type
            barcode: item.barcode,
            name: item.name,
            quantity: item.quantity,
            locationName: item.currentLocationName,
            floorLevel: item.currentFloorLevel,
            trackingOrNote, // Use the new variable here
          };
        });

        setAllChangingTableData(formattedData);

        setAllChangingTableColumns([
          { name: "date", label: "날짜" },
          { name: "type", label: "유형" },
          { name: "barcode", label: "바코드" },
          { name: "name", label: "상품명" },
          { name: "quantity", label: "수량" },
          { name: "locationName", label: "적재함" },
          { name: "floorLevel", label: "층수" },
          { name: "trackingOrNote", label: "송장번호/비고" },
        ]);

        // Precompute flow by date data
        const flowData = sortedData.reduce((acc, item) => {
          const dateKey = new Date(item.date).toLocaleDateString();
          if (!acc[dateKey]) {
            acc[dateKey] = { import: 0, export: 0, flow: 0 };
          }
          if (item.productFlowType === "IMPORT") {
            acc[dateKey].import += item.quantity;
          } else if (item.productFlowType === "EXPORT") {
            acc[dateKey].export += item.quantity;
          } else {
            acc[dateKey].flow += item.quantity;
          }
          return acc;
        }, {});

        const flowLabels = Object.keys(flowData);
        const importData = flowLabels.map((label) => flowData[label].import);
        const exportData = flowLabels.map((label) => flowData[label].export);
        const flowDataValues = flowLabels.map((label) => flowData[label].flow);

        setFlowByDateData({
          labels: flowLabels,
          datasets: [
            {
              label: translationMap["IMPORT"],
              data: importData,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: translationMap["EXPORT"],
              data: exportData,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
            {
              label: translationMap["FLOW"],
              data: flowDataValues,
              backgroundColor: "rgba(153, 102, 255, 0.2)",
              borderColor: "rgba(153, 102, 255, 1)",
              borderWidth: 1,
            },
          ],
        });
        setNotificationsFetched(true);
        setAnalyticsFetched(true);
        console.log("알림데이터를 성공적으로 불러왔습니다.");

        /**
         * 알림을 정리하는 부분
         */

        // Group data by date and type
        const groupedData = sortedData.reduce((acc, item) => {
          const dateKey = new Date(item.date).toLocaleDateString();
          const typeKey =
            translationMap[item.productFlowType] || item.productFlowType;
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
        const SameformattedData = Object.values(groupedData).map((entry) => ({
          date: entry.date,
          type: entry.type,
          count: entry.count,
        }));

        setNotificationTableData(SameformattedData);
        setNotificationTableColumns([
          { name: "date", label: "날짜" },
          { name: "type", label: "유형" },
          { name: "count", label: "수량" },
        ]);

        console.log("알림을 성공적으로 정리했습니다.");
      } else {
        console.error("Error fetching notifications");
        setNotificationsFetched(true);
        setAnalyticsFetched(true);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotificationsFetched(true);
      setAnalyticsFetched(true);
    }
  };

  // 변동 내역 / 알림함에서 쓰이는 data Table state
  const [notificationTableColumns, setNotificationTableColumns] = useState([]);
  const [notificationTableData, setNotificationTableData] = useState([]);

  // 알림 상세에 쓰이는 것들
  const [notificationDetailTableColumns, setNotificationDetailTableColumns] =
    useState([]);
  const [notificationDetailTableData, setNotificationDetailTableData] =
    useState([]);

  // 알림함에서 상세 내역을 보기 위해 해당 열을 클릭했을 시에 작동하는 메서드
  const handleRowClick = (rowData) => {
    console.log("클릭되었습니다.");
    const [selectedDate, selectedType] = rowData;

    let transType;
    if (selectedType === "입고") {
      transType = "IMPORT";
    } else if (selectedType === "출고") {
      transType = "EXPORT";
    } else if (selectedType === "이동") {
      transType = "FLOW";
    } else {
      transType = selectedType;
    }

    // Filter detailed data for the selected date and type
    const filteredData = detailedData.filter(
      (item) =>
        new Date(item.date).toLocaleDateString() === selectedDate &&
        item.productFlowType === transType
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
      type: translationMap[item.productFlowType] || item.productFlowType, // Translate type
      barcode: item.barcode,
      name: item.name,
      quantity: item.quantity,
      locationName: item.currentLocationName,
      floorLevel: item.currentFloorLevel,
      trackingNumber: item.trackingNumber,
    }));

    // Update table with detailed data
    setNotificationDetailTableData(formattedData);
    setNotificationDetailTableColumns(detailedColumns);
    setCurrentIndex(4);
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
      locationName: row[4] !== "임시" ? row[4] : "00-00",
      floorLevel: String(row[5]),
      productRequestDto: {
        name: row[1],
        barcode: row[2],
        quantity: row[3],
        expirationDate: row[6] === "없음" ? null : row[6],
        warehouseId: parseInt(row[7]),
      },
    }));

    console.log([productsArray]);

    // Send the array of products to the API
    productEditAPI(productsArray);

    // Use router.replace with shallow routing
    router.replace(
      {
        pathname: `/user/${WHId}`,
        query: { component: "product" },
      },
      undefined,
      { shallow: true }
    );

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

      // Check if the input is not a number
      if (!/^\d*$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          bulkQuantity: "수량은 숫자만 입력 가능합니다.",
        }));
      } else if (parseInt(value) > minQuantity) {
        // Check if entered quantity is greater than the minimum available
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
        // Check if the input is not a number
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

  // options for printing but fail
  const listOptions = {
    fixedHeader: true,
    filterType: "multiselect",
    responsive: "scroll",
    download: true,
    print: false, // Disable default print
    viewColumns: true,
    filter: true,
    selectableRows: "none",
    elevation: 0,
    rowsPerPage: 10,
    pagination: true,
    rowsPerPageOptions: [10, 30, 60, 100, 10000],
    textLabels: { body: { noMatch: "데이터를 불러오는 중입니다." } },

    // Custom toolbar with custom print button
    customToolbar: () => {
      return (
        <Tooltip title="Print">
          <IconButton onClick={() => setPrintModalOpen(true)}>
            <PrintIcon />
          </IconButton>
        </Tooltip>
      );
    },
  };

  // Define the componentsArray with separate options
  const componentsArray = [
    <ThemeProvider theme={muiDatatableTheme}>
      <MUIDataTable
        key="productList"
        title={"상품 목록"}
        data={tableData}
        columns={productColumns}
        options={listOptions}
      />
    </ThemeProvider>,
    <MUIDataTable
      key="moveProductList"
      title={"상품 이동하기"}
      data={tableData}
      columns={productColumns}
      options={moveOptions}
    />,
    <MUIDataTable
      key="notificationList"
      title={"모든 변동 내역"}
      data={allChangingTableData}
      columns={allChangingTableColumns}
    />,
    <MUIDataTable
      key="dateTypeList"
      title={"알림함"}
      data={notificationTableData}
      columns={notificationTableColumns}
      options={importExportOptions}
    />,
    <MUIDataTable
      key="selectedNotificationList"
      title={"알림 상세 내역"}
      data={notificationDetailTableData}
      columns={notificationDetailTableColumns}
    />,
    showAnalytics && (
      <div key="analyticsSection" style={{ padding: "20px" }}>
        <Typography variant="h6">Analytics</Typography>
        <div style={{ marginTop: "20px" }}>
          <Typography variant="subtitle1">
            Total Quantity of Each Location in the Warehouse
          </Typography>
          {quantityByLocationData && <Bar data={quantityByLocationData} />}
        </div>
        <div style={{ marginTop: "40px" }}>
          <Typography variant="subtitle1">
            Total Import, Export, and Flow by Day
          </Typography>
          {flowByDateData && (
            <Bar
              data={flowByDateData}
              options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const total = flowByDateData.datasets.reduce(
                          (sum, dataset) =>
                            sum + dataset.data[context.dataIndex],
                          0
                        );
                        const percentage = (
                          (context.raw / total) *
                          100
                        ).toFixed(2);
                        return `${context.dataset.label}: ${context.raw} (${percentage}%)`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true,
                  },
                },
              }}
            />
          )}
        </div>
      </div>
    ),
  ];

  // 해당하는 Section Table을 보여준다.
  const handleNextComponent = async (index) => {
    if (index === 2 && !notificationsFetched) {
      // Show loading if notifications not yet fetched and user enters '변동내역'
      setLoading(true);
      try {
        await getNotificationsAPI(businessId);
        setNotificationsFetched(true);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
        setCurrentIndex(index);
      }
    } else if ((index === 3 || index === 5) && !analyticsFetched) {
      // Show loading if analytics not yet fetched and user enters '알림함' or '분석'
      setLoading(true);
      try {
        await getNotificationsAPI(businessId);
        setAnalyticsFetched(true);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
        setCurrentIndex(index);
      }
    } else {
      setCurrentIndex(index);
      setShowAnalytics(index === 5);
    }
  };

  // Handle new product data input change
  const handleNewProductInputChange = (field, value) => {
    setNewProductData((prevData) => ({
      ...prevData,
      [field]: field === "expirationDate" ? dayjs(value) : value,
    }));
  };

  // Add new product to expected import list
  const handleAddNewProduct = () => {
    let formattedDate = null;
    let formattedDisplayDate = null;
  
    if (newProductData.expirationDate && dayjs(newProductData.expirationDate).isValid()) {
      formattedDate = format(
        new Date(newProductData.expirationDate),
        "yyyy-MM-dd'T'HH:mm"
      );
  
      formattedDisplayDate = format(
        new Date(newProductData.expirationDate),
        "yyyy년 M월 d일 HH시 mm분"
      );
    }
  
    const productData = {
      ...newProductData,
      expirationDate: formattedDate,
      expirationDateDisplay: formattedDisplayDate, // For display purposes
    };
  
    setExpectedImportList((prevList) => [...prevList, productData]);
    setNewProductData({
      barcode: "",
      name: "",
      quantity: "",
      expirationDate: dayjs(), // Reset to current date
    });
  };
  
  // Delete product from expected import list
  const handleDeleteImportProduct = (index) => {
    setExpectedImportList((prevList) => prevList.filter((_, i) => i !== index));
  };

  // Finalize import from expected import list
  const handleFinalImport = () => {
    importAPI(expectedImportList);
    setExpectedImportList([]); // Clear the list after import
    setShowProductInputSection(false);
  };

  // Handle new export data input change
  const handleNewExportInputChange = (field, value) => {
    setNewExportData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Add new export to expected export list
  const handleAddNewExport = () => {
    setExpectedExportList((prevList) => [...prevList, newExportData]);
    setNewExportData({
      barcode: "",
      quantity: "",
      trackingNumber: "",
    });
  };

  // Delete export from expected export list
  const handleDeleteExportProduct = (index) => {
    setExpectedExportList((prevList) => prevList.filter((_, i) => i !== index));
  };

  // Finalize export from expected export list
  const handleFinalExport = () => {
    exportAPI(expectedExportList);
    setExpectedExportList([]); // Clear the list after export
    setShowProductExportSection(false);
  };

  // 압축하기
  const handleEncapsulation = () => {

    EncapsuleAPI();

  };

   // 새로운 엑셀 상품들을 출고고시키는 API 메서드
   const EncapsuleAPI = async () => {
    try {
      const response = await fetch(
        `https://i11a508.p.ssafy.io/api/products/compress?businessId=${businessId}&warehouseId=${WHId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
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

  /**
   * UseEffect를 통해 새로고침 때마다 api로 사장님의 재고를 불러옴
   * + 유저정보
   */

  useEffect(() => {
    //재고 목록과 알림 내역을 불러온다.

    console.log(warehouses);
    productGetAPI(businessId);
  }, [openModal]);

  // Printing logic
  const [printModalOpen, setPrintModalOpen] = useState(false);

  const PrintableTable = ({ columns, data }) => (
    <div style={{ padding: "20px" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                  backgroundColor: "#f2f2f2",
                }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Effect to trigger print on modal open
  useEffect(() => {
    if (printModalOpen) {
      const timer = setTimeout(() => {
        window.print();
        setPrintModalOpen(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [printModalOpen]);

  /**
   * 상품 이동 시에 토글로 제약
   */

  // 창고를 선택할 수 있다.
  const handleWarehouseSelectChange = (field, value, index = null) => {
    if (isBulkMove) {
      setBulkMoveDetails((prevDetails) => ({
        ...prevDetails,
        [field]: value,
        locationName: "",
        floorLevel: "", // Reset location and floor level when warehouse changes
      }));
      setFloorLevels([]); // Clear floor levels
      getWarehouseAPI(value); // Fetch locations for the selected warehouse
    } else {
      setMoveData((prevMoveData) => {
        const newData = [...prevMoveData];
        newData[index][field] = value;
        newData[index].locationName = "";
        newData[index].floorLevel = ""; // Reset location and floor level
        return newData;
      });
      setFloorLevels([]); // Clear floor levels
      getWarehouseAPI(value); // Fetch locations for the selected warehouse
    }
  };

  //선택된 창고를 바탕으로 로케이션과 층수를 선택한다.
  const [locations, setLocations] = useState([]);
  const [floorLevels, setFloorLevels] = useState([]);

  // API call to fetch locations for a specific warehouse
  const getWarehouseAPI = async (warehouseId) => {
    try {
      const response = await fetch(
        `https://i11a508.p.ssafy.io/api/warehouses/${warehouseId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const apiConnection = await response.json();
        const warehouseData = apiConnection.result; // Extract data

        console.log(warehouseData);

        // Process location data from the API response
        const locations = warehouseData.locations;
        if (!locations) {
          console.error("Locations data not found");
          return;
        }
        const newLocations = locations.map((location, index) => {
          // Calculate the red and blue components based on the fill value
          const red = Math.round((location.fill / 100) * 255); // Increase from 0 to 255
          const blue = Math.round(((100 - location.fill) / 100) * 255); // Decrease from 255 to 0

          return {
            id: location.id.toString(),
            x: location.xposition,
            y: location.yposition,
            width: location.xsize || 50,
            height: location.ysize || 50,
            z: location.zsize,
            fill: `rgba(${red}, 0, ${blue}, 1)`, // Calculate RGB with alpha as 1

            order: index,
            name: location.name || `적재함 ${index}`,
            type: "location",
            rotation: 0,
          };
        });

        setLocations(newLocations);
      } else {
        console.error("Error loading rectangles data");
      }
    } catch (error) {
      console.error("Error loading rectangles data:", error);
    }
  };
  const handleLocationSelectChange = (field, value, index = null) => {
    if (isBulkMove) {
      setBulkMoveDetails((prevDetails) => ({
        ...prevDetails,
        [field]: value,
        floorLevel: "", // Reset floor level when location changes
      }));
      // Find the location to get available floor levels
      const selectedLocation = locations.find(
        (location) => location.name === value
      );
      if (selectedLocation) {
        const newFloorLevels = Array.from(
          { length: selectedLocation.z },
          (_, i) => i + 1
        );
        setFloorLevels(newFloorLevels);
      }
    } else {
      setMoveData((prevMoveData) => {
        const newData = [...prevMoveData];
        newData[index][field] = value;
        newData[index].floorLevel = ""; // Reset floor level
        const selectedLocation = locations.find(
          (location) => location.name === value
        );
        if (selectedLocation) {
          const newFloorLevels = Array.from(
            { length: selectedLocation.z },
            (_, i) => i + 1
          );
          setFloorLevels(newFloorLevels);
        }
        return newData;
      });
    }
  };

  const [noExpirationDate, setNoExpirationDate] = useState(false);

  const toggleNoExpirationDate = () => {
    setNoExpirationDate(!noExpirationDate);
    handleNewProductInputChange(
      "expirationDate",
      noExpirationDate ? dayjs() : null
    );
  };

  const isBulkMoveEnabled =
    bulkMoveDetails.warehouseId &&
    bulkMoveDetails.locationName &&
    bulkMoveDetails.floorLevel &&
    bulkMoveDetails.quantity;

  return (
    <div style={{ marginTop: "3rem", display: "flex" }}>
      <div
        className="leftsidebar"
        style={{
          position: "absolute",
          width: "200px",
          height: "80vh",
          marginRight: "5px",
          padding: "15px",
          boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#f7f7f7", // Soft background color
          borderRadius: "8px", // Rounded corners
          top: "10vh", // Slight padding from the top of the viewport
          left: "90px", // Align it to the left of the viewport
          overflowY: "auto", // Enable scrolling for overflow content
          zIndex: 1000, // Ensure it stays above other content
        }}
      >
        <div style={{ marginBottom: "10px", marginTop: "10vh", textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={() => {
              handleNextComponent(0);
              setShowProductInputSection(false);
              setShowProductExportSection(false);
            }}
            style={{ width: "70%", backgroundColor:'transparent', color: '#7D4A1A', outline: '1px solid #7D4A1A' }} // Button width matches the sidebar
          >
            제품 목록
          </Button>
        </div>
        <div style={{ marginBottom: "10px", textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={() => {
              setShowProductInputSection(true);
              setShowProductExportSection(false);
              handleNextComponent(6); // Close other sections
            }}
            style={{ width: "70%", backgroundColor:'transparent', color: '#7D4A1A', outline: '1px solid #7D4A1A' }}
          >
            입고하기
          </Button>
        </div>
        <div style={{ marginBottom: "10px", textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={() => {
              setShowProductInputSection(false);
              setShowProductExportSection(true);
              handleNextComponent(6); // Close other sections
            }}
            style={{ width: "70%", backgroundColor:'transparent', color: '#7D4A1A', outline: '1px solid #7D4A1A' }}
          >
            출고하기
          </Button>
        </div>
        <div style={{ marginBottom: "10px", textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={() => {
              setShowProductInputSection(false);
              setShowProductExportSection(false);
              setOpenEditModal(true);
              handleNextComponent(0);
            }}
            style={{ width: "70%", backgroundColor:'transparent', color: '#7D4A1A', outline: '1px solid #7D4A1A' }}
          >
            수정하기
          </Button>
        </div>
        <div style={{ marginBottom: "10px", textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={() => {
              handleNextComponent(1);
              setShowProductInputSection(false);
              setShowProductExportSection(false);
            }}
            style={{ width: "70%", backgroundColor:'transparent', color: '#7D4A1A', outline: '1px solid #7D4A1A' }}
          >
            이동하기
          </Button>
        </div>
        <div style={{ marginBottom: "10px", textAlign: 'center'}}>
          <Button
            variant="contained"
            onClick={() => {
              handleNextComponent(2);
              setShowProductInputSection(false);
              setShowProductExportSection(false);
            }}
            style={{ width: "70%", backgroundColor:'transparent', color: '#7D4A1A', outline: '1px solid #7D4A1A' }}
          >
            변동내역
          </Button>
        </div>
        <div style={{ marginBottom: "10px", textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={() => {
              handleNextComponent(5);
              setShowProductInputSection(false);
              setShowProductExportSection(false);
            }}
            style={{ width: "70%", backgroundColor:'transparent', color: '#7D4A1A', outline: '1px solid #7D4A1A' }}
          >
            분석
          </Button>
        </div>
        <div style={{ marginBottom: "10px", textAlign: 'center'}}>
          <Button
            variant="contained"
            onClick={() => {
              handleNextComponent(3);
              setShowProductInputSection(false);
              setShowProductExportSection(false);
            }}
            style={{ width: "70%", backgroundColor:'transparent', color: '#7D4A1A', outline: '1px solid #7D4A1A' }}
          >
            알림함
          </Button>
        </div>
        <div style={{ textAlign: 'center'}}>
          <Button
            variant="contained"
            onClick={() => {
              handleEncapsulation();
            }}
            style={{ width: "70%", backgroundColor:'transparent', color: '#7D4A1A', outline: '1px solid #7D4A1A' }}
          >
            압축하기
          </Button>
        </div>
      </div>
      {/* 모달들 */}
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
            colHeaders={productColumns.map((col) => col.label)}
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
              <FormControl fullWidth margin="normal">
                <InputLabel>창고 선택</InputLabel>
                <Select
                  value={bulkMoveDetails.warehouseId}
                  onChange={(e) =>
                    handleWarehouseSelectChange("warehouseId", e.target.value)
                  }
                >
                  <MenuItem value="">
                    <em>선택하세요</em>
                  </MenuItem>
                  {warehouses.map((warehouse) => (
                    <MenuItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                margin="normal"
                disabled={!locations.length}
              >
                <InputLabel>적재함 이름 선택</InputLabel>
                <Select
                  value={bulkMoveDetails.locationName}
                  onChange={(e) =>
                    handleLocationSelectChange("locationName", e.target.value)
                  }
                >
                  <MenuItem value="">
                    <em>선택하세요</em>
                  </MenuItem>
                  {locations.map((location) => (
                    <MenuItem key={location.id} value={location.name}>
                      {location.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                margin="normal"
                disabled={!floorLevels.length}
              >
                <InputLabel>층수 선택</InputLabel>
                <Select
                  value={bulkMoveDetails.floorLevel}
                  onChange={(e) =>
                    handleBulkInputChange("floorLevel", e.target.value)
                  }
                >
                  <MenuItem value="">
                    <em>선택하세요</em>
                  </MenuItem>
                  {floorLevels.map((floor) => (
                    <MenuItem key={floor} value={floor}>
                      {floor}층
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="수량"
                value={bulkMoveDetails.quantity}
                onChange={(e) =>
                  handleBulkInputChange("quantity", e.target.value)
                }
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
                <FormControl fullWidth margin="normal">
                  <InputLabel>물건이 옮겨질 창고 선택</InputLabel>
                  <Select
                    value={product.warehouseId}
                    onChange={(e) =>
                      handleWarehouseSelectChange(
                        "warehouseId",
                        e.target.value,
                        index
                      )
                    }
                  >
                    <MenuItem value="">
                      <em>선택하세요</em>
                    </MenuItem>
                    {warehouses.map((warehouse) => (
                      <MenuItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  fullWidth
                  margin="normal"
                  disabled={!locations.length}
                >
                  <InputLabel>물건이 옮겨질 적재함 이름 선택</InputLabel>
                  <Select
                    value={product.locationName}
                    onChange={(e) =>
                      handleLocationSelectChange(
                        "locationName",
                        e.target.value,
                        index
                      )
                    }
                  >
                    <MenuItem value="">
                      <em>선택하세요</em>
                    </MenuItem>
                    {locations.map((location) => (
                      <MenuItem key={location.id} value={location.name}>
                        {location.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  fullWidth
                  margin="normal"
                  disabled={!floorLevels.length}
                >
                  <InputLabel>옮겨질 적재함의 층 선택</InputLabel>
                  <Select
                    value={product.floorLevel}
                    onChange={(e) =>
                      handleNewLocationChange(
                        index,
                        "floorLevel",
                        e.target.value
                      )
                    }
                  >
                    <MenuItem value="">
                      <em>선택하세요</em>
                    </MenuItem>
                    {floorLevels.map((floor) => (
                      <MenuItem key={floor} value={floor}>
                        {floor}층
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="옮길 수량"
                  type="number"
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
            <Button
              onClick={handleFinalizeBulkMove}
              color="primary"
              disabled={!isBulkMoveEnabled}
            >
              Bulk Move
            </Button>
          ) : (
            <Button
              onClick={handleFinalizeDetailMove}
              color="primary"
              disabled={!moveData.every((product) => product.floorLevel)}
            >
              Detail Move
            </Button>
          )}
          <Button onClick={() => setIsBulkMove(!isBulkMove)} color="secondary">
            {isBulkMove ? "Switch to Detail Move" : "Switch to Bulk Move"}
          </Button>
          <Button onClick={() => setOpenMoveModal(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {/* Print Modal */}
      <Dialog
        open={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        fullScreen
      >
        <DialogContent>
          <PrintableTable columns={productColumns} data={tableData} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPrintModalOpen(false)}
            color="primary"
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <CircularProgress />
        </div>
      )}
      <div
        style={{
          display: "flex",
          width: "100%",
          margin: "0 0 0 200px",
          height: "85vh",
        }}
      >
        {/* 입고하기 Section */}
        {showProductInputSection && (
          <div style={{ width: "100%", marginRight: "20px" }}>
            <div style={{ padding: "1rem" }}>
              <Typography variant="h6" gutterBottom>
                제품 데이터 입력
              </Typography>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px' }}>
                      <TextField
                        label="바코드"
                        value={newProductData.barcode}
                        onChange={(e) =>
                          handleNewProductInputChange("barcode", e.target.value)
                        }
                        fullWidth
                        margin="normal"
                      />
                    </td>
                    <td style={{ padding: "8px" }}>
                      <TextField
                        label="상품명"
                        value={newProductData.name}
                        onChange={(e) =>
                          handleNewProductInputChange("name", e.target.value)
                        }
                        fullWidth
                        margin="normal"
                      />
                    </td>
                    <td style={{ padding: "8px" }}>
                      <TextField
                        label="수량"
                        value={newProductData.quantity}
                        onChange={(e) =>
                          handleNewProductInputChange(
                            "quantity",
                            e.target.value
                          )
                        }
                        fullWidth
                        margin="normal"
                      />
                    </td>
                    <td style={{ paddingTop: '51px'}}>
                      {!noExpirationDate && (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateTimePicker
                            label="유통기한"
                            value={newProductData.expirationDate}
                            onChange={(newValue) =>
                              handleNewProductInputChange(
                                "expirationDate",
                                newValue
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                margin="normal"
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                      <div>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={noExpirationDate}
                              onChange={toggleNoExpirationDate}
                            />
                          }
                          label="유통기한 없음"
                        />
                      </div>
                    </td>
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddNewProduct}
                      >
                        제품 추가
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px" }} colSpan={5}>
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
                          style={{ marginRight: "10px" }}
                        >
                          엑셀로 제품 추가
                        </Fab>
                      </label>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleFinalImport}
                      >
                        입고하기
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              style={{
                width: "100%",
                height: "75vh",
                padding: "1rem",
                overflow: "auto",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <Typography variant="h6">입고 예정 목록</Typography>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        borderBottom: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      이름
                    </th>
                    <th
                      style={{
                        borderBottom: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      바코드
                    </th>
                    <th
                      style={{
                        borderBottom: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      수량
                    </th>
                    <th
                      style={{
                        borderBottom: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      유통기한
                    </th>
                    <th
                      style={{
                        borderBottom: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      비고
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {expectedImportList.map((product, index) => (
                    <tr key={index}>
                      <td style={{ padding: "8px" }}>{product.name}</td>
                      <td style={{ padding: "8px" }}>{product.barcode}</td>
                      <td style={{ padding: "8px" }}>{product.quantity}</td>
                      <td style={{ padding: "8px" }}>
                        {product.expirationDateDisplay}
                      </td>
                      <td style={{ padding: "8px" }}>
                        <IconButton
                          color="secondary"
                          onClick={() => handleDeleteImportProduct(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 출고하기 Section */}
        {showProductExportSection && (
          <div style={{ width: "100%", marginRight: "20px" }}>
            <div style={{ padding: "1rem" }}>
              <Typography variant="h6" gutterBottom>
                출고 데이터 입력
              </Typography>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: '31px' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "8px" }}>
                      <TextField
                        label="바코드"
                        value={newExportData.barcode}
                        onChange={(e) =>
                          handleNewExportInputChange("barcode", e.target.value)
                        }
                        fullWidth
                        margin="normal"
                      />
                    </td>
                    <td style={{ padding: "8px" }}>
                      <TextField
                        label="수량"
                        value={newExportData.quantity}
                        onChange={(e) =>
                          handleNewExportInputChange("quantity", e.target.value)
                        }
                        fullWidth
                        margin="normal"
                      />
                    </td>
                    <td style={{ padding: "8px" }}>
                      <TextField
                        label="송장"
                        value={newExportData.trackingNumber}
                        onChange={(e) =>
                          handleNewExportInputChange(
                            "trackingNumber",
                            e.target.value
                          )
                        }
                        fullWidth
                        margin="normal"
                      />
                    </td>
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <Button
                        variant="contained"
                        onClick={handleAddNewExport}
                        className={classes.buttonStyle}
                      >
                        출고 추가
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px", paddingTop: '30px'}} colSpan={4}>
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
                          style={{ marginRight: "10px" }}
                        >
                          엑셀로 데이터 가져오기
                        </Fab>
                      </label>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleFinalExport}
                      >
                        Final Export
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              style={{
                width: "100%",
                height: "75vh",
                padding: "1rem",
                overflow: "auto",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <Typography variant="h6">Expected Export List</Typography>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        borderBottom: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      바코드
                    </th>
                    <th
                      style={{
                        borderBottom: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      수량
                    </th>
                    <th
                      style={{
                        borderBottom: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      송장번호
                    </th>
                    <th
                      style={{
                        borderBottom: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      비고
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {expectedExportList.map((product, index) => (
                    <tr key={index}>
                      <td style={{ padding: "8px" }}>{product.barcode}</td>
                      <td style={{ padding: "8px" }}>{product.quantity}</td>
                      <td style={{ padding: "8px" }}>
                        {product.trackingNumber}
                      </td>
                      <td style={{ padding: "8px" }}>
                        <IconButton
                          color="secondary"
                          onClick={() => handleDeleteExportProduct(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {!(showProductExportSection || showProductInputSection) && (
          <Grid item xs={12} style={{ width: "100%" }}>
            {/* 메인 영역 */}
            {currentIndex >= 0 && componentsArray[currentIndex]}
          </Grid>
        )}
      </div>
    </div>
  );
};

export default MyContainerProduct;
