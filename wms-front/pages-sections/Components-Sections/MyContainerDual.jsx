"use client";

/**
 * 창고 엑셀화 Import
 */

// fundamental importing about React
import React, { useState, useEffect, useRef } from "react";

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

/**
 * 창고 시각화 Import
 */

// Library of konva and color
import {
  Stage,
  Layer,
  Rect,
  Text,
  Line,
  Circle,
  Transformer,
} from "react-konva";
import { SketchPicker } from "react-color";
// plugin that creates slider
import Slider from "nouislider";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Radio from "@material-ui/core/Radio";
import Switch from "@material-ui/core/Switch";
// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";
import InventoryIcon from "@mui/icons-material/Inventory";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import ListAltIcon from "@mui/icons-material/ListAlt";
import People from "@material-ui/icons/People";
import Check from "@material-ui/icons/Check";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";
// core components
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Button2 from "/components/CustomButtons/Button.js"; // 기존 버튼과 겹쳐서
import CustomInput from "/components/CustomInput/CustomInput.js";
import CustomLinearProgress from "/components/CustomLinearProgress/CustomLinearProgress.js";
import Paginations from "/components/Pagination/Pagination.js";
import Badge from "/components/Badge/Badge.js";

import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/MyContainerStyle.jsx";
import { Canvas } from "canvas";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";

// 창고 상수 설정

// 상수 설정(그리드, 컨버스 등)
const GRID_SIZE = 100; // 100cm = 1m
const GRID_SIZE_SUB_50 = 50; // 50cm
const GRID_SIZE_SUB_10 = 10; // 10cm
const CANVAS_SIZE = 1000; // 100 = 1000cm = 10m

const useStyles = makeStyles(styles);

// --- 창고 관련 끝

// 복합체 시작

