"use client";
/**
 * 창고 엑셀화 Import
 */
// fundamental importing about React
import React, { useState, useEffect, useRef } from "react";

// Import MUI components
import Fab from "@mui/material/Fab";
import ButtonIn from "@mui/material/Button";
// 모달 페이지를 위한 Import
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

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
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/MyContainerStyle.jsx";

// 창고 상수 설정
const GRID_SIZE = 100;
const GRID_SIZE_SUB_50 = 50;
const GRID_SIZE_SUB_10 = 10;
const CANVAS_SIZE = 1000;

const useStyles = makeStyles(styles);

// --- 창고 관련 끝

// 복합체 시작
const MyContainerNavigation = ({ WHId }) => {
  /**
   * 창고 관련 const 들 모음
   */
  const stageRef = useRef(null);
  const layerRef = useRef(null);

  // 줌 인, 줌 아웃을 위한 Scale
  const [scale, setScale] = useState(1); // 초기 줌 값

  // 사각형을 추가하고 관리하는 State 추가
  const [locations, setLocations] = useState([
    {
      id: "0",
      x: 0,
      y: 0,
      z: 0,
      width: 0,
      height: 0,
      fill: "blue",
      draggable: false,
      order: 0,
      name: "임시",
      type: "임시",
      rotation: 0,
    },
  ]);

  // 마지막으로 클릭한 상자를 추적하는 상태 추가
  const [selectedLocation, setSelectedLocation] = useState(null);
  // 마지막으로 클릭한 상자를 수정하는 폼을 띄우기 위한 상태 추가
  const [selectedLocationTransform, setSelectedLocationTransform] =
    useState(null);
  // 현재 벽 생성 / 일반 커서 를 선택하기 위한 State
  const [currentSetting, setCurrentSetting] = useState("location");
  // 상자의 hover Effect를 위한 상태 추가
  const [hoveredRectId, setHoveredRectId] = useState(null);

  // 앙커를 추가하고 관리하는 State 추가
  const [anchors, setAnchors] = useState([
    {
      id: "0",
      x: 0,
      y: 0,
      radius: 0,
      stroke: "#666",
      fill: "#ddd",
      opacity: 1,
      strokeWidth: 2,
      draggable: false,
    },
  ]);

  // 마우스 포인터에 닿은 앙커를 기록하는 것
  const [hoveredAnchor, setHoveredAnchor] = useState(null);
  // 선택된 층을 알려주는 Method
  const [selectedFloor, setSelectedFloor] = useState(1);

  /**
   * 창고 관련 Const 끝
   */

  // API로 불러온 현재 상품 데이터 목록
  const [tableData, setTableData] = useState([]);

  //모달을 위한 데이터 셋
  const [ModalTableData, setModalTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const hotTableRef = useRef(null);

  const [openModal, setOpenModal] = useState(false);
  const [columnSelectionStep, setColumnSelectionStep] = useState(0);
  const [selectedColumns, setSelectedColumns] = useState({
    barcode: null,
    name: null,
    quantity: null,
    expiry: null,
  });

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
      setOpenModal(true);
    };
    reader.readAsArrayBuffer(file);
  };

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

  // 최종적으로 선택된 칼럼에 해당하는 데이터를 보낸다.
  const finalizeSelection = () => {
    const postData = ModalTableData.map((row) => ({
      barcode: row[selectedColumns.barcode],
      name: row[selectedColumns.name],
      quantity: row[selectedColumns.quantity],
      expiry:
        selectedColumns.expiry !== null ? row[selectedColumns.expiry] : null,
    }));

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
      } else {
        console.error("Error posting data");
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  // State to manage the list of import/export dates
  const [imExportList, setImExportList] = useState([]);
  // State to store the detailed data
  const [detailedData, setDetailedData] = useState([]);
  // State to open the modal when a date is clicked
  const [openDetailModal, setOpenDetailModal] = useState(false);

  // Function to fetch import/export data
  const fetchImExportData = async () => {
    try {
      const importResponse = await fetch(
        "https://i11a508.p.ssafy.io/api/products/import?businessId=1",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const exportResponse = await fetch(
        "https://i11a508.p.ssafy.io/api/products/export?businessId=1",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const importData = await importResponse.json();
      const exportData = await exportResponse.json();

      const imExportData = [
        ...importData.result.map((item) => ({
          date: item.date,
          type: "입고",
          ...item,
        })),
        ...exportData.result.map((item) => ({
          date: item.date,
          type: "출고",
          ...item,
        })),
      ];

      // Extract unique dates
      const uniqueDateSet = new Set(
        imExportData.map((item) => `${item.date}###${item.type}`)
      );
      const uniqueDates = Array.from(uniqueDateSet).map((key) => {
        const [date, type] = key.split("###");
        return { date, type };
      });

      setImExportList(uniqueDates);
      setDetailedData(imExportData);
    } catch (error) {
      console.error("Error fetching import/export data:", error);
    }
  };

  // Fetch import/export data when component mounts
  useEffect(() => {
    fetchImExportData();
  }, []);

  // Handle cell click to show details
  const handleCellClick = (date, type) => {
    const filteredData = detailedData.filter(
      (item) => item.date === date && item.type === type
    );
    setModalTableData(filteredData);
    setOpenDetailModal(true);
  };

  /**
   * Location 함수 영역
   */

  // Add this helper function to clear existing anchors and lines
  const clearAnchorsAndLines = () => {
    anchorsRef.current.forEach(({ start, end, line }) => {
      start.destroy();
      end.destroy();
      line.destroy();
    });
    anchorsRef.current = [];
  };

  // API를 통해 해당하는 창고(번호)의 모든 location(적재함)과 wall(벽)을 가져오는 메서드
  const getWarehouseAPI = async () => {
    try {
      const response = await fetch(
        `https://i11a508.p.ssafy.io/api/warehouses/${WHId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const apiConnection = await response.json();
        const warehouseData = apiConnection.result; // 데이터 추출

        // 받아온 데이터 중 로케이션 데이터 처리
        const locations = warehouseData.locations;
        if (!locations) {
          console.error("Locations data not found");
          return;
        }
        const newLocations = locations.map((location, index) => {
          return {
            id: location.id.toString(),
            x: location.xposition,
            y: location.yposition,
            width: location.xsize || 50,
            height: location.ysize || 50,
            z: 5,
            fill: "blue",
            draggable: true,
            order: index,
            name: location.name || `적재함 ${index}`,
            type: "location",
            rotation: 0,
          };
        });

        // 벽 데이터 처리
        const walls = warehouseData.walls;
        if (!walls) {
          console.error("Walls data not found");
          return;
        }
        clearAnchorsAndLines();
        const existingAnchors = [];
        const newAnchors = [];

        // 이미 존재하는 앙커를 가져오거나 생성하는 메서드 정의
        const getOrCreateAnchor = (id, x, y) => {
          let existingAnchor = findExistingAnchor(existingAnchors, x, y);
          if (!existingAnchor) {
            existingAnchor = buildAnchor(id, x, y);
            existingAnchors.push(existingAnchor);
          }
          return existingAnchor;
        };

        walls.forEach(({ startID, startX, startY, endID, endX, endY }) => {
          const startAnchor = getOrCreateAnchor(startID, startX, startY);
          const endAnchor = getOrCreateAnchor(endID, endX, endY);

          const newLine = new Konva.Line({
            points: [startX, startY, endX, endY],
            stroke: "brown",
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

        setLocations(newLocations);
      } else {
        console.error("Error loading locations data");
      }
    } catch (error) {
      console.error("Error loading locations data:", error);
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
      // Handle more grid lines for finer detail
    }
    return lines;
  };

  // 상대적 위치를 보여주는 Pointer에 대한 수정
  const Pointer = (event) => {
    const { x, y } = event.target.getStage().getPointerPosition();
    var stageAttrs = event.target.getStage().attrs;

    if (!stageAttrs.x) {
      // 드래그 하지 않음
      x = x / stageAttrs.scaleX;
      y = y / stageAttrs.scaleY;
    } else {
      // 드래그해서 새로운 stageAttrs의 x,y가 생김
      x = (x - stageAttrs.x) / stageAttrs.scaleX;
      y = (y - stageAttrs.y) / stageAttrs.scaleY;
    }
    return { x, y };
  };

  // 빈 공간을 클릭했을 때 사각형 선택 해제하는 함수
  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedLocationTransform(null);
    }
  };

  /**
   * 벽 생성 파트
   */

  // 선을 잇는 기능을 넣기 위한 State
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

  // --- 벽의 기준점을 생성하는 메서드 ---
  const buildAnchor = (id, x, y) => {
    const layer = layerRef.current;
    const newAnchor = new Konva.Circle({
      id: id,
      x: Math.round(x),
      y: Math.round(y),
      radius: 20,
      stroke: "#666",
      fill: "#ddd",
      opacity: 0,
      strokeWidth: 2,
      draggable: currentSetting !== "wall",
    });
    layer.add(newAnchor);
    setAnchors((prevAnchors) => [...prevAnchors, newAnchor]);

    newAnchor.on("mouseover", function () {
      document.body.style.cursor = "pointer";
      this.strokeWidth(4);
      this.opacity(1);
      this.moveToTop();
      setHoveredAnchor(this);
    });
    newAnchor.on("mouseout", function () {
      document.body.style.cursor = "default";
      this.strokeWidth(2);
      this.opacity(0);
      this.moveToTop();
      setHoveredAnchor(null);
    });

    newAnchor.on("dragmove", function () {
      updateLinesBetweenAnchors();
      highlightOverlappingAnchors(this);
      this.moveToTop();
    });

    newAnchor.on("dragend", function () {
      mergeAnchors(this);
      this.moveToTop();
    });

    return newAnchor;
  };
  // 벽의 기준점과 다른 기준점 사이의 선을 만드는 함수
  const updateLinesBetweenAnchors = () => {
    anchorsRef.current.forEach(({ line, start, end }) => {
      line.points([start.x(), start.y(), end.x(), end.y()]);
    });
    layerRef.current.batchDraw();
  };

  // 마우스 액션과 무관하게 마우스가 위로 올라가면 Anchor를 강조하는 함수
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

  // 두개의 anchor가 겹쳤는지를 확인하는 매서드
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

  // 두 개의 anchor를 규합하고 선의 관계를 정립하는 메서드
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
    updateLinesBetweenAnchors();
  };

  //실시간 반응을 위해서 currentSetting에 대한 함수 작동을 메서드로 넘기기
  const changeCurrentSetting = (value) => {
    setCurrentSetting(value);

    const newDraggable = value !== "wall";
    anchorsRef.current.forEach(({ start, end }) => {
      start.draggable(newDraggable);
      end.draggable(newDraggable);
    });

    layerRef.current.batchDraw();
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
        const rectangleData = jsonData.filter((row) => row[0] === String(id));
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

    //Event Handler for 'mousedown' Stage 위에 올렸을 때,
    const handleMouseDown = () => {
      if (currentSetting === "wall") {
        // 정확한 위치를 얻어온다.
        const pos = stage.getPointerPosition();
        var stageAttrs = stage.attrs;
        //드래그 없음
        if (!stageAttrs.x) {
          pos.x = pos.x / stageAttrs.scaleX;
          pos.y = pos.y / stageAttrs.scaleY;
        } // 드래그 있음
        else {
          pos.x = (pos.x - stageAttrs.x) / stageAttrs.scaleX;
          pos.y = (pos.y - stageAttrs.y) / stageAttrs.scaleY;
        }

        if (hoveredAnchor !== null) {
          pos.x = hoveredAnchor.attrs.x;
          pos.y = hoveredAnchor.attrs.y;
        } else {
          // 10단위로 변경
          pos.x = Math.round(pos.x / 10) * 10;
          pos.y = Math.round(pos.y / 10) * 10;
        }
        setStartPos(pos);
        const newLine = new Konva.Line({
          stroke: "black",
          strokeWidth: 5,
          listening: false,
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
        var stageAttrs = stage.attrs;
        if (!stageAttrs.x) {
          // 드래그 하지 않음
          pos.x = pos.x / stageAttrs.scaleX;
          pos.y = pos.y / stageAttrs.scaleY;
        } else {
          // 드래그해서 새로운 stageAttrs의 x,y가 생김
          pos.x = (pos.x - stageAttrs.x) / stageAttrs.scaleX;
          pos.y = (pos.y - stageAttrs.y) / stageAttrs.scaleY;
        }

        const points = [startPos.x, startPos.y, pos.x, pos.y];

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
          var stageAttrs = stage.attrs;
          if (!stageAttrs.x) {
            // 드래그 하지 않음
            pos.x = pos.x / stageAttrs.scaleX;
            pos.y = pos.y / stageAttrs.scaleY;
          } else {
            // 드래그해서 새로운 stageAttrs의 x,y가 생김
            pos.x = (pos.x - stageAttrs.x) / stageAttrs.scaleX;
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
          var stageAttrs = stage.attrs;
          if (!stageAttrs.x) {
            // 드래그 하지 않음
            pos.x = pos.x / stageAttrs.scaleX;
            pos.y = pos.y / stageAttrs.scaleY;
          } else {
            // 드래그해서 새로운 stageAttrs의 x,y가 생김
            pos.x = (pos.x - stageAttrs.x) / stageAttrs.scaleX;
            pos.y = (pos.y - stageAttrs.y) / stageAttrs.scaleY;
          }

          // 앙커 위에서 벽을 생성하면 그 앙커를 기준으로 생성하게끔 하는 역할
          if (hoveredAnchor !== null) {
            pos.x = hoveredAnchor.attrs.x;
            pos.y = hoveredAnchor.attrs.y;
          }

          handleAddWall(startPos, pos);

          setLine(null);
          setStartPos(null);
        }
      }
    };

    // 벽을 추가한다.
    const handleAddWall = (start, end) => {
      if (currentSetting === "wall") {
        // 새로운 앙커를 생성하는 메서드
        const getOrCreateAnchor = (x, y) => {
          let existingAnchor = anchorsRef.current.find(
            (anchor) =>
              isSamePosition(anchor.start.x(), anchor.start.y(), x, y) ||
              isSamePosition(anchor.end.x(), anchor.end.y(), x, y)
          );
          if (!existingAnchor) {
            const newId = anchorsRef.current.length
              ? Math.max(
                  ...anchorsRef.current.flatMap(({ start, end }) => [
                    parseInt(start.id(), 10),
                    parseInt(end.id(), 10),
                  ])
                ) + 1
              : 1;
            existingAnchor = buildAnchor(newId, x, y);
          } else {
            existingAnchor = isSamePosition(
              existingAnchor.start.x(),
              existingAnchor.start.y(),
              x,
              y
            )
              ? existingAnchor.start
              : existingAnchor.end;
          }
          return existingAnchor;
        };

        const newAnchorTop = getOrCreateAnchor(start.x, start.y);
        const newAnchorBottom = getOrCreateAnchor(end.x, end.y);

        const newLine = new Konva.Line({
          points: [start.x, start.y, end.x, end.y],
          stroke: "brown",
          strokeWidth: 10,
          lineCap: "round",
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
    if (selectedLocation) {
      fetchRectangleData(selectedLocation.id).then((data) => {
        setRectangleData(data);
      });
    }

    // Clean-up the Function to remove event Listeners
    return () => {
      stage.off("mousedown", handleMouseDown);
      stage.off("mousemove", handleMouseMove);
      stage.off("mouseup", handleMouseUp);
    };
  }, [line, startPos, currentSetting, selectedLocation]);

  //처음에 창고 정보를 불러온다.
  useEffect(() => {
    getWarehouseAPI();
  }, []);
  const [showDetails, setShowDetails] = useState(true); // Default to showing details

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        scaleX={scale}
        scaleY={scale}
        draggable={true}
        ref={stageRef}
        onPointerMove={Pointer}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <Layer ref={layerRef}>
          {generateGridLines()}
          {locations.map((rect, i) => (
            <RectangleTransformer
              key={rect.id}
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              fill={rect.fill}
              shapeProps={rect}
              isSelected={rect.id === selectedLocationTransform}
              onSelect={() => {
                setSelectedLocationTransform(rect.id);
                setSelectedLocation(rect);
                setSelectedFloor(1);
              }}
              onChange={(newAttrs) => {
                const rects = locations.slice();
                rects[i] = newAttrs;
                setLocations(rects);
              }}
            />
          ))}
        </Layer>
      </Stage>
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          padding: "10px",
          border: "1px solid black",
          borderRadius: "10px",
          width: "13%",
          height: "95vh",
          overflowY: "auto",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
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
              출고 업로드
            </Fab>
          </label>
        </div>
        <hr />
        <div style={{ marginBottom: "10px" }}>
          <ButtonIn onClick={() => setShowDetails(true)}>
            Show Details
          </ButtonIn>
          <ButtonIn onClick={() => setShowDetails(false)} style={{ marginLeft: "5px" }}>
            Show Notifications
          </ButtonIn>
        </div>
        {showDetails ? (
          <div>
            <h4>현재 적재함 목록</h4>
            {locations.length !== 0 ? (
              <div>
                <ul
                  style={{
                    height: "100%",
                    overflowY: "auto",
                  }}
                >
                  {locations
                    .filter((locations) => locations.type === "location")
                    .map((locations, index) => (
                      <li key={index}>{locations.id}번</li>
                    ))}
                </ul>
              </div>
            ) : (
              <p>현재 재고함이 없습니다.</p>
            )}
          </div>
        ) : (
          <div className="notification">
            <h3>Im-Export Dates</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {imExportList.map(({ date, type }, index) => (
                <li
                  key={index}
                  onClick={() => handleCellClick(date, type)}
                  style={{
                    cursor: "pointer",
                    padding: "5px",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  {date.slice(0, 10)} / {type}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* Right Sidebar */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "8px",
          border: "2px solid black",
          borderRadius: "10px",
          width: "36%",
          height: "95vh",
          overflowY: "auto",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }}
      >
        {showDetails ? (
          <div>
            <h3>현재 선택된 재고함</h3>
            {selectedLocation ? (
              <div>
                <div
                  id="상자 정보"
                  style={{
                    display: "flex",
                  }}
                >
                  <div
                    id="상자 숫자 정보"
                    style={{
                      width: "45%",
                    }}
                  >
                    <b>ID : {selectedLocation.id}</b>
                    <br />
                    <b>
                      X : {selectedLocation.x} | Y : {selectedLocation.y}
                    </b>
                    <br />
                    <b>Name : {selectedLocation.name}</b>
                    <br />
                    <b>Type : {selectedLocation.type}</b>
                    <br />
                    <b>층수 : {selectedLocation.z}</b>
                  </div>
                  <div
                    id="상자의 z Index를 시각화"
                    style={{
                      marginLeft: "10px",
                      height: "130px",
                      width: "65%",
                      overflowY: "auto",
                      border: "2px solid black",
                      borderRadius: "5px",
                      padding: "5px",
                      display: "flex",
                      flexDirection: "column-reverse",
                    }}
                  >
                    {Array.from({ length: selectedLocation.z }).map(
                      (_, index) => (
                        <ButtonIn
                          key={index + 1}
                          style={{
                            display: "block",
                            width: "90%",
                            height: "30px",
                            backgroundColor:
                              selectedFloor === index + 1 ? "blue" : "white",
                            marginBottom: "5px",
                            borderRadius: "5px",
                            border: "1px solid black",
                            textAlign: "center",
                            lineHeight: "30px",
                            marginLeft: "auto",
                            marginRight: "auto",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            setSelectedFloor(
                              selectedFloor === index + 1 ? null : index + 1
                            )
                          }
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor =
                              selectedFloor === index + 1 ? "blue" : "lightgray";
                            e.target.style.border = "2px solid red";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor =
                              selectedFloor === index + 1 ? "blue" : "white";
                            e.target.style.border = "1px solid black";
                          }}
                        >
                          {index + 1} 층
                        </ButtonIn>
                      )
                    )}
                  </div>
                </div>
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
        ) : (
          <Dialog
            open={openDetailModal}
            onClose={() => setOpenDetailModal(false)}
            maxWidth="lg"
            fullWidth
          >
            <DialogTitle>상세 데이터</DialogTitle>
            <DialogContent>
              {ModalTableData.length > 0 && (
                <HotTable
                  height={600}
                  ref={hotTableRef}
                  data={ModalTableData}
                  colWidths={[100, 100, 100, 100, 100, 100]}
                  colHeaders={[
                    "날짜",
                    "유형",
                    "바코드",
                    "상품명",
                    "수량",
                    "송장번호",
                  ]}
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
                />
              )}
            </DialogContent>
            <DialogActions>
              <ButtonIn onClick={() => setOpenDetailModal(false)} color="primary">
                닫기
              </ButtonIn>
            </DialogActions>
          </Dialog>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "5px",
          borderRadius: "10px",
        }}
      >
        <ButtonIn onClick={handleZoomIn}>Zoom In</ButtonIn>
        <ButtonIn onClick={handleZoomOut}>Zoom Out</ButtonIn>
        <ButtonIn onClick={getWarehouseAPI}>Load From Local</ButtonIn>
      </div>
    </div>
  );
};

export default MyContainerNavigation;

// -----   상자 설정 변경기 영역   ------
const RectangleTransformer = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}) => {
  const shapeRef = useRef();
  const trRef = useRef();
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
            x: Math.max(
              0,
              Math.min(Math.round(e.target.x()), CANVAS_SIZE - e.target.width())
            ), //드래그 종료 후에 반올림한 위치로 이동함.
            y: Math.max(
              0,
              Math.min(
                Math.round(e.target.y()),
                CANVAS_SIZE - e.target.height()
              )
            ),
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
            x: Math.max(
              0,
              Math.min(Math.round(node.x()), CANVAS_SIZE - node.width())
            ), // 변형 후에 반올림한 위치로 이동
            y: Math.max(
              0,
              Math.min(Math.round(node.y()), CANVAS_SIZE - node.height())
            ),
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
