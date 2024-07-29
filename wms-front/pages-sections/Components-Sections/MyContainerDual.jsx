"use client";

/**
 *
 *
 * 창고 엑셀화 Import
 *
 *
 */

// fundamental importing about React
import React, { useState, useEffect, useRef } from "react";

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

/**
 *
 *
 * 창고 시각화 Import
 *
 *
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
   *
   * 창고 관련 const 들 모음
   *
   */
  const classes = useStyles();
  const stageRef = useRef(null); // Create a reference for the stage

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

  /**
   *
   * 창고 관련 Const 끝
   *
   */

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
        const mapData = await response.json();
        setRectangles(mapData);
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

  useEffect(() => {
    if (selectedRect) {

      fetchRectangleData(selectedRect.id).then((data) => {
        setRectangleData(data);
      });
    }
  }, [selectedRect]);

  return (
    <div style={{ marginBottom: "1%", margin: "2%" }}>
      <div>
        {/* JSX 주석 */}
        {/** Main 영역 시작 */}
        <main style={{ display: "flex" }}>
          {/* 현재 창고와 적재함들을 보여주는 Sidebar  */}
          <div
            style={{
              marginLeft: "20px",
              padding: "10px",
              border: "1px solid black",
              borderRadius: "10px",
              width: "15%",
              height: "80vh",
              overflowY: "auto",
            }}
          >
            <h4>현재 창고는 1번 창고입니다.</h4>
            <hr />
            <h4>현재 적재함 목록</h4>
            {rectangles.length !== 0 ? (
              <div>
                <ul>
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
              marginLeft: "20px",
              padding: "10px",
              border: "2px solid black",
              borderRadius: "10px",
              width: "30%",
              height: "80vh",
              overflowY: "auto",
            }}
          >
            <h3>Seleted Rectangle</h3>
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
                {rectangleData.length > 0 && (
                  <div>
                    <HotTable
                      height={400}
                      ref={hotTableRef}
                      data={rectangleData}
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
                )}
              </div>
            ) : (
              <p>No rectangle selected</p>
            )}
          </div>

          {/* Canvas and 알림창 영역 */}
          <div
            style={{
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
                <Layer>
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