const Complicated = () => {
  /**
   * 창고 관련 const 들 모음
   */
  const classes = useStyles();
  const stageRef = useRef(null); // Create a reference for the stage
  const layerRef = useRef(null); // Create a reference for the layer

  // Initial Setting the container array 초기 세팅
  const initialContainer = Array.from({ length: CANVAS_SIZE }, () =>
    Array.from({ length: CANVAS_SIZE }, () => ({
      type: "empty",
      code: "air",
    }))
  );
  // Container for savinng the info.
  const [container, setContainer] = useState(initialContainer);
  // 사각형을 추가하고 관리하는 State 추가
  const [rectangles, setRectangles] = useState([]);
  // 줌 인, 줌 아웃을 위한 Scale
  const [scale, setScale] = useState(1); // 초기 줌 값
  // 벽 생성 시에 클릭하면 생성되는 시작점, 끝점 스팟
  const [tempSpots, setTempSpots] = useState([]);
  // 상자의 hover Effect를 위한 상태 추가
  const [hoveredRectId, setHoveredRectId] = useState(null);
  // 마지막으로 클릭한 상자를 추적하는 상태 추가
  const [selectedRect, setSelectedRect] = useState(null);
  // 마지막으로 클릭한 상자를 수정하는 폼을 띄우기 위한 상태 추가
  const [selectedRectTransform, setSelectedRectTransform] = useState(null);

  // Tracking the current setting mode
  const [currentSetting, setCurrentSetting] = useState(null); // Track current setting mode
  const [showColorPicker, setShowColorPicker] = useState(false); // Control visibility of the color picker

  // New State for rectangle settings - Default exits, and changable now.
  const [newRectColor, setNewRectColor] = useState("blue");
  const [newRectWidth, setNewRectWidth] = useState(50);
  const [newRectHeight, setNewRectHeight] = useState(50);
  const [newRectName, setNewRectName] = useState("");
  const [newRectType, setNewRectType] = useState(""); // new type for rectangle

  // New State for wall settings(벽 관련 설정)
  const [newWallColor, setNewWallColor] = useState("brown");
  const [newWallWidth, setNewWallWidth] = useState(10);
  const [wallStartPoint, setWallStartPoint] = useState(null);
  const [wallEndPoint, setWallEndPoint] = useState(null);

  const [draggingAnchor, setDraggingAnchor] = useState(null);
  const [hoveredAnchor, setHoveredAnchor] = useState(null);

  // 앙커를 추가하고 관리하는 State 추가
  const [anchors, setAnchors] = useState([]);

  /**
   *
   * 창고 관련 Const 끝
   *
   */

  // API로 불러온 현재 상품 데이터 목록
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

  // Start choosing columns for color change
  const startChoosingColumns = () => {
    setIsChoosingColumn(true);
    columnCounter = 0; // Reset counter when starting a new action
  };

  // 최종적으로 선택된 칼럼에 해당하는 데이터를 보낸다.
  const finalizeSelection = () => {
    console.log("Finalized columns:", selectedColumns);
    // Gather the selected data based on the user's column selections.
    const postData = ModalTableData.map((row) => ({
      barcode: row[selectedColumns.barcode],
      name: row[selectedColumns.name],
      quantity: row[selectedColumns.quantity],
      expiry:
        selectedColumns.expiry !== null ? row[selectedColumns.expiry] : null,
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

  /**
   * UseEffect를 통해 새로고침 때마다 api로 사장님의 재고를 불러옴
   */

  // useEffect(() => {
  //   APIConnectionTest();
  // }, []);

  /**
   *
   * 창고 관련 메서드 추가
   *
   */

  // 컨버스에 있는 사각형들의 정보를 저장한다.
  const handleSave = async () => {
    const rectData = rectangles.map((rect) => ({
      id: rect.id,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      fill: rect.fill,
      type: rect.type,
      name: rect.name,
      rotation: rect.rotation,
    }));
    console.log("Canvas data", rectData);
    console.log("container", container);

    try {
      const response = await fetch("/api/save-map", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rectData),
      });

      if (response.ok) {
        console.log("Map data saved successfully");
      } else {
        console.error("Error saving map data");
      }
    } catch (error) {
      console.error("Error saving map data:", error);
    }
  };
  // Add this helper function to clear existing anchors and lines
  const clearAnchorsAndLines = () => {
    anchorsRef.current.forEach(({ start, end, line }) => {
      start.destroy();
      end.destroy();
      line.destroy();
    });
    anchorsRef.current = [];
  };

  // Load the rectangle data from the local public/map directory
  const loadMapFromLocal = async () => {
    try {
      const response = await fetch("/api/load-map", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const { rectData, anchorData } = await response.json();
        setRectangles(rectData); // 사각형들
        clearAnchorsAndLines(); // Load 전 초기화

        const existingAnchors = [];
        const newAnchors = [];

        const getOrCreateAnchor = (x, y) => {
          let existingAnchor = findExistingAnchor(existingAnchors, x, y);
          if (!existingAnchor) {
            existingAnchor = buildAnchor(x, y);
            existingAnchors.push(existingAnchor);
          }
          return existingAnchor;
        };

        anchorData.forEach(({ startX, startY, endX, endY }) => {
          const startAnchor = getOrCreateAnchor(startX, startY);
          const endAnchor = getOrCreateAnchor(endX, endY);

          const newLine = new Konva.Line({
            points: [startX, startY, endX, endY],
            stroke: "black",
            strokeWidth: 10,
            lineCap: "round",
          });

          newAnchors.push({
            start: startAnchor,
            end: endAnchor,
            line: newLine,
          });
        });

        anchorsRef.current = newAnchors;
        newAnchors.forEach(({ line }) => layerRef.current.add(line));
        layerRef.current.batchDraw();
      } else {
        console.error("Error loading map data");
      }
    } catch (error) {
      console.error("Error loading map data:", error);
    }
  };

  // 줌-인 줌-아웃 기능
  const handleZoomIn = () => {
    setScale(scale * 1.2);
  };
  const handleZoomOut = () => {
    setScale(scale / 1.2);
  };

  // 그리드 라인 생성하는 부분
  const generateGridLines = () => {
    const lines = [];
    // 100cm 그리드
    for (let i = 0; i <= CANVAS_SIZE / GRID_SIZE; i++) {
      const pos = i * GRID_SIZE;
      // Horizontal Lines
      lines.push(
        <Line
          key={`h${i}`}
          points={[0, pos, CANVAS_SIZE, pos]}
          stroke="gray"
          strokeWidth={0.5}
          dash={[15, 15]}
        />
      );
      //Vertical Lines
      lines.push(
        <Line
          key={`v${i}`}
          points={[pos, 0, pos, CANVAS_SIZE]}
          stroke="gray"
          strokeWidth={0.5}
          dash={[15, 15]}
        />
      );
    }
    for (let i = 0; i <= CANVAS_SIZE / GRID_SIZE_SUB_50; i++) {
      const pos = i * GRID_SIZE_SUB_50;
      lines.push(
        <Line
          key={`sub50h${i}`}
          points={[0, pos, CANVAS_SIZE, pos]}
          stroke="lightgray"
          strokeWidth={0.5}
          dash={[10, 10]}
        />
      );
      lines.push(
        <Line
          key={`sub50v${i}`}
          points={[pos, 0, pos, CANVAS_SIZE]}
          stroke="lightgray"
          strokeWidth={0.5}
          dash={[10, 10]}
        />
      );
    }
    for (let i = 0; i <= CANVAS_SIZE / GRID_SIZE_SUB_10; i++) {
      const pos = i * GRID_SIZE_SUB_10;
      lines.push(
        <Line
          key={`sub10h${i}`}
          points={[0, pos, CANVAS_SIZE, pos]}
          stroke="whitesmoke"
          strokeWidth={0.5}
          dash={[5, 5]}
        />
      );
      lines.push(
        <Line
          key={`sub10v${i}`}
          points={[pos, 0, pos, CANVAS_SIZE]}
          stroke="whitesmoke"
          strokeWidth={0.5}
          dash={[5, 5]}
        />
      );
    }
    return lines;
  };

  // 상대적 위치를 보여주는 Pointer에 대한 수정
  const Pointer = (event) => {
    const { x, y } = event.target.getStage().getPointerPosition();
    var stageAttrs = event.target.getStage().attrs;
    x = (x - stageAttrs.x) / stageAttrs.scaleX;
    y = (y - stageAttrs.y) / stageAttrs.scaleY;
    // console.log("출력 : " + Math.round(x) + " : " + Math.round(y));
    return { x, y };
  };

  // 빈 공간을 클릭했을 때 사각형 선택 해제하는 함수
  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedRectTransform(null);
    }
  };

  /**
   * 앙커를 추가하고 불러올 수 있다.
   */

  // 선을 잇는 기능을 넣기 위한 거시기
  const [line, setLine] = useState(null);
  const [startPos, setStartPos] = useState(null);

  // 선을 그리는 함수
  const drawLine = (start, end) => {
    const newLine = new Konva.Line({
      stroke: "black",
      points: [start.x, start.y, end.x, end.y],
      listening: false,
    });
    layerRef.current.add(newLine);
    layerRef.current.batchDraw();
  };

  // --- Build Anchor Function ---
  const buildAnchor = (x, y) => {
    const layer = layerRef.current;
    const newAnchor = new Konva.Circle({
      id: `anchor_${anchors.length}`,
      x: x,
      y: y,
      radius: 20,
      stroke: "#666",
      fill: "#ddd",
      opacity: 0,
      strokeWidth: 2,
      draggable: true,
    });
    layer.add(newAnchor);
    setAnchors((prevAnchors) => [...prevAnchors, newAnchor]);

    newAnchor.on("mouseover", function () {
      document.body.style.cursor = "pointer";
      this.strokeWidth(4);
      this.opacity(1);
      this.moveToTop();
    });
    newAnchor.on("mouseout", function () {
      document.body.style.cursor = "default";
      this.strokeWidth(2);
      this.opacity(0);
      this.moveToTop();
    });

    newAnchor.on("dragmove", function () {
      updateDottedLines();
      highlightOverlappingAnchors(this);
      this.moveToTop();
    });

    newAnchor.on("dragend", function () {
      mergeAnchors(this);
      this.moveToTop();
    });

    return newAnchor;
  };

  //선 구성
  const updateDottedLines = () => {
    anchorsRef.current.forEach(({ line, start, end }) => {
      line.points([start.x(), start.y(), end.x(), end.y()]);
    });
    layerRef.current.batchDraw();
  };

  // 클릭 후에 다른 앙커로 갔을 때 앙커가 빛나
  const highlightOverlappingAnchors = (draggedAnchor) => {
    const stage = stageRef.current;
    stage.find("Circle").forEach((anchor) => {
      if (anchor === draggedAnchor) return;
      if (isOverlapping(draggedAnchor, anchor)) {
        anchor.stroke("#ff0000");
        anchor.opacity(1);
        anchor.moveToTop();
      } else {
        anchor.stroke("#666");
        anchor.opacity(0);
        anchor.moveToTop();
      }
    });
  };

  const isOverlapping = (anchor1, anchor2) => {
    const a1 = anchor1.getClientRect();
    const a2 = anchor2.getClientRect();
    return !(
      a1.x > a2.x + a2.width ||
      a1.x + a1.width < a2.x ||
      a1.y > a2.y + a2.height ||
      a1.y + a1.height < a2.y
    );
  };

  const mergeAnchors = (draggedAnchor) => {
    const stage = stageRef.current;
    const layer = layerRef.current;
    let merged = false;

    stage.find("Circle").forEach((anchor) => {
      if (anchor === draggedAnchor) return;
      if (isOverlapping(draggedAnchor, anchor)) {
        updateAnchorReferences(draggedAnchor, anchor);
        draggedAnchor.destroy(); // Remove the dragged anchor
        layer.batchDraw();
        merged = true;
      }
    });
    if (!merged) {
      draggedAnchor.stroke("#666");
      layer.batchDraw();
    }
  };

  const updateAnchorReferences = (draggedAnchor, anchor) => {
    let count = 0;
    anchorsRef.current.forEach((anchorObj) => {
      if (anchorObj.start === draggedAnchor) anchorObj.start = anchor;
      if (anchorObj.end === draggedAnchor) anchorObj.end = anchor;
      count++;
    });
    console.log(count);
    updateDottedLines();
  };

  //실시간 반응을 위해서 currentSetting에 대한 함수 작동을 메서드로 넘기기
  const changeCurrentSetting = (value) => {
    setCurrentSetting(value);
  };

  const [lineData, setLineData] = useState({
    startX: "",
    startY: "",
    endX: "",
    endY: "",
  });
  const anchorsRef = useRef([]);

  //같은 위치를 찾기위함
  const isSamePosition = (x1, y1, x2, y2) => {
    return (
      Math.round(x1) === Math.round(x2) && Math.round(y1) === Math.round(y2)
    );
  };

  //같은 위치에 존재하는 Anchor를 찾기 위함
  const findExistingAnchor = (anchors, x, y) => {
    return anchors.find((anchor) =>
      isSamePosition(anchor.x(), anchor.y(), x, y)
    );
  };
  /**
   * 선택된 사각형의 데이터를 보여주는 메서드
   */

  // Fetch JSON data for the selected rectangle
  const fetchRectangleData = async (id) => {
    try {
      const response = await fetch("/api/load-json", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const jsonData = await response.json();
        // console.log(jsonData);
        const rectangleData = jsonData.filter((row) => row[0] === String(id));
        // console.log(id);
        // console.log(rectangleData);
        return rectangleData || [];
      } else {
        console.error("Error loading JSON data");
        return [];
      }
    } catch (error) {
      console.error("Error loading JSON data:", error);
      return [];
    }
  };

  // 엑셀기록과 함께 해당하는 상자를 누르면 데이터를 보여주는 함수
  const [rectangleData, setRectangleData] = useState([]);

  /**
   *  useEffect Part for Reactive action
   */

  // 선을 적용하기 위한 UseEffect
  useEffect(() => {
    const stage = stageRef.current;
    const layer = layerRef.current;
    /**
     * 기존에는 세 개의 원을 추가했으나, 우리는 이미 존재하는 우리 객체에 대해 적용
     */

    //Event Handler for 'mousedown' Stage 위에 올렸을 때,
    const handleMouseDown = () => {
      // 정확한 위치를 얻어온다.
      if (currentSetting === "wall") {
        const pos = stage.getPointerPosition();
        var stageAttrs = stage.attrs; // 보정을 위한 거시기

        if (!stageAttrs.x) {
          // 드래그 하지 않음
          pos.x = pos.x / stageAttrs.scaleX; //줌에 따른 따른 위치 스케일링
          pos.y = pos.y / stageAttrs.scaleY;
        } else {
          // 드래그해서 새로운 stageAttrs의 x,y가 생김
          pos.x = (pos.x - stageAttrs.x) / stageAttrs.scaleX; //줌에 따른 따른 위치 스케일링
          pos.y = (pos.y - stageAttrs.y) / stageAttrs.scaleY;
        }
        // 무조건 10 pixel 단위로 반올림하여 시작 위치 보정
        pos.x = Math.round(pos.x / 10) * 10;
        pos.y = Math.round(pos.y / 10) * 10;

        setStartPos(pos); // 선의 시작 위치 기록
        const newLine = new Konva.Line({
          stroke: "black",
          strokeWidth: 5,
          listening: false, // Hit detective 감지 안됨
          points: [pos.x, pos.y, pos.x, pos.y],
        });
        layer.add(newLine);
        setLine(newLine);
      }
    };

    //Event Handler for 'mousemove' stage 위에서 움직일 때,
    const handleMouseMove = () => {
      if (currentSetting === "wall") {
        if (!line) return;
        // 정확한 위치를 얻어온다.
        const pos = stage.getPointerPosition();
        var stageAttrs = stage.attrs; // 보정을 위한 거시기
        if (!stageAttrs.x) {
          // 드래그 하지 않음
          pos.x = pos.x / stageAttrs.scaleX; //줌에 따른 따른 위치 스케일링
          pos.y = pos.y / stageAttrs.scaleY;
        } else {
          // 드래그해서 새로운 stageAttrs의 x,y가 생김
          pos.x = (pos.x - stageAttrs.x) / stageAttrs.scaleX; //줌에 따른 따른 위치 스케일링
          pos.y = (pos.y - stageAttrs.y) / stageAttrs.scaleY;
        }

        const points = [startPos.x, startPos.y, pos.x, pos.y];
        //라인 그리기
        line.points(points);
        layer.batchDraw();
      }
    };

    //Event Handler for 'mouseup' stage 위에서 마우스를 뗄 때,
    const handleMouseUp = (e) => {
      if (currentSetting === "wall") {
        //라인이 없으면 작동 X
        if (!line) return;
        //타겟을 찾으면 라인 생성
        if (e.target.hasName("target")) {
          // 정확한 위치를 얻어온다.
          const pos = stage.getPointerPosition();
          var stageAttrs = stage.attrs; // 보정을 위한 거시기
          if (!stageAttrs.x) {
            // 드래그 하지 않음
            pos.x = pos.x / stageAttrs.scaleX; //줌에 따른 따른 위치 스케일링
            pos.y = pos.y / stageAttrs.scaleY;
          } else {
            // 드래그해서 새로운 stageAttrs의 x,y가 생김
            pos.x = (pos.x - stageAttrs.x) / stageAttrs.scaleX; //줌에 따른 따른 위치 스케일링
            pos.y = (pos.y - stageAttrs.y) / stageAttrs.scaleY;
          }
          drawLine(startPos, pos);
          setLine(null);
          setStartPos(null);
          line.remove();
        } else {
          line.remove();
          layer.draw();
          //벽을 추가하기 위한 메서드
          // 정확한 위치를 얻어온다.
          const pos = stage.getPointerPosition();
          var stageAttrs = stage.attrs; // 보정을 위한 거시기
          if (!stageAttrs.x) {
            // 드래그 하지 않음
            pos.x = pos.x / stageAttrs.scaleX; //줌에 따른 따른 위치 스케일링
            pos.y = pos.y / stageAttrs.scaleY;
          } else {
            // 드래그해서 새로운 stageAttrs의 x,y가 생김
            pos.x = (pos.x - stageAttrs.x) / stageAttrs.scaleX; //줌에 따른 따른 위치 스케일링
            pos.y = (pos.y - stageAttrs.y) / stageAttrs.scaleY;
          }
          handleAddWall(startPos, pos);

          setLine(null);
          setStartPos(null);
        }
      }
    };

    //벽을 추가한다.
    const handleAddWall = (start, end) => {
      /**
       * wall setting 일때만 변경될 수 있도록 설정
       */
      console.log("벽 생성 function에서 현재 세팅은? : " + currentSetting);
      if (currentSetting === "wall") {
        // 벽이 입력되는 end point가 벽의 중심이다.
        const newWall = {
          id: rectangles.length.toString(),
          x: end.x,
          y: end.y,
          width: newWallWidth,
          height: Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2),
          fill: newWallColor,
          draggable: true,
          order: rectangles.length + 1, // 순서대로 번호 인덱싱
          name: `Wall ${rectangles.length + 1}`,
          type: "wall",
          rotation: Math.round(
            Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI) + 90
          ),
        };
        // if (!isOverlapping(newWall)) {
        // setRectangles([...rectangles, newWall]);
        // updateContainer(newWall, "wall", `wall${newWall.id}`);
        // Reset wall points
        setWallStartPoint(null);
        setWallEndPoint(null);
        // Reset settings to default after adding
        setNewWallColor("brown");
        setNewWallWidth(10);
        // } else {
        //   alert("Wall overlaps with another rectangle.");
        //   // Reset wall points
        //   setWallStartPoint(null);
        //   setWallEndPoint(null);
        // }
        const newAnchorTop = buildAnchor(start.x, start.y);
        const newAnchorBottom = buildAnchor(end.x, end.y);

        const newLine = new Konva.Line({
          points: [start.x, start.y, end.x, end.y],
          stroke: "brown",
          strokeWidth: 10,
          lineCap: "round",
          // dash: [10, 10, 0, 10],
          // opacity: 0.3,
        });
        const layer = layerRef.current;
        layer.add(newLine);

        anchorsRef.current.push({
          start: newAnchorTop,
          end: newAnchorBottom,
          line: newLine,
        });
        layer.batchDraw();
      }
    };

    /**
     * 벽 생성 관련 마우스 컨트롤 Mouse
     */
    if (currentSetting === "wall") {
      // Event Listeners 추가하기
      stage.on("mousedown", handleMouseDown);
      stage.on("mousemove", handleMouseMove);
      stage.on("mouseup", handleMouseUp);
    }
    //레이어의 초기 상태 그리기
    layer.draw();

    /**
     * 선택된 사각형의 물품 목록을 보여준다.
     */

    if (selectedRect) {
      fetchRectangleData(selectedRect.id).then((data) => {
        setRectangleData(data);
      });
    }

    // Clean-up the Function to remove event Listeners
    return () => {
      stage.off("mousedown", handleMouseDown);
      stage.off("mousemove", handleMouseMove);
      stage.off("mouseup", handleMouseUp);
    };
  }, [line, startPos, currentSetting, selectedRect]);

  return (
    <div style={{ marginBottom: "1%", margin: "0%" }}>
      <div>
        {/* JSX 주석 */}
        {/** Main 영역 시작 */}
        <main style={{ display: "flex" }}>
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
                    {columnSelectionStep === 2 &&
                      "수량이 있는 열을 선택하세요."}
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

          {/* 현재 창고와 적재함들을 보여주는 Sidebar  */}
          <div
            style={{
              padding: "10px",
              border: "1px solid black",
              borderRadius: "10px",
              width: "13%",
              height: "80vh",
              overflowY: "auto",
            }}
          >
            <h4>현재 창고는 1번 창고입니다.</h4>
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
                  출고 목록 업로드하기
                </Fab>
              </label>
            </div>
            <hr />
            <h4>현재 적재함 목록</h4>
            {rectangles.length !== 0 ? (
              <div>
                <ul
                  style={{
                    height: "100%",
                    overflowY: "auto", // Add this line to make the ul scrollable
                  }}
                >
                  {rectangles
                    .filter((rectangles) => rectangles.type === "location")
                    .map((rectangles, index) => (
                      <li key={index}>{rectangles.id}번</li>
                    ))}
                </ul>
              </div>
            ) : (
              <p>현재 재고함이 없습니다.</p>
            )}
          </div>

          {/* 재고현황을 엑셀로 보여주는 bar */}
          <div
            style={{
              marginLeft: "5px",
              padding: "8px",
              border: "2px solid black",
              borderRadius: "10px",
              width: "36%",
              height: "80vh",
              overflowY: "auto",
            }}
          >
            <h3>현재 선택된 재고함</h3>
            {selectedRect ? (
              <div>
                <b>ID : {selectedRect.id}</b>
                <br />
                <b>
                  X : {selectedRect.x} | Y : {selectedRect.y}
                </b>
                <br />
                <b>Name : {selectedRect.name}</b>
                <br />
                <b>Type : {selectedRect.type}</b>
                <br />
                <b>rotation : {selectedRect.rotation}</b>
                <hr />
                {rectangleData.length > 0 && (
                  <div>
                    <HotTable
                      height={400}
                      ref={hotTableRef}
                      data={rectangleData}
                      colWidths={[35, 110, 140, 35, 20, 20, 20]}
                      colHeaders={columns.map((col) => col.label)}
                      dropdownMenu={true}
                      hiddenColumns={{
                        indicators: true,
                      }}
                      contextMenu={true}
                      multiColumnSorting={true}
                      filters={true}
                      // rowHeaders={true}
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
                )}
              </div>
            ) : (
              <p>재고함이 선택되지 않았습니다.</p>
            )}
          </div>

          {/* Canvas and 알림창 영역 */}
          <div
            style={{
              marginLeft: "5px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "50%",
            }}
          >
            <div
              style={{
                border: "2px solid black",
                borderRadius: 20,
                width: "100%",
                height: "60vh",
                position: "relative",
                overflow: "hidden",
                cursor: currentSetting === "wall" ? "crosshair" : "default",
              }}
              onClick={(e) => {
                if (currentSetting === "wall") {
                  const stage = stageRef.current;
                  const pointerPosition = stage.getPointerPosition();
                  var stageAttrs = stage.attrs;
                  pointerPosition.x =
                    (pointerPosition.x - stageAttrs.x) / stageAttrs.scaleX;
                  pointerPosition.y =
                    (pointerPosition.y - stageAttrs.y) / stageAttrs.scaleY;
                  setTempSpots([...tempSpots, pointerPosition]);
                  if (!wallStartPoint) {
                    setWallStartPoint(pointerPosition);
                  } else {
                    handleAddWall(wallStartPoint, pointerPosition);
                  }
                }
              }}
            >
              <Stage
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                scaleX={scale}
                scaleY={scale}
                draggable={true}
                ref={stageRef}
                onPointerMove={Pointer}
                onMouseDown={checkDeselect}
                onTouchStart={checkDeselect}
              >
                <Layer ref={layerRef}>
                  {generateGridLines()}
                  {rectangles.map((rect, i) => (
                    <RectangleTransformer
                      key={rect.id}
                      x={rect.x}
                      y={rect.y}
                      width={rect.width}
                      height={rect.height}
                      fill={rect.fill}
                      shapeProps={rect}
                      isSelected={rect.id === selectedRectTransform}
                      onSelect={() => {
                        setSelectedRectTransform(rect.id);
                        setSelectedRect(rect);
                      }}
                      onChange={(newAttrs) => {
                        const rects = rectangles.slice();
                        rects[i] = newAttrs;
                        setRectangles(rects);
                      }}
                    />
                  ))}
                  {tempSpots.map((spot, index) => (
                    <Circle
                      key={index}
                      x={spot.x}
                      y={spot.y}
                      radius={5}
                      fill="red"
                    />
                  ))}
                </Layer>
              </Stage>
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <button onClick={handleZoomIn}>Zoom In</button>
                <button onClick={handleZoomOut}>Zoom Out</button>
                <button onClick={handleSave}>Save</button>
                <button onClick={loadMapFromLocal}>Load</button>
              </div>
            </div>
            <div
              style={{
                border: "2px solid black",
                borderRadius: 20,
                width: "100%",
                height: "17vh",
                marginTop: "20px",
              }}
            >
              알림창
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Complicated;

// -----   상자 설정 변경기 영역   ------
// RectangleTransformer 컴포넌트는 각 사각형의 렌더링 및 변형을 처리
// Rectangle 컴포넌트는 각 사각형의 렌더링 및 변형을 처리합니다
const RectangleTransformer = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}) => {
  const shapeRef = useRef(); // 사각형 모양에 대한 참조
  const trRef = useRef(); // 변형 도구에 대한 참조

  // 사각형이 선택되었을 때 변형기를 연결하기 위한 Effect 훅
  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      {/* 사각형 모양 */}
      <Rect
        onClick={onSelect} // 사각형 선택을 위한 클릭 이벤트 처리
        onTap={onSelect} // 터치 디바이스를 위한 탭 이벤트 처리
        ref={shapeRef}
        {...shapeProps}
        draggable // 사각형을 드래그 가능하게 함
        // 드래그 종료 이벤트 -- 사각형 위치 업데이트
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: Math.round(e.target.x()), //드래그 종료 후에 반올림한 위치로 이동함.
            y: Math.round(e.target.y()),
          });
        }}
        // 변형 종료 이벤트 -- 사각형 크기 및 위치 업데이트
        onTransformEnd={(e) => {
          const node = shapeRef.current; // 현재 도형에 대한 정보를 업데이트 받는다.
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: Math.round(node.x()), // 변형 후에 반올림한 위치로 이동
            y: Math.round(node.y()),
            width: Math.max(5, node.width() * scaleX), // 최소 너비 보장
            height: Math.max(5, node.height() * scaleY), // 최소 높이 보장
            rotation: Math.round(node.rotation()), // 반올림한 각도
          });
        }}
      />
      <Text
        text={shapeProps.name}
        x={shapeProps.x}
        y={shapeProps.y}
        width={shapeProps.width}
        height={shapeProps.height}
        fontSize={Math.min(shapeProps.width, shapeProps.height) / 5}
        fontFamily="Arial"
        fill="white"
        align="center"
        verticalAlign="middle"
        listening={false} // 텍스트를 클릭할 수 없도록 비활성화
      />
      {isSelected && (
        // 사각형을 크기 조정 및 회전하는 변형 도구
        <Transformer
          ref={trRef}
          flipEnabled={false} // 뒤집기 비활성화
          boundBoxFunc={(oldBox, newBox) => {
            // 최소 크기로 크기 조정 제한
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};
