//MyContainerMap.jsx
import React, { useState, useEffect, useRef } from "react";
// Library of konva and color Checker
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
// @material-ui/icons
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import SaveIcon from "@mui/icons-material/Save";
// core components
import Button from "/components/CustomButtons/Button.js";
// CSS스타일
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/MyContainerStyle.jsx";
//Material UI 창고 생성 테스트를 위한
import { Typography, Slider, Box, Modal, Fade, TextField } from "@mui/material";

// 상수 설정(그리드, 컨버스 등)
const GRID_SIZE = 100;
const GRID_SIZE_SUB_50 = 50;
const GRID_SIZE_SUB_10 = 10;
const CANVAS_SIZE = 1000;

const useStyles = makeStyles((theme) => ({
  ...styles,
  canvasContainer: {
    position: "relative",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
  },
  leftSidebar: {
    position: "absolute",
    top: "10vh",
    left: 0,
    width: "200px",
    height: "80vh",
    backgroundColor: "rgba(247, 247, 247, 0.9)",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 1100,
    padding: "10px 5px 10px 15px",
    overflowY: "auto",
  },
  rightSidebar: {
    position: "absolute",
    top: "10vh",
    right: 15,
    width: "220px",
    height: "80vh",
    backgroundColor: "rgba(247, 247, 247, 0.9)",
    boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 1100,
    padding: "10px 0",
    overflowY: "auto",
  },
  buttonStyle: {
    marginBottom: "5px",
    padding: "5px",
  },
  outOfCanvas: {
    position: "relative",
    width: "100%",
    height: "100vh",
  },
  inOfCanvas: {
    width: "100%",
    height: "100vh",
    cursor: "default",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxWidth: "500px",
    width: "90%",
  },
}));

/**
 * 창고 관리 Component
 */
