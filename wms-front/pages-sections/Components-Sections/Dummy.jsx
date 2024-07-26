// fundamental importing about React
import React, { useState, useEffect, useRef } from "react";
// Library of konva and color
import { Stage, Layer, Rect, Text, Line, Circle } from "react-konva";
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

// 상수 설정(그리드, 컨버스 등)
const GRID_SIZE = 100; // 100cm = 1m
const GRID_SIZE_SUB_50 = 50; // 50cm
const GRID_SIZE_SUB_10 = 10; // 10cm
const CANVAS_SIZE = 1000; // 100 = 1000cm = 10m

const useStyles = makeStyles(styles);

const User = () => {
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
      id: rectangles.length,
      x: 50,
      y: 50,
      width: newRectWidth,
      height: newRectHeight,
      fill: newRectColor,
      draggable: true,
      order: rectangles.length + 1, // 순서대로 번호 인덱싱
      name: newRectName || `Rect ${rectangles.length + 1}`,
      type: type, // set the type of the rectangle
    };
    setRectangles([...rectangles, newRect]);
    updateContainer(newRect, "rectangle", `rect${newRect.id}`);
    // Reset settings to default after adding
    setNewRectColor("blue");
    setNewRectWidth(50);
    setNewRectHeight(50);
    setNewRectName("");
  };

  //벽을 추가한다.
  const handleAddWall = (start, end) => {
    const newWall = {
      id: rectangles.length,
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
      width: newWallWidth,
      height: Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2),
      fill: newWallColor,
      draggable: true,
      order: rectangles.length + 1, // 순서대로 번호 인덱싱
      name: `Wall ${rectangles.length + 1}`,
      type: "wall",
      rotation:
        Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI) + 90,
    };
    if (!isOverlapping(newWall)) {
      setRectangles([...rectangles, newWall]);
      updateContainer(newWall, "wall", `wall${newWall.id}`);
      // Reset wall points
      setWallStartPoint(null);
      setWallEndPoint(null);
      // Reset settings to default after adding
      setNewWallColor("brown");
      setNewWallWidth(10);
    } else {
      alert("Wall overlaps with another rectangle.");
      // Reset wall points
      setWallStartPoint(null);
      setWallEndPoint(null);
    }
  };

  const isOverlapping = (rect) => {
    return rectangles.some((otherRect) =>
      rectIntersect(
        {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        },
        otherRect
      )
    );
  };

  // 사각형 드래그 행동이 끝난 뒤에 발생하는 Event
  // 이동 후에 다른 사각형이랑 겹치면 놓을 수 있는 위치 중
  // 가장 가까운 위치로 놓게 됨.
  const handleDragEnd = (e, id) => {
    const updatedRectangles = rectangles.map((rect) => {
      if (rect.id === id) {
        let x = Math.round(e.target.x());
        let y = Math.round(e.target.y());
        const draggedRect = {
          x: x,
          y: y,
          width: rect.width,
          height: rect.height,
        };

        // Adjust to prevent overlap with other rectangles
        rectangles.forEach((otherRect) => {
          if (otherRect.id !== rect.id) {
            if (rectIntersect(draggedRect, otherRect)) {
              // Calculate the closest non-overlapping position
              const adjustedPosition = getClosestNonOverlapPosition(
                draggedRect,
                otherRect
              );
              x = adjustedPosition.x;
              y = adjustedPosition.y;
            }
          }
        });

        // Ensure the rectangle stays within the canvas boundaries
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x + rect.width > CANVAS_SIZE) x = CANVAS_SIZE - rect.width;
        if (y + rect.height > CANVAS_SIZE) y = CANVAS_SIZE - rect.height;

        const updatedRect = {
          ...rect,
          x: x,
          y: y,
        };

        updateContainer(updatedRect, "rectangle", `rect${rect.id}`);
        return updatedRect;
      }
      return rect;
    });

    setRectangles(updatedRectangles);
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

  // Function to check if two rectangles intersect
  const rectIntersect = (rect1, rect2) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  // Connected with above function
  // Function to find the closest non-overlapping position
  // 가장 가깝고 놓을 수 있는 위치를 찾는 것.
  // Function to find closest non-overlapping position
  const getClosestNonOverlapPosition = (draggedRect, otherRect) => {
    const overlapX = Math.max(
      0,
      Math.min(
        draggedRect.x + draggedRect.width,
        otherRect.x + otherRect.width
      ) - Math.max(draggedRect.x, otherRect.x)
    );
    const overlapY = Math.max(
      0,
      Math.min(
        draggedRect.y + draggedRect.height,
        otherRect.y + otherRect.height
      ) - Math.max(draggedRect.y, otherRect.y)
    );

    if (overlapX === 0 && overlapY === 0) {
      // No overlap, return current position
      return { x: draggedRect.x, y: draggedRect.y };
    }

    // Calculate closest non-overlapping position
    let newX = draggedRect.x;
    let newY = draggedRect.y;

    if (overlapX > overlapY) {
      // Adjust vertically
      if (draggedRect.y < otherRect.y) {
        newY = otherRect.y - draggedRect.height;
      } else {
        newY = otherRect.y + otherRect.height;
      }
    } else {
      // Adjust horizontally
      if (draggedRect.x < otherRect.x) {
        newX = otherRect.x - draggedRect.width;
      } else {
        newX = otherRect.x + otherRect.width;
      }
    }

    return { x: newX, y: newY };
  };
  // 컨버스에 있는 사각형들의 정보를 저장한다.
  const handleSave = () => {
    const rectData = rectangles.map((rect) => ({
      id: rect.id,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      fill: rect.fill,
      type: rect.type,
      name: rect.name,
    }));
    console.log("Canvas data", rectData);
    console.log("container", container);
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

  // Font Size 를 자동으로 계산하여 조정하는 거시기
  const calculateFontSize = (rectWidth, rectHeight) => {
    return Math.min(rectWidth, rectHeight) / 5;
  };

  //--- 리턴 Part ---

  return (
    <div className={classes.sections}>
      <div className={classes.container}>
        <div className={classes.flexContainer}>
          <div>
            <h2>창고 및 적재함별로 어떤 상품들이 있는지를 보여주는 Components입니다.</h2>
          </div>
          <div className={classes.buttonsContainer}>
            {/** In /ButtonStyle.js , there are several button setting including color*/}
            <Button color="primary" round>
              <InventoryIcon className={classes.icons} /> 창고 설정
            </Button>
            <Button color="info" round>
              <ProductionQuantityLimitsIcon className={classes.icons} /> 재고
              관리
            </Button>
            <Button color="success" round>
              <ListAltIcon className={classes.icons} /> 재고 현황
            </Button>
            <Button href="/payment"> Test Button
            </Button>
          </div>
        </div>

        {/* JSX 주석 */}

        <hr />

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
            <button onClick={() => setCurrentSetting("location")}>
              Location Set
            </button>
            <button onClick={() => setCurrentSetting("wall")}>Wall Set</button>
            <button onClick={() => setCurrentSetting("specialObject")}>
              Special Object Set
            </button>
            {currentSetting && currentSetting !== "wall" && (
              <>
                <h3>Set Properties for {currentSetting}</h3>
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
              cursor:
                currentSetting === "wall"
                  ? "url(/brick-cursor.png), auto"
                  : "default",
            }}
            onClick={(e) => {
              if (currentSetting === "wall") {
                const stage = stageRef.current;
                const pointerPosition = stage.getPointerPosition();
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
              width={CANVAS_SIZE} // 1000cm = 10m
              height={CANVAS_SIZE} // 1000cm = 10cm
              scaleX={scale}
              scaleY={scale}
              draggable={true} // 만약에 캔버스를 드래그할 수 있게 만들꺼면 가능
              ref={stageRef} // Assign the reference to the stage
            >
              <Layer>
                {generateGridLines()}
                {rectangles.map((rect) => (
                  <React.Fragment key={rect.id}>
                    <Rect
                      key={rect.id}
                      x={rect.x}
                      y={rect.y}
                      width={rect.width}
                      height={rect.height}
                      fill={rect.fill}
                      draggable={rect.draggable}
                      onDragEnd={(e) => handleDragEnd(e, rect.id)}
                      onMouseEnter={() => setHoveredRectId(rect.id)}
                      onMouseLeave={() => setHoveredRectId(null)}
                      onClick={() => setSelectedRect(rect)}
                      stroke={
                        selectedRect?.id === rect.id
                          ? "red"
                          : hoveredRectId === rect.id
                          ? "red"
                          : "transparent"
                      }
                      strokeWidth={
                        selectedRect?.id === rect.id ||
                        hoveredRectId === rect.id
                          ? 2
                          : 0
                      }
                      rotation={rect.type === "wall" ? rect.rotation : 0}
                      offsetX={rect.type === "wall" ? 0 : 0}
                      offsetY={rect.type === "wall" ? rect.height / 2 : 0}
                    />
                    <Text
                      x={rect.x + rect.width / 2}
                      y={rect.y + rect.height / 4}
                      text={`${rect.order}`}
                      fontSize={calculateFontSize(rect.width, rect.height)}
                      fill="white"
                      align="center"
                    />
                    <Text
                      x={rect.x + rect.width / 4}
                      y={rect.y + (rect.height * 3) / 4}
                      text={`${rect.name}`}
                      fontSize={calculateFontSize(rect.width, rect.height)}
                      fill="white"
                      align="center"
                    />
                  </React.Fragment>
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
            <h3>Seleted Rectangle</h3>
            {selectedRect ? (
              <div>
                <p>ID : {selectedRect.id}</p>
                <p>X : {selectedRect.x}</p>
                <p>Y : {selectedRect.y}</p>
                <p>Number : {selectedRect.order}</p>
                <p>Name : {selectedRect.name}</p>
                <p>Type : {selectedRect.type}</p>
              </div>
            ) : (
              <p>No rectangle selected</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default User;
