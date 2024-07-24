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
import Button from "/components/CustomButtons/Button.js";
import CustomInput from "/components/CustomInput/CustomInput.js";
import CustomLinearProgress from "/components/CustomLinearProgress/CustomLinearProgress.js";
import Paginations from "/components/Pagination/Pagination.js";
import Badge from "/components/Badge/Badge.js";

import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/MyContainerStyle.jsx";
import { Canvas } from "canvas";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";

// 상수 설정(그리드, 컨버스 등)
const GRID_SIZE = 100; // 100cm = 1m
const GRID_SIZE_SUB_50 = 50; // 50cm
const GRID_SIZE_SUB_10 = 10; // 10cm
const CANVAS_SIZE = 1000; // 100 = 1000cm = 10m

const useStyles = makeStyles(styles);

// ----- 본격적인 창고 설정 반환 -------

const User = () => {
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
  // Container for saving the info.
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

  // 사각형을 컨버스에 추가한다.
  const handleAddRectangle = (type) => {
    const newRect = {
      id: rectangles.length.toString(),
      x: 50,
      y: 50,
      width: newRectWidth,
      height: newRectHeight,
      fill: newRectColor,
      draggable: true,
      order: rectangles.length, // 순서대로 번호 인덱싱
      name: newRectName || `Rect ${rectangles.length}`,
      type: type, // set the type of the rectangle
      rotation: 0, // 초기 회전값
    };
    setRectangles([...rectangles, newRect]);
    updateContainer(newRect, "rectangle", `rect${newRect.id}`);
    // Reset settings to default after adding
    setNewRectColor("blue");
    setNewRectWidth(50);
    setNewRectHeight(50);
    setNewRectName("");
  };

  // Container Update Function (창고 배열 저장)
  const updateContainer = (rect, type, code) => {
    const newContainer = container.map((row, x) =>
      row.map((cell, y) => {
        if (
          x >= rect.x &&
          x < rect.x + rect.width &&
          y >= rect.y &&
          y < rect.y + rect.height
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
      setSelectedRectTransform(null);
    }
  };

  // 커서를 위한 let cursor 정의
  let customCursor;
  if (currentSetting === "wall") {
    customCursor = "crosshair";
  } else if (currentSetting === "grab") {
    customCursor = "grab";
  } else {
    customCursor = "default";
  }

  /**
   * 도형과 도형을 선으로 잇는 기능을 위한 거시기
   */
  // 선을 잇는 기능을 넣기 위한 거시기
  const [line, setLine] = useState(null);
  const [startPos, setStartPos] = useState(null);
  // const layerRef = useRef(); already exist for other function
  // const stageRef = useRef(); already exist for other function

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

  /**
   * 실시간 반응을 위한 UseEffect part
   *
   * - 특히 벽을 생성하는 것으 선을 그려서 생성하도록 변경할 예정
   */

  //실시간 반응을 위해서 currentSetting에 대한 함수 작동을 메서드로 넘기기
  const changeCurrentSetting = (value) => {
    setCurrentSetting(value);
  };
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
        setRectangles([...rectangles, newWall]);
        updateContainer(newWall, "wall", `wall${newWall.id}`);
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
        console.log("거시기");
      }
    };

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
    const buildAnchor = (x, y, id) => {
      // 앙커 역할을 하는 Circle 객체 생성
      const anchor = new Konva.Circle({
        x: x, // 앵커의 x 좌표
        y: y, // 앵커의 y 좌표
        radius: 10, // 원의 반지름
        stroke: "#666", // 원 테두리의 색상
        fill: "#ddd", // 원을 채울 색상
        strokeWidth: 2, // 원 테두리의 너비
        draggable: true, // 원을 드래그 가능하게 설정
        id: id,
        name: "anchor",
        listening: true, // 이벤트 리스닝 활성화
      });

      // 마우스오버 이벤트 리스너 추가하여 커서 스타일과 테두리 너비 변경
      anchor.on("mouseover", function () {
        document.body.style.cursor = "pointer";
        this.strokeWidth(4);
        this.draw();
      });
      // 마우스아웃 이벤트 리스너 추가하여 커서 스타일과 테두리 너비 재설정
      anchor.on("mouseout", function () {
        document.body.style.cursor = "default";
        this.strokeWidth(2);
        this.draw();
      });

      // 드래그 이동 이벤트 리스너 추가하여 사각형 업데이트
      anchor.on("dragmove", function () {
        updateRectangles();
        this.moveToTop(); // 앵커를 맨 위로 이동
        this.draw();
      });

      anchor.on("dragstart", function () {
        this.moveToTop(); // 드래그 시작 시 앵커를 맨 위로 이동
        this.draw();
        // console.log("업뎃")
      });

      return anchor;
    };

    // 앵커 위치를 기준으로 사각형의 위치와 크기를 업데이트하는 함수
    const updateRectangles = () => {
      const q = quad; // 이차 곡선 앵커에 대한 참조
      const b = bezier; // 베지어 곡선 앵커에 대한 참조

      // ID로 사각형 찾기
      const quadRect = layerRef.current.findOne("#quadRect");
      const bezierRect = layerRef.current.findOne("#bezierRect");

      // 이차 사각형의 위치와 크기 업데이트
      const quadMidX = (q.start.x() + q.end.x()) / 2;
      const quadMidY = (q.start.y() + q.end.y()) / 2;
      const quadWidth = Math.hypot(
        q.end.x() - q.start.x(),
        q.end.y() - q.start.y()
      );
      const quadAngle =
        Math.atan2(q.end.y() - q.start.y(), q.end.x() - q.start.x()) *
        (180 / Math.PI);

      quadRect.position({
        x: quadMidX,
        y: quadMidY,
      });
      quadRect.size({ width: quadWidth, height: 20 });
      quadRect.offsetX(quadWidth / 2);
      quadRect.offsetY(10);
      quadRect.rotation(quadAngle);

      // 베지어 사각형의 위치와 크기 업데이트
      const bezierMidX = (b.start.x() + b.end.x()) / 2;
      const bezierMidY = (b.start.y() + b.end.y()) / 2;
      const bezierWidth = Math.hypot(
        b.end.x() - b.start.x(),
        b.end.y() - b.start.y()
      );
      const bezierAngle =
        Math.atan2(b.end.y() - b.start.y(), b.end.x() - b.start.x()) *
        (180 / Math.PI);

      bezierRect.position({
        x: bezierMidX,
        y: bezierMidY,
      });
      bezierRect.size({ width: bezierWidth, height: 20 });
      bezierRect.offsetX(bezierWidth / 2);
      bezierRect.offsetY(10);
      bezierRect.rotation(bezierAngle);
    };

    // 이차 사각형의 앵커에 대한 참조를 저장하기 위한 특수 객체
    const quad = {
      start: buildAnchor(60, 30, "quadStart"), // 시작 앵커
      end: buildAnchor(240, 110, "quadEnd"), // 끝 앵커
    };

    // 베지어 사각형의 앵커에 대한 참조를 저장하기 위한 특수 객체
    const bezier = {
      start: buildAnchor(280, 20, "bezierStart"), // 시작 앵커
      end: buildAnchor(530, 40, "bezierEnd"), // 끝 앵커
    };
    /**
     * Anchor 생성을 위한 useEffect 부분 삽입
     */

    layer.add(quad.start);
    layer.add(quad.end);
    layer.add(bezier.start);
    layer.add(bezier.end);

    // 이차 점들에 대한 사각형 생성
    const quadRect = new Konva.Rect({
      stroke: "black", // 사각형 테두리의 색상
      strokeWidth: 4, // 사각형 테두리의 너비
      id: "quadRect", // 사각형의 ID
    });
    // 레이어에 사각형 추가
    layer.add(quadRect);

    // 베지어 점들에 대한 사각형 생성
    const bezierRect = new Konva.Rect({
      stroke: "black", // 사각형 테두리의 색상
      strokeWidth: 4, // 사각형 테두리의 너비
      id: "bezierRect", // 사각형의 ID
    });
    // 레이어에 사각형 추가
    layer.add(bezierRect);

    // 앵커 위치에 맞게 사각형을 업데이트
    updateRectangles();

    // Ensure anchors are on top using zIndex
    quad.start.zIndex(layer.children.length - 1);
    quad.end.zIndex(layer.children.length - 1);
    bezier.start.zIndex(layer.children.length - 1);
    bezier.end.zIndex(layer.children.length - 1);

    // Clean-up the Function to remove event Listeners
    return () => {
      stage.off("mousedown", handleMouseDown);
      stage.off("mousemove", handleMouseMove);
      stage.off("mouseup", handleMouseUp);
      /**
       * Anchor 파트
       */
      quad.start.remove();
      quad.end.remove();
      bezier.start.remove();
      bezier.end.remove();
      stage.off("mousedown mousemove mouseup");
    };
  }, [line, startPos, currentSetting]);

  //--- 리턴 Part ---

  return (
    <div>
      {/* JSX 주석 */}

      {/** Main 영역 시작 */}

      <main
        style={{
          display: "flex",
        }}
      >
        {/* Left-SideBar / 좌측 사이드바  */}
        <div
          style={{
            marginLeft: "20px",
            padding: "10px",
            border: "2px solid black",
            borderRadius: "10px",
            width: "15%",
            height: "80vh",
            overflowY: "auto",
          }}
        >
          <button onClick={() => changeCurrentSetting("location")}>
            재고함
          </button>
          <button onClick={() => changeCurrentSetting("wall")}>벽</button>
          <button onClick={() => changeCurrentSetting("specialObject")}>
            특수 객체
          </button>
          {currentSetting && currentSetting !== "wall" && (
            <>
              <h3>{currentSetting} 설정</h3>
              <div>
                <label>
                  Color:
                  <div
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    style={{
                      width: "36px",
                      height: "14px",
                      background: newRectColor,
                      border: "1px solid #000",
                      cursor: "pointer",
                    }}
                  />
                  {showColorPicker && (
                    <SketchPicker
                      color={newRectColor}
                      onChangeComplete={(color) => setNewRectColor(color.hex)}
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
                    max="500"
                    value={newRectWidth}
                    onChange={(e) => setNewRectWidth(Number(e.target.value))}
                  />
                  {newRectWidth}
                </label>
              </div>
              <div>
                <label>
                  Height:
                  <input
                    type="range"
                    min="5"
                    max="500"
                    value={newRectHeight}
                    onChange={(e) => setNewRectHeight(Number(e.target.value))}
                  />
                  {newRectHeight}
                </label>
              </div>
              <div>
                <label>
                  Name:
                  <input
                    type="text"
                    value={newRectName}
                    onChange={(e) => setNewRectName(e.target.value)}
                  />
                </label>
              </div>
              <button onClick={() => handleAddRectangle(currentSetting)}>
                Create {currentSetting}
              </button>
            </>
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
            border: "2px solid black",
            borderRadius: 20,
            width: "60%",
            height: "80vh",
            margin: "0 auto",
            position: "relative",
            overflow: "hidden", // Canvas 영역 이외에는 잠금
            // overflow:"scroll", // Add Scroll, if canvas exceeds div size
            // cursor: "url('brickCursor.cur'), auto",
            cursor: customCursor,
            //   // url(../public/img/brickCursor.cur)
            // currentSetting === "wall"
            // ? "crosshair"
            // : // ? "unset"
            // "",
          }}
          // onClick={(e) => {
          //   if (currentSetting === "wall") {
          //     const stage = stageRef.current;
          //     // 올바른 위치를 위한 스케일링
          //     const pointerPosition = stage.getPointerPosition();
          //     var stageAttrs = stage.attrs;
          //     pointerPosition.x =
          //       (pointerPosition.x - stageAttrs.x) / stageAttrs.scaleX;
          //     pointerPosition.y =
          //       (pointerPosition.y - stageAttrs.y) / stageAttrs.scaleY;
          //     // -----------------------
          //     setTempSpots([...tempSpots, pointerPosition]);
          //     if (!wallStartPoint) {
          //       setWallStartPoint(pointerPosition);
          //     } else {
          //       handleAddWall(wallStartPoint, pointerPosition);
          //     }
          //   }
          // }}
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

              {rectangles.map((rect, i) => (
                <RectangleTransformer
                  key={rect.id} // 각 사각형에 고유 키 설정
                  x={rect.x} // 텍스트를 띄우기 위한 위치 정보
                  y={rect.y}
                  width={rect.width}
                  height={rect.height}
                  fill={rect.fill}
                  shapeProps={rect} // 모양 속성 전달
                  isSelected={rect.id === selectedRectTransform} // 사각형이 선택되었는지 확인
                  onSelect={() => {
                    setSelectedRectTransform(rect.id);
                    setSelectedRect(rect); // 클릭 시 사각형 선택
                    // console.log(selectedRect.id)
                  }}
                  onChange={(newAttrs) => {
                    const rects = rectangles.slice();
                    rects[i] = newAttrs;
                    setRectangles(rects); // 사각형 속성 업데이트
                  }}
                />
              ))}
              {/* 벽 생성을 위한 가이드라인 점 */}
              {/* {tempSpots.map((spot, index) => (
                <Circle
                  key={index}
                  x={spot.x}
                  y={spot.y}
                  radius={5}
                  fill="red"
                />
              ))} */}
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

        {/* Right-Sidebar / 우측 사이드바 영역  */}
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
          <h3>현재 적재함 목록</h3>
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
          <h3>Seleted Rectangle</h3>
          {selectedRect ? (
            <div>
              <p>ID : {selectedRect.id}</p>
              <p>X : {selectedRect.x}</p>
              <p>Y : {selectedRect.y}</p>
              <p>Number : {selectedRect.order}</p>
              <p>Name : {selectedRect.name}</p>
              <p>Type : {selectedRect.type}</p>
              <p>rotation : {selectedRect.rotation}</p>
            </div>
          ) : (
            <p>No rectangle selected</p>
          )}
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

export default User;
