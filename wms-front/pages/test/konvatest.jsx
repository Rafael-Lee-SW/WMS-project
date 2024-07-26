import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Transformer } from "react-konva";

// Rectangle 컴포넌트는 각 사각형의 렌더링 및 변형을 처리합니다
const Rectangle = ({ shapeProps, isSelected, onSelect, onChange }) => {
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
        onDragEnd={(e) => {
          // 드래그 종료 이벤트를 처리하여 사각형 위치 업데이트
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          // 변형 종료 이벤트를 처리하여 사각형 크기 및 위치 업데이트
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX), // 최소 너비 보장
            height: Math.max(5, node.height() * scaleY), // 최소 높이 보장
          });
        }}
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

// 초기 사각형 데이터
const initialRectangles = [
  {
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    fill: "red",
    id: "rect1",
  },
  {
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    fill: "green",
    id: "rect2",
  },
];

// Home 컴포넌트는 스테이지를 렌더링하고 사각형 상태를 관리합니다
const Home = () => {
  const [rectangles, setRectangles] = useState(initialRectangles); // 사각형 상태
  const [selectedId, selectShape] = useState(null); // 선택된 사각형 ID 상태

  // 빈 공간을 클릭했을 때 사각형 선택 해제하는 함수
  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  return (
    // Konva 캔버스를 위한 Stage 컴포넌트
    <Stage
      width={typeof window !== "undefined" ? window.innerWidth : 0} // 스테이지 너비 설정
      height={typeof window !== "undefined" ? window.innerHeight : 0} // 스테이지 높이 설정
      onMouseDown={checkDeselect} // 마우스 다운 시 선택 해제
      onTouchStart={checkDeselect} // 터치 시작 시 선택 해제
    >
      <Layer>
        {rectangles.map((rect) => (
          // 각 사각형을 렌더링
          <Rectangle
            key={rect.id} // 각 사각형에 고유 키 설정


            shapeProps={rect} // 모양 속성 전달
            isSelected={rect.id === selectedId} // 사각형이 선택되었는지 확인
            onSelect={() => {
              selectShape(rect.id); // 클릭 시 사각형 선택
              
            }}
            onChange={(newAttrs) => {
              const rects = rectangles.slice();
              rects[rect.id] = newAttrs;
              setRectangles(rects); // 사각형 속성 업데이트
            }}
            // 후버 이팩트
            onMouseEnter={() => setHoveredRectId(rect.id)}
            onMouseLeave={() => setHoveredRectId(null)}
            
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default Home; // Home 컴포넌트를 기본으로 내보냄