const MyContainerMap = ({ warehouseId, businessId }) => {
  const classes = useStyles();
  const stageRef = useRef(null);
  const layerRef = useRef(null);

  // 창고 배열을 저장하기 위한 초기 세팅
  const initialContainer = Array.from({ length: CANVAS_SIZE }, () =>
    Array.from({ length: CANVAS_SIZE }, () => ({
      type: "empty",
      code: "air",
    }))
  );
  // 창고 전체 배열을 저장하기 위한 Container State
  const [container, setContainer] = useState(initialContainer);

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
  // Check if position is within bounds
  const isPositionWithinBounds = (x, y, width, height) => {
    return (
      x >= 0 && y >= 0 && x + width <= CANVAS_SIZE && y + height <= CANVAS_SIZE
    );
  };
  // Function to handle dragging
  const handleDragMove = (e, rect) => {
    const node = e.target;
    const newX = Math.max(Math.min(node.x(), CANVAS_SIZE - rect.width), 0);
    const newY = Math.max(Math.min(node.y(), CANVAS_SIZE - rect.height), 0);

    // Update location only if it's within bounds
    if (isPositionWithinBounds(newX, newY, rect.width, rect.height)) {
      setLocations((prevLocations) =>
        prevLocations.map((loc) =>
          loc.id === rect.id ? { ...loc, x: newX, y: newY } : loc
        )
      );
    }
  };

  // 마지막으로 클릭한 상자를 추적하는 상태 추가
  const [selectedLocation, setSelectedLocation] = useState(null);
  // 마지막으로 클릭한 상자를 수정하는 폼을 띄우기 위한 상태 추가
  const [selectedLocationTransform, setSelectedLocationTransform] =
    useState(null);

  // 현재 벽 생성 / 일반 커서 를 선택하기 위한 State
  const [currentSetting, setCurrentSetting] = useState("location");

  // 새롭게 생성되는 적재함(location)의 속성 설정을 위한 State
  const [newLocationColor, setNewLocationColor] = useState("blue");
  const [newLocationWidth, setNewLocationWidth] = useState(50);
  const [newLocationHeight, setNewLocationHeight] = useState(50);
  const [newLocationZIndex, setNewLocationZIndex] = useState(1);
  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationType, setNewLocationType] = useState(""); // 속성 추가 예정

  // New State for wall settings(벽 관련 설정)
  const [newWallColor, setNewWallColor] = useState("brown");
  const [newWallWidth, setNewWallWidth] = useState(10);

  // 마우스 포인터에 닿은 앙커를 기록하는 것
  const [hoveredAnchor, setHoveredAnchor] = useState(null);

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

  // 우클릭 시 나오는 메뉴를 위한 Ref
  const menuRef = useRef(null);
  const currentShapeRef = useRef(null);

  // 로케이션을 추가하는 메서드
  const handleAddLocation = (type) => {
    const newLocation = {
      id: null,
      x: 50,
      y: 50,
      z: newLocationZIndex,
      width: newLocationWidth,
      height: newLocationHeight,
      fill: newLocationColor,
      draggable: true,
      order: locations.length + 1,
      name:
        newLocationName ||
        `적재함 ${parseInt(locations[locations.length - 1].id) + 1}`,
      type: type,
      rotation: 0,
    };
    setLocations([...locations, newLocation]);
    updateContainer(newLocation, "location", `location${newLocation.id}`);
    //적재함 추가 후 값 초기화
    setNewLocationColor("blue");
    setNewLocationWidth(50);
    setNewLocationHeight(50);
    setNewLocationZIndex(1);
    setNewLocationName("");
  };
  //
  // 창고 배열 저장
  const updateContainer = (location, type, code) => {
    const newContainer = container.map((row, x) =>
      row.map((cell, y) => {
        if (
          x >= location.x &&
          x < location.x + location.width &&
          y >= location.y &&
          y < location.y + location.height
        ) {
          return { type, code };
        }
        return cell;
      })
    );
    setContainer(newContainer);
  };

  // 컨버스 안에 있는 모든 정보를 Local에 저장한다.
  const handleSave = async () => {
    // 적재함들을 전부 기록한다.
    const locationData = locations.map((location) => ({
      id: location.id,
      x: location.x,
      y: location.y,
      z: location.z,
      width: location.width,
      height: location.height,
      fill: location.fill,
      type: location.type,
      name: location.name,
      rotation: location.rotation,
    }));

    // 벽 정보를 전부 기록한다.
    const wallData = anchorsRef.current.map(({ start, end }) => ({
      startID: start.id(),
      startX: start.x(),
      startY: start.y(),
      endID: end.id(),
      endX: end.x(),
      endY: end.y(),
    }));
    try {
      const response = await fetch("/api/save-map", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locationData, wallData }),
      });

      if (response.ok) {
        console.log("창고 정보 저장 성공");
      } else {
        console.error("창고 정보 저장에 Error가 발생했습니다.");
      }
    } catch (error) {
      console.error("에러가 발생했습니다.", error);
    }
  };

  // 수정된정보를 API를 통해 보냄
  const editContainerAPI = async () => {
    const locationData = locations.map((location) => ({
      id: parseInt(location.id),
      name: location.name,
      // fill: location.fill,
      xposition: location.x,
      yposition: location.y,
      xsize: location.width,
      ysize: location.height,
      zsize: location.z,
      rotation: location.rotation,
      storageType: "상온",
    }));

    // 벽 데이터를 기록합니다.
    const wallData = anchorsRef.current.map(({ start, end }, index) => ({
      id: index + 1,
      startX: start.x(),
      startY: start.y(),
      endX: end.x(),
      endY: end.y(),
    }));

    //모든 데이터를 warehouseData로 담아서 전송한다.
    const warehouseData = { locations: locationData, walls: wallData };

    console.log(warehouseData);

    try {
      const response = await fetch(
        `https://i11a508.p.ssafy.io/api/warehouses/${warehouseId}/locatons-and-walls`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(warehouseData),
        }
      );

      if (response.ok) {
        console.log("Map data saved successfully");
      } else {
        console.error("Error saving map data");
      }
    } catch (error) {
      console.error("Error saving map data:", error);
    }
  };

  // 캔버스 내의 모든 벽의 속성(앙커와 선)을 모두 제거하는 메서드
  const clearAnchorsAndLines = () => {
    anchorsRef.current.forEach(({ start, end, line }) => {
      start.destroy();
      end.destroy();
      line.destroy();
    });
    anchorsRef.current = [];
  };

  // local public/map directory 에서 location 정보를 받아오는 메서드
  const loadMapFromLocal = async () => {
    try {
      const response = await fetch("/api/load-map", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const { locationData, wallData } = await response.json();
        setLocations(locationData);
        clearAnchorsAndLines();

        const existingAnchors = [];
        const newAnchors = [];

        // 벽 속성 중 기준점(anchor)을 생성하거나 기존의 anchor를 가져오는 메서드
        const getOrCreateAnchor = (id, x, y) => {
          let existingAnchor = findExistingAnchor(existingAnchors, x, y);
          if (!existingAnchor) {
            existingAnchor = buildAnchor(id, x, y);
            existingAnchors.push(existingAnchor);
          }
          return existingAnchor;
        };

        wallData.forEach(({ startID, startX, startY, endID, endX, endY }) => {
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
      } else {
        const errorData = await response.json();
        console.error("Error saving map data:", errorData);
      }
    } catch (error) {
      console.error("Error loading map data:", error);
    }
  };

  // API를 통해 해당하는 창고(번호)의 모든 location(적재함)과 wall(벽)을 가져오는 메서드
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
        const warehouseData = apiConnection.result; // 데이터 추출

        console.log(warehouseData);

        // 받아온 데이터 중 로케이션 데이터 처리
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
        console.error("Error loading rectangles data");
      }
    } catch (error) {
      console.error("Error loading rectangles data:", error);
    }
  };

  // 줌-인 / 줌-아웃 함수
  const handleZoomIn = () => {
    setScale(scale * 1.2);
  };
  const handleZoomOut = () => {
    setScale(scale / 1.2);
  };

  // 그리드 라인 생성하는 함수
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

  // 커서(cursor)를 정의하기 위한 변수
  let customCursor;
  if (currentSetting === "wall") {
    customCursor = "crosshair";
  } else if (currentSetting === "grab") {
    customCursor = "grab";
  } else {
    customCursor = "default";
  }

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
      radius: 10,
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

  // 로케이션과 벽을 삭제를 하기 위한 메서드
  const handleDelete = () => {
    if (currentShapeRef.current) {
      const shapeId = currentShapeRef.current.attrs.id;

      // Remove the shape from rectangles array
      setLocations((prevRectangles) =>
        prevRectangles.filter((rect) => rect.id !== shapeId)
      );

      // Remove the shape from anchors array if it is an anchor
      const updatedAnchors = anchorsRef.current.filter((anchorObj) => {
        if (
          anchorObj.start.id() === shapeId ||
          anchorObj.end.id() === shapeId
        ) {
          // Destroy the related line
          anchorObj.line.destroy();
          // Destroy the related anchor (start or end) if it matches the shapeId
          if (anchorObj.start.id() === shapeId) {
            anchorObj.start.destroy();
          }
          if (anchorObj.end.id() === shapeId) {
            anchorObj.end.destroy();
          }
          return false;
        }
        return true;
      });
      anchorsRef.current = updatedAnchors;

      // Remove the shape from Konva stage
      currentShapeRef.current.destroy();
      layerRef.current.batchDraw();
    }
  };

  // 우클릭 이후에 버튼에서 바뀌는 스타일
  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = "lightgray";
  };
  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = "white";
  };

  /**
   *  useEffect Part
   */

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

    // 우클릭 시에 메뉴가 나오도록 조정
    const menuNode = menuRef.current;
    document
      .getElementById("delete-button")
      .addEventListener("click", handleDelete);
    //스테이지 적용
    stage.on("contextmenu", function (e) {
      e.evt.preventDefault();
      if (e.target === stage) {
        return;
      }

      currentShapeRef.current = e.target;
      menuNode.style.display = "initial";
      const containerRect = stage.container().getBoundingClientRect();

      menuNode.style.top =
        containerRect.top + stage.getPointerPosition().y - 50 + "px";
      menuNode.style.left =
        containerRect.left + stage.getPointerPosition().x - 5 + "px";
    });

    window.addEventListener("click", () => {
      menuNode.style.display = "none";
    });

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

    // 레이어를 다시 그린다.(세팅이 바뀔 때)
    if (layerRef.current) {
      layerRef.current.batchDraw();
    }

    // Event-Lister들을 정리한다.
    return () => {
      stage.off("mousedown", handleMouseDown);
      stage.off("mousemove", handleMouseMove);
      stage.off("mouseup", handleMouseUp);
    };
  }, [line, startPos, currentSetting, hoveredAnchor]);

  // 최초 한번 실행된다.
  useEffect(() => {
    // 현재 param값을 통해 불러온다.
    getWarehouseAPI(warehouseId);
  }, []);

  /**
   * 창고 자동 생성 로직을 위한 부분
   */

  const [openContainerCreation, setOpenContainerCreation] = useState(false);
  const [formData, setFormData] = useState({
    containerName: "",
    containerXSize: "",
    containerYSize: "",
    locationX: "",
    locationY: "",
    locationZ: "",
    row: "",
    column: "",
  });

  const handleOpen = () => {
    setOpenContainerCreation(true);
  };

  const handleClose = () => {
    setOpenContainerCreation(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Extract values from formData
    const { locationX, locationY, locationZ, row, column } = formData;

    // Calculate fixed spacing between columns and rows
    const columnSpacing = 10; // Fixed spacing of 10px between columns
    const rowSpacing = parseInt(locationY); // Distance between rows equal to the height of each location

    // 위치 자동 생성을 위한 부분
    const newLocations = [];
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        // Format row and column numbers as two-digit strings
        const rowNumber = (i + 1).toString().padStart(2, "0"); // Convert to string and pad with zeros
        const columnNumber = (j + 1).toString().padStart(2, "0"); // Convert to string and pad with zeros

        // Calculate x and y positions with new spacing logic
        const xPosition = j * (parseInt(locationX) + columnSpacing);
        const yPosition = i * (parseInt(locationY) + rowSpacing);

        newLocations.push({
          id: null,
          x: xPosition,
          y: yPosition,
          z: parseInt(locationZ),
          width: Math.round(parseInt(locationX)),
          height: Math.round(parseInt(locationY)),
          fill: "lightblue", // Default fill color
          draggable: true,
          order: newLocations.length + 1,
          name: `${rowNumber}-${columnNumber}`, // Use formatted row and column numbers
          type: "temp",
          rotation: 0,
        });
      }
    }

    // Update locations state
    setLocations((prevLocations) => [...prevLocations, ...newLocations]);

    // Automatically create walls around the generated locations
    generateWalls(newLocations);

    handleClose();
  };

  // 벽 자동생성을 위한 것
  const generateWalls = (generatedLocations) => {
    if (generatedLocations.length === 0) return;

    // Calculate the bounding box for the new locations
    let minX = Number.MAX_VALUE,
      minY = Number.MAX_VALUE,
      maxX = 0,
      maxY = 0;

    generatedLocations.forEach((location) => {
      minX = Math.min(minX, location.x);
      minY = Math.min(minY, location.y);
      maxX = Math.max(maxX, location.x + location.width);
      maxY = Math.max(maxY, location.y + location.height);
    });

    // Create four corner anchors for the perimeter
    const topLeft = buildAnchor(null, minX, minY);
    const topRight = buildAnchor(null, maxX, minY);
    const bottomLeft = buildAnchor(null, minX, maxY);
    const bottomRight = buildAnchor(null, maxX, maxY);

    // Create walls (lines) between the corner anchors
    const newLines = [
      { start: topLeft, end: topRight },
      { start: topRight, end: bottomRight },
      { start: bottomRight, end: bottomLeft },
      { start: bottomLeft, end: topLeft },
    ];

    // Add the lines to the layer
    newLines.forEach(({ start, end }) => {
      const line = new Konva.Line({
        points: [start.x(), start.y(), end.x(), end.y()],
        stroke: newWallColor,
        strokeWidth: newWallWidth,
      });
      layerRef.current.add(line);

      anchorsRef.current.push({ start, end, line });
    });

    layerRef.current.batchDraw();
  };

  // RGB 색깔로 재고율 퍼센트(%)를 추출하는 함수
  const extractFillPercentage = (rgbaString) => {
    const matches = rgbaString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);

    if (matches) {
      const red = parseInt(matches[1], 10);
      // Assuming the fill percentage was encoded in the red component
      return ((red / 255) * 100).toFixed(1);
    }

    return "0.0"; // Default to 0% if unable to parse
  };

  //--- 리턴 Part ---

  return (
    <div className={classes.canvasContainer}>
      {/* Left Sidebar */}
      <div className={classes.leftSidebar}>
        <div>
          <Button
            className={classes.buttonStyle}
            onClick={() => changeCurrentSetting("location")}
            variant="contained"
            color="primary"
          >
            재고함
          </Button>
          <Button
            className={classes.buttonStyle}
            onClick={() => changeCurrentSetting("wall")}
            variant="contained"
            color="primary"
          >
            벽 생성
          </Button>
          <Button
            className={classes.buttonStyle}
            onClick={() => changeCurrentSetting("specialObject")}
            variant="contained"
            color="primary"
          >
            특수 객체
          </Button>
          <Button
            className={classes.buttonStyle}
            onClick={handleOpen}
            variant="contained"
            color="primary"
          >
            자동 생성
          </Button>
        </div>
        <br />
        {currentSetting && currentSetting !== "wall" && (
          <div>
            <Typography variant="h6" gutterBottom>
              {currentSetting === "location" ? "로케이션" : "입구-출구"} 설정
            </Typography>

            <Typography variant="body2" color="textSecondary" gutterBottom>
              단수와 크기를 정하세요
            </Typography>

            <Box mb={2}>
              <Typography gutterBottom>
                단수(층): {newLocationZIndex}단/층
              </Typography>
              <Slider
                value={newLocationZIndex}
                onChange={(e, newValue) => setNewLocationZIndex(newValue)}
                aria-labelledby="z-index-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
              />
            </Box>

            <Box mb={2}>
              <Typography gutterBottom>가로: {newLocationWidth}cm</Typography>
              <Slider
                value={newLocationWidth}
                onChange={(e, newValue) => setNewLocationWidth(newValue)}
                aria-labelledby="width-slider"
                valueLabelDisplay="auto"
                step={10}
                marks
                min={10}
                max={500}
              />
            </Box>

            <Box mb={2}>
              <Typography gutterBottom>세로: {newLocationHeight}cm</Typography>
              <Slider
                value={newLocationHeight}
                onChange={(e, newValue) => setNewLocationHeight(newValue)}
                aria-labelledby="height-slider"
                valueLabelDisplay="auto"
                step={10}
                marks
                min={10}
                max={500}
              />
            </Box>

            <hr />

            <Typography variant="body2" color="textSecondary" gutterBottom>
              이름과 속성을 지정해주세요
            </Typography>

            <Box mb={2}>
              <TextField
                label="Name"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                variant="outlined"
                fullWidth
                size="small"
                margin="dense"
              />
            </Box>

            <Box mb={2}>
              <TextField
                label="속성"
                value={newLocationType} // Fixing the value to refer to the correct state
                onChange={(e) => setNewLocationType(e.target.value)}
                variant="outlined"
                fullWidth
                size="small"
                margin="dense"
              />
            </Box>

            <Button
              onClick={() => handleAddLocation(currentSetting)}
              variant="contained"
              color="primary"
              fullWidth
            >
              생성하기
            </Button>
          </div>
        )}
        {currentSetting === "wall" && (
          <>
            <h3>Set Properties for Wall</h3>
            <div>
              <label>
                Width:
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={newWallWidth}
                  onChange={(e) => setNewWallWidth(Number(e.target.value))}
                />
                {newWallWidth}
              </label>
            </div>
          </>
        )}
      </div>

      {/* Canvas 영역  */}
      <div className={classes.outOfCanvas}>
        <div className={classes.inOfCanvas} style={{ cursor: customCursor }}>
          <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            scaleX={scale}
            scaleY={scale}
            draggable={currentSetting === "wall" ? false : true}
            ref={stageRef}
            onPointerMove={Pointer}
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
            dragBoundFunc={(pos) => {
              // Restrict dragging to within 150% of the CANVAS_SIZE
              const minX = -(CANVAS_SIZE * 0.25);
              const minY = -(CANVAS_SIZE * 0.25);
              const maxX = CANVAS_SIZE * 0.75;
              const maxY = CANVAS_SIZE * 0.75;
              return {
                x: Math.max(minX, Math.min(maxX, pos.x)),
                y: Math.max(minY, Math.min(maxY, pos.y)),
              };
            }}
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
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            display: "flex",
            gap: "10px",
          }}
        >
          <Button justIcon round color="success" onClick={handleZoomIn}>
            <ZoomInIcon className={classes.icons} />
          </Button>
          <Button justIcon round color="primary" onClick={handleZoomOut}>
            <ZoomOutIcon className={classes.icons} />
          </Button>
          <Button justIcon round color="primary" onClick={editContainerAPI}>
            <SaveIcon className={classes.icons} />
          </Button>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className={classes.rightSidebar}>
        <h3>재고함 목록</h3>
        {locations.length !== 0 ? (
          <div
            style={{
              width: "100%",
            }}
          >
            <ul
              style={{
                height: "30vh",
                overflowY: "auto",
                listStyle: "none",
                padding: 0,
              }}
            >
              {locations
                .filter(
                  (locations) =>
                    locations.type === "location" && locations.name !== "00-00"
                )
                .map((locations, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setSelectedLocation(locations);
                      setSelectedLocationTransform(locations.id);
                    }}
                    style={{
                      cursor: "pointer",
                      padding: "5px",
                      borderBottom: "1px solid #ccc",
                      textAlign: "center",
                      backgroundColor:
                        selectedLocation && selectedLocation.id === locations.id
                          ? "#f0f0f0" // Highlight color for selected item
                          : "transparent", // Default color for unselected items
                      transition: "background-color 0.3s", // Smooth transition effect
                    }}
                  >
                    {locations.name}
                  </li>
                ))}
            </ul>
          </div>
        ) : (
          <p>현재 재고함이 없습니다.</p>
        )}
        <hr />
        <h3>선택된 재고함</h3>
        {selectedLocation ? (
          <div>
            <p>이름 : {selectedLocation.name}</p>
            <p>타입 : {selectedLocation.type}</p>
            <p>층수 : {selectedLocation.z}</p>
            <p>
              현재 재고율 : {extractFillPercentage(selectedLocation.fill)}%{" "}
              {/* Extract fill percentage from RGBA */}
            </p>
            <p>
              가로 :{selectedLocation.width}cm | 세로 :{" "}
              {selectedLocation.height}cm
            </p>
          </div>
        ) : (
          <p>재고함이 선택되지 않았습니다.</p>
        )}
      </div>
      <div
        id="menu"
        ref={menuRef}
        style={{
          display: "none",
          position: "absolute",
          width: "60px",
          backgroundColor: "white",
          boxShadow: "0 0 5px grey",
          borderRadius: "3px",
        }}
      >
        <div>
          <button
            id="pulse-button"
            style={{
              width: "100%",
              backgroundColor: "white",
              border: "none",
              margin: 0,
              padding: "10px",
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Pulse
          </button>
          <button
            id="delete-button"
            style={{
              width: "100%",
              backgroundColor: "white",
              border: "none",
              margin: 0,
              padding: "10px",
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Delete
          </button>
        </div>
      </div>

      <Modal
        className={classes.modal}
        open={openContainerCreation}
        onClose={handleClose}
        closeAfterTransition
      >
        <Fade
          in={openContainerCreation}
          style={{
            justifyContent: "center",
          }}
        >
          <div className={classes.paper}>
            <h2>새 창고 정보 입력</h2>
            <form onSubmit={handleSubmit}>
              <TextField
                name="containerName"
                label="창고 이름"
                fullWidth
                variant="outlined"
                className={classes.formControl}
                value={formData.containerName}
                onChange={handleChange}
              />
              <TextField
                name="containerXSize"
                label="창고 가로 크기"
                fullWidth
                variant="outlined"
                className={classes.formControl}
                value={formData.containerXSize}
                onChange={handleChange}
              />
              <TextField
                name="containerYSize"
                label="창고 세로 크기"
                fullWidth
                variant="outlined"
                className={classes.formControl}
                value={formData.containerYSize}
                onChange={handleChange}
              />
              <TextField
                name="locationX"
                label="Location(적재함) 가로 크기"
                fullWidth
                variant="outlined"
                className={classes.formControl}
                value={formData.locationX}
                onChange={handleChange}
              />
              <TextField
                name="locationY"
                label="Location(적재함) 세로 크기"
                fullWidth
                variant="outlined"
                className={classes.formControl}
                value={formData.locationY}
                onChange={handleChange}
              />
              <TextField
                name="locationZ"
                label="Location(적재함) 층수"
                fullWidth
                variant="outlined"
                className={classes.formControl}
                value={formData.locationZ}
                onChange={handleChange}
              />
              <TextField
                name="row"
                label="행"
                fullWidth
                variant="outlined"
                className={classes.formControl}
                value={formData.row}
                onChange={handleChange}
              />
              <TextField
                name="column"
                label="열"
                fullWidth
                variant="outlined"
                className={classes.formControl}
                value={formData.column}
                onChange={handleChange}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Finish
              </Button>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

// -----   상자 설정 변경기 영역   ------
const RectangleTransformer = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}) => {
  const shapeRef = useRef();
  const trRef = useRef();

  // 폰트사이즈 계산
  const fontSize = Math.min(shapeProps.width, shapeProps.height) / 4;

  // 재고함의 행렬과 높이를 나타내도록 설정한 MainText
  const mainText = `${shapeProps.name}-${
    shapeProps.z < 10 ? "0" + shapeProps.z : shapeProps.z
  }`;

  // RGB 색깔로 재고율 퍼센트(%)를 추출하는 함수
  const extractFillPercentage = (rgbaString) => {
    const matches = rgbaString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);

    if (matches) {
      const red = parseInt(matches[1], 10);
      // Assuming the fill percentage was encoded in the red component
      return ((red / 255) * 100).toFixed(1);
    }

    return "0.0"; // Default to 0% if unable to parse
  };

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
            width: Math.round(Math.max(5, node.width() * scaleX)), // 최소 너비 보장
            height: Math.round(Math.max(5, node.height() * scaleY)), // 최소 높이 보장
            rotation: Math.round(node.rotation()), // 반올림한 각도
          });
        }}
      />
      <Text
        text={mainText}
        x={shapeProps.x}
        y={shapeProps.y}
        z={shapeProps.z}
        width={shapeProps.width}
        height={shapeProps.height - fontSize}
        fontSize={Math.min(shapeProps.width, shapeProps.height) / 5}
        fontFamily="Arial"
        fill="white"
        align="center"
        verticalAlign="middle"
        listening={false} // 텍스트를 클릭할 수 없도록 비활성화
      />
      <Text
        text={`${extractFillPercentage(shapeProps.fill)}%`}
        x={shapeProps.x}
        y={shapeProps.y}
        z={shapeProps.z}
        width={shapeProps.width}
        height={shapeProps.height + fontSize}
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

export default MyContainerMap;
