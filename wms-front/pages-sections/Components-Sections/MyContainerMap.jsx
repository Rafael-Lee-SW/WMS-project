// fundamental importing about React
import React, { useState, useEffect, useRef } from "react";
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
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import SaveIcon from "@mui/icons-material/Save";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
// core components
import Button from "/components/CustomButtons/Button.js";

import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/MyContainerStyle.jsx";

// 상수 설정(그리드, 컨버스 등)
const GRID_SIZE = 100; // 100cm = 1m
const GRID_SIZE_SUB_50 = 50; // 50cm
const GRID_SIZE_SUB_10 = 10; // 10cm
const CANVAS_SIZE = 1000; // 100 = 1000cm = 10m

const useStyles = makeStyles(styles);

/**
 * 창고 관리 Component
 */

const MyContainerMap = () => {
  const classes = useStyles(); // 스타일 불러오기
  const stageRef = useRef(null); // reference for the stage
  const layerRef = useRef(null); // reference for the layer

  // Initial Setting the container array 초기 세팅
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
      order: 0, // 순서대로 번호 인덱싱
      name: "임시",
      type: "임시", // 저장 타입
      rotation: 0, // 초기 회전값
    },
  ]);

  // 마지막으로 클릭한 상자를 추적하는 상태 추가
  const [selectedLocation, setSelectedLocation] = useState(null);
  // 마지막으로 클릭한 상자를 수정하는 폼을 띄우기 위한 상태 추가
  const [selectedLocationTransform, setSelectedLocationTransform] =
    useState(null);

  // 현재 벽 생성 / 일반 커서 를 선택하기 위한 State
  const [currentSetting, setCurrentSetting] = useState("location"); // 초기 모드는 location
  const [showColorPicker, setShowColorPicker] = useState(false); // ColorPicker를 보기 위한 State

  // 새롭게 생성되는 적재함(location)의 속성 설정을 위한 State
  const [newLocationColor, setNewLocationColor] = useState("blue");
  const [newLocationWidth, setNewLocationWidth] = useState(50);
  const [newLocationHeight, setNewLocationHeight] = useState(50);
  const [newLocationZIndex, setNewLocationZIndex] = useState(1);
  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationType, setNewLocationType] = useState(""); // 적재함의 속성(냉동, 상온 등) 추후 반영 예정

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

  // 메뉴를 위한
  const menuRef = useRef(null);
  const currentShapeRef = useRef(null);

  // 로케이션을 추가하는 메서드
  const handleAddLocation = (type) => {
    const newLocation = {
      id: null,
      // id: (parseInt(locations[locations.length - 1].id) + 1).toString(),s
      x: 50,
      y: 50,
      z: newLocationZIndex,
      width: newLocationWidth,
      height: newLocationHeight,
      fill: newLocationColor,
      draggable: true,
      order: locations.length + 1, // 순서대로 번호 인덱싱
      name:
        newLocationName ||
        `적재함 ${parseInt(locations[locations.length - 1].id) + 1}`,
      type: type, // set the type of the Location
      rotation: 0, // 초기 회전값
    };
    setLocations([...locations, newLocation]);
    updateContainer(newLocation, "location", `location${newLocation.id}`);
    // Reset settings to default after adding // 적재함 추가 후 값 초기화
    setNewLocationColor("blue");
    setNewLocationWidth(50);
    setNewLocationHeight(50);
    // setNewLocationZIndex(1); //초기화 하지 아니함
    setNewLocationName("");
  };
  //
  // Container Update Function (창고 배열 저장)
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

  // 컨버스에 있는 사각형들의 정보를 저장한다.
  const handleSave = async () => {
    // 사각형들을 전부 기록한다.
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
    // console.log("Canvas data", locationData);
    // console.log("container", container);

    //앙커들을 전부 기록한다.
    const wallData = anchorsRef.current.map(({ start, end }) => ({
      startID: start.id(),
      startX: start.x(),
      startY: start.y(),
      endID: end.id(),
      endX: end.x(),
      endY: end.y(),
    }));
    // console.log("Anchor data ", anchorData);

    try {
      const response = await fetch("/api/save-map", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locationData, wallData }),
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

  // API를 통해 DB에 저장한다.
  const APISaveToDB = async () => {
    const locationData = locations.map((location) => ({
      id: parseInt(location.id),
      name: location.name,
      fill: 0,
      xposition: location.x,
      yposition: location.y,
      xsize: location.width,
      ysize: location.height,
      zsize: location.z,
      rotation: location.rotation,
      storageType: "상온",
    }));

    console.log(locationData);

    console.log(anchorsRef.current);

    // 벽 데이터를 기록합니다.
    const wallData = anchorsRef.current.map(({ start, end }, index) => ({
      // id: `${start.attrs.id}:${end.attrs.id}`,
      id: index + 1,
      startX: start.x(),
      startY: start.y(),
      endX: end.x(),
      endY: end.y(),
    }));

    const warehouseData = { locations: locationData, walls: wallData };
    // Log the request body
    console.log(JSON.stringify(warehouseData, null, 2));

    try {
      const response = await fetch(
        "https://i11a508.p.ssafy.io/api/warehouses/2/locatons-and-walls",
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
        setLocations(locationData); // 사각형들
        clearAnchorsAndLines(); // Load 전 초기화

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
  const APIConnectionTest = async () => {
    try {
      const response = await fetch(
        "https://i11a508.p.ssafy.io/api/warehouses/2",
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

        // Log the received data for debugging
        console.log("API response:", warehouseData);

        // Check if locations exist
        const locations = warehouseData.locations;
        if (!locations) {
          console.error("Locations data not found");
          return;
        }
        // Map API data to locations
        const newLocations = locations.map((location, index) => {
          // Get the floorLevel from floorDtos array if it exists

          // Ensure that the width and height are preserved
          return {
            id: location.id.toString(),
            x: location.xposition,
            y: location.yposition,
            width: location.xsize || 50, // Default width if not provided
            height: location.ysize || 50, // Default height if not provided
            z: 5,
            fill: "blue", // Default color
            draggable: true,
            order: index, // 순서대로 번호 인덱싱
            name: location.name || `적재함 ${index}`,
            type: "location", // Default type
            rotation: 0, // 초기 회전값
          };
        });

        // Log the final rectangles for debugging
        console.log("API rectangles loaded successfully:", newLocations);

        // Check if walls exist
        const walls = warehouseData.walls;
        if (!walls) {
          console.error("Walls data not found");
          return;
        }

        // Map API data to walls
        clearAnchorsAndLines(); // Load 전 초기화

        const existingAnchors = [];
        const newAnchors = [];

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

        // Update state with new rectangles and walls
        setLocations(newLocations);
      } else {
        console.error("Error loading rectangles data");
      }
    } catch (error) {
      console.error("Error loading rectangles data:", error);
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

    if (!stageAttrs.x) {
      // 드래그 하지 않음
      x = x / stageAttrs.scaleX;
      y = y / stageAttrs.scaleY;
    } else {
      // 드래그해서 새로운 stageAttrs의 x,y가 생김
      x = (x - stageAttrs.x) / stageAttrs.scaleX;
      y = (y - stageAttrs.y) / stageAttrs.scaleY;
    }
    // console.log("출력 : " + Math.round(x) + " : " + Math.round(y));
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
      radius: 20,
      stroke: "#666",
      fill: "#ddd",
      opacity: 0,
      strokeWidth: 2,
      draggable: currentSetting !== "wall", // Make draggable based on current setting
    });
    layer.add(newAnchor);
    setAnchors((prevAnchors) => [...prevAnchors, newAnchor]);

    newAnchor.on("mouseover", function () {
      document.body.style.cursor = "pointer";
      this.strokeWidth(4);
      this.opacity(1);
      this.moveToTop();
      setHoveredAnchor(this); // hoverdAnchor를 지정한다.
    });
    newAnchor.on("mouseout", function () {
      document.body.style.cursor = "default";
      this.strokeWidth(2);
      this.opacity(0);
      this.moveToTop();
      setHoveredAnchor(null); // hoverdAnchor를 지정한다.
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

    // Toggle draggable property based on current setting
    const newDraggable = value !== "wall";
    anchorsRef.current.forEach(({ start, end }) => {
      start.draggable(newDraggable);
      end.draggable(newDraggable);
    });

    // Redraw the layer to reflect changes
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

  // 삭제를 하기 위한 메서드
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

        if (hoveredAnchor !== null) {
          pos.x = hoveredAnchor.attrs.x;
          pos.y = hoveredAnchor.attrs.y;
        } else {
          // 무조건 10 pixel 단위로 반올림하여 시작 위치 보정
          pos.x = Math.round(pos.x / 10) * 10;
          pos.y = Math.round(pos.y / 10) * 10;
        }

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

          if (hoveredAnchor !== null) {
            pos.x = hoveredAnchor.attrs.x;
            pos.y = hoveredAnchor.attrs.y;
          } // 아님 그냥 한다.

          handleAddWall(startPos, pos);

          setLine(null);
          setStartPos(null);
        }
      }
    };

    // 벽을 추가한다.
    // 벽을 추가한다.
    const handleAddWall = (start, end) => {
      if (currentSetting === "wall") {
        const newWall = {
          id: locations.length.toString(),
          x: end.x,
          y: end.y,
          width: newWallWidth,
          height: Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2),
          fill: newWallColor,
          draggable: true,
          order: locations.length + 1,
          name: `Wall ${locations.length + 1}`,
          type: "wall",
          rotation: Math.round(
            Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI) + 90
          ),
        };

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

    /**
     * Anchor에 관한 함수를 넣는 곳
     */

    // Redraw layer when setting changes
    if (layerRef.current) {
      layerRef.current.batchDraw();
    }

    // Clean-up the Function to remove event Listeners
    return () => {
      stage.off("mousedown", handleMouseDown);
      stage.off("mousemove", handleMouseMove);
      stage.off("mouseup", handleMouseUp);
    };
  }, [line, startPos, currentSetting, hoveredAnchor]);

  //--- 리턴 Part ---

  return (
    <div>
      {/** Main 영역 시작 */}
      <main
        style={{
          display: "flex",
          height: "85vh",
          backgroundColor: "white",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {/* Left-SideBar / 좌측 사이드바  */}
        <div
          style={{
            marginLeft: "0",
            padding: "8px",
            border: "2px solid #aaaaaa",
            borderRadius: "14px",
            width: "20%",
            height: "80vh",
            overflowY: "auto",
          }}
        >
          <Button
            style={{
              width: "20%",
              fontSize: "14px",
            }}
            onClick={() => changeCurrentSetting("location")}
          >
            재고함
          </Button>
          <Button
            style={{
              width: "20%",
              fontSize: "14px",
            }}
            onClick={() => changeCurrentSetting("wall")}
          >
            벽
          </Button>
          <Button
            style={{
              width: "20%",
              fontSize: "14px",
            }}
            onClick={() => changeCurrentSetting("specialObject")}
          >
            특수 객체
          </Button>
          {currentSetting && currentSetting !== "wall" && (
            <div>
              <h3>{currentSetting} 설정</h3>
              <div>
                <label
                  style={{
                    display: "flex",
                  }}
                >
                  <div
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    style={{
                      width: "3vh",
                      height: "3vh",
                      background: newLocationColor,
                      border: "1px solid #000",
                      cursor: "pointer",
                    }}
                  />
                  <div
                    style={{
                      marginLeft: "1vh",
                    }}
                  >
                    색상을 지정하세요
                  </div>
                  {showColorPicker && (
                    <SketchPicker
                      styles={{
                        width: "1000px",
                      }}
                      color={newLocationColor}
                      onChangeComplete={(color) => setNewLocationColor(color.hex)}
                    />
                  )}
                </label>
                <hr
                  style={{
                    color: "#aaaaaa",
                  }}
                />
              </div>
              <p
                style={{
                  color: "#aaaaaa",
                }}
              >
                단수와 크기를 정하세요
              </p>
              <div>
                <div>
                  <label>
                    Zndex :
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={newLocationZIndex}
                      onChange={(e) => setNewLocationZIndex(Number(e.target.value))}
                    />
                    {newLocationZIndex}
                  </label>
                </div>
                <label>
                  Width:
                  <input
                    type="range"
                    min="10"
                    max="500"
                    value={newLocationWidth}
                    onChange={(e) =>
                      setNewLocationWidth(
                        Math.round(Number(e.target.value) / 10) * 10
                      )
                    }
                  />
                  {newLocationWidth}
                </label>
              </div>
              <div>
                <label>
                  Height:
                  <input
                    type="range"
                    min="10"
                    max="500"
                    value={newLocationHeight}
                    onChange={(e) =>
                      setNewLocationHeight(
                        Math.round(Number(e.target.value) / 10) * 10
                      )
                    }
                  />
                  {newLocationHeight}
                </label>
              </div>
              <hr />
              <p
                style={{
                  color: "#aaaaaa",
                }}
              >
                이름과 속성을 지정해주세요
              </p>
              <div>
                <label>
                  Name :
                  <input
                    type="text"
                    value={newLocationName}
                    onChange={(e) => setNewLocationName(e.target.value)}
                    style={{
                      marginLeft: "3px",
                      width: "14vh",
                    }}
                  />
                </label>
              </div>
              <div>
                <label>
                  속성 :
                  <input
                    type="text"
                    value={newLocationName}
                    onChange={(e) => setNewLocationName(e.target.value)}
                    style={{
                      marginLeft: "3px",
                      width: "15vh",
                    }}
                  />
                </label>
              </div>
              <Button
                onClick={() => handleAddLocation(currentSetting)}
                style={{
                  width: "100%",
                  marginTop: "50%",
                  fontSize: "18px",
                }}
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
                  Color:
                  <div
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    style={{
                      width: "36px",
                      height: "14px",
                      background: newWallColor,
                      border: "1px solid #000",
                      cursor: "pointer",
                    }}
                  />
                  {showColorPicker && (
                    <SketchPicker
                      color={newWallColor}
                      onChangeComplete={(color) => setNewWallColor(color.hex)}
                    />
                  )}
                </label>
              </div>
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

        <div
          style={{
            border: "2px solid #aaaaaa",
            backgroundColor: "#aaaaaa",
            borderRadius: 5,
            width: "60%",
            height: "80vh",
            margin: "0 auto",
            position: "relative",
            overflow: "hidden", // Canvas 영역 이외에는 잠금
            cursor: customCursor, // 커스텀 커서를 활용하여 상태별로 커서 변경
          }}
        >
          <div
            style={{
              border: "2px solid #aaaaaa",
              backgroundColor: "white",
              borderRadius: 5,
              width: "95%",
              height: "88%",
              margin: "2% auto",
              position: "relative",
              overflow: "hidden", // Canvas 영역 이외에는 잠금
              cursor: customCursor, // 커스텀 커서를 활용하여 상태별로 커서 변경
            }}
          >
            <Stage
              width={CANVAS_SIZE} // 1000cm = 10m
              height={CANVAS_SIZE} // 1000cm = 10cm
              scaleX={scale}
              scaleY={scale}
              draggable={currentSetting === "wall" ? false : true}
              ref={stageRef} // Assign the reference to the stage
              onPointerMove={Pointer}
              onMouseDown={checkDeselect} // 마우스 다운 시 선택 해체
              onTouchStart={checkDeselect} // 처시 시작 시 선택 해체
            >
              <Layer ref={layerRef}>
                {generateGridLines()}

                {locations.map((rect, i) => (
                  <RectangleTransformer
                    key={rect.id} // 각 사각형에 고유 키 설정
                    x={rect.x} // 텍스트를 띄우기 위한 위치 정보
                    y={rect.y}
                    width={rect.width}
                    height={rect.height}
                    fill={rect.fill}
                    shapeProps={rect} // 모양 속성 전달
                    isSelected={rect.id === selectedLocationTransform} // 사각형이 선택되었는지 확인
                    onSelect={() => {
                      setSelectedLocationTransform(rect.id); // 클릭시 변환 시작
                      setSelectedLocation(rect); // 클릭 시 사각형 선택
                    }}
                    onChange={(newAttrs) => {
                      const rects = locations.slice();
                      rects[i] = newAttrs;
                      setLocations(rects); // 사각형 속성 업데이트
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
            <Button justIcon round color="primary" onClick={handleSave}>
              <SaveIcon className={classes.icons} />
            </Button>
            <Button justIcon round color="primary" onClick={loadMapFromLocal}>
              <UnarchiveIcon className={classes.icons} />
            </Button>
            <Button color="primary" onClick={APIConnectionTest}>
              API 불러오기
            </Button>
            <Button color="primary" onClick={APISaveToDB}>
              API 저장하기
            </Button>
          </div>
        </div>

        {/* Right-Sidebar / 우측 사이드바 영역  */}
        <div
          style={{
            padding: "10px",
            border: "2px solid #aaaaaa",
            borderRadius: "15px",
            width: "18%",
            height: "80vh",
            overflowY: "auto",
          }}
        >
          <h3>재고함 목록</h3>
          {locations.length !== 0 ? (
            <div>
              <ul
                style={{
                  height: "40vh",
                  overflowY: "auto", // Add this line to make the ul scrollable
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
          <hr />
          <h3>선택된 재고함</h3>
          {selectedLocation ? (
            <div>
              <p>ID : {selectedLocation.id}</p>
              <p>Number : {selectedLocation.order}</p>
              <p>Name : {selectedLocation.name}</p>
              <p>Type : {selectedLocation.type}</p>
              <p>층수 : {selectedLocation.z}</p>
            </div>
          ) : (
            <p>No rectangle selected</p>
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
      </main>
    </div>
  );
};

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
            width: Math.round(Math.max(5, node.width() * scaleX)), // 최소 너비 보장
            height: Math.round(Math.max(5, node.height() * scaleY)), // 최소 높이 보장
            rotation: Math.round(node.rotation()), // 반올림한 각도
          });
        }}
      />
      <Text
        text={shapeProps.name}
        x={shapeProps.x}
        y={shapeProps.y}
        z={shapeProps.z}
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

export default MyContainerMap;
