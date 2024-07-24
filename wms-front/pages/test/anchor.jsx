// 필요한 라이브러리와 훅을 React와 Konva에서 가져옵니다.
import React, { useRef, useEffect } from 'react';
import Konva from 'konva';

// KonvaDemo라는 함수형 컴포넌트를 정의합니다.
const KonvaDemo = () => {
  // useRef 훅을 사용하여 컨테이너 div에 대한 참조를 생성합니다.
  const containerRef = useRef(null);

  // useEffect 훅을 사용하여 컴포넌트가 마운트된 후 코드를 실행합니다.
  useEffect(() => {
    // 창의 너비와 높이를 가져옵니다.
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 주어진 (x, y) 위치에 앵커 포인트를 생성하는 함수입니다.
    const buildAnchor = (x, y) => {
      // 앵커에 대한 Konva.Circle 인스턴스를 생성합니다.
      const anchor = new Konva.Circle({
        x: x, // 앵커의 x 좌표
        y: y, // 앵커의 y 좌표
        radius: 20, // 원의 반지름
        stroke: '#666', // 원 테두리의 색상
        fill: '#ddd', // 원 내부를 채울 색상
        strokeWidth: 2, // 원 테두리의 너비
        draggable: true, // 원을 드래그 가능하게 설정
      });
      // 레이어에 앵커를 추가합니다.
      layer.add(anchor);

      // 마우스를 올렸을 때 커서 스타일과 테두리 너비를 변경하는 이벤트 리스너를 추가합니다.
      anchor.on('mouseover', function () {
        document.body.style.cursor = 'pointer';
        this.strokeWidth(4);
      });
      // 마우스를 뗐을 때 커서 스타일과 테두리 너비를 원래대로 돌리는 이벤트 리스너를 추가합니다.
      anchor.on('mouseout', function () {
        document.body.style.cursor = 'default';
        this.strokeWidth(2);
      });

      // 앵커를 드래그할 때 점선 라인을 업데이트하는 이벤트 리스너를 추가합니다.
      anchor.on('dragmove', function () {
        updateDottedLines();
      });

      // 앵커를 반환하여 다른 곳에서 사용할 수 있게 합니다.
      return anchor;
    };

    // Konva.Stage 인스턴스를 생성하고 컨테이너 div에 연결합니다.
    const stage = new Konva.Stage({
      container: containerRef.current, // 컨테이너 div에 대한 참조
      width: width, // 스테이지의 너비
      height: height, // 스테이지의 높이
    });

    // 새로운 Konva.Layer 인스턴스를 생성합니다.
    const layer = new Konva.Layer();
    // 스테이지에 레이어를 추가합니다.
    stage.add(layer);

    // 앵커 위치를 기반으로 점선 라인의 포인트를 업데이트하는 함수입니다.
    const updateDottedLines = () => {
      const q = quad; // 이차 곡선 앵커에 대한 참조
      const b = bezier; // 베지어 곡선 앵커에 대한 참조

      // ID로 이차 곡선 라인 경로를 찾습니다.
      const quadLinePath = layer.findOne('#quadLinePath');
      // ID로 베지어 곡선 라인 경로를 찾습니다.
      const bezierLinePath = layer.findOne('#bezierLinePath');

      // 이차 곡선 라인 경로의 포인트를 업데이트합니다.
      quadLinePath.points([
        q.start.x(),
        q.start.y(),
        q.control.x(),
        q.control.y(),
        q.end.x(),
        q.end.y(),
      ]);

      // 베지어 곡선 라인 경로의 포인트를 업데이트합니다.
      bezierLinePath.points([
        b.start.x(),
        b.start.y(),
        b.control1.x(),
        b.control1.y(),
        b.control2.x(),
        b.control2.y(),
        b.end.x(),
        b.end.y(),
      ]);
    };

    // 이차 곡선을 위한 커스텀 모양을 생성합니다.
    const quadraticLine = new Konva.Shape({
      stroke: 'red', // 선의 색상
      strokeWidth: 4, // 선의 너비
      // 모양을 그리기 위한 함수를 정의합니다.
      sceneFunc: (ctx, shape) => {
        ctx.beginPath(); // 새로운 경로를 시작합니다.
        ctx.moveTo(quad.start.x(), quad.start.y()); // 시작점으로 이동합니다.
        ctx.quadraticCurveTo(
          quad.control.x(),
          quad.control.y(),
          quad.end.x(),
          quad.end.y()
        ); // 이차 곡선을 그립니다.
        ctx.fillStrokeShape(shape); // 모양에 스트로크를 적용합니다.
      },
    });
    // 이차 곡선을 레이어에 추가합니다.
    layer.add(quadraticLine);

    // 베지어 곡선을 위한 커스텀 모양을 생성합니다.
    const bezierLine = new Konva.Shape({
      stroke: 'blue', // 선의 색상
      strokeWidth: 5, // 선의 너비
      // 모양을 그리기 위한 함수를 정의합니다.
      sceneFunc: (ctx, shape) => {
        ctx.beginPath(); // 새로운 경로를 시작합니다.
        ctx.moveTo(bezier.start.x(), bezier.start.y()); // 시작점으로 이동합니다.
        ctx.bezierCurveTo(
          bezier.control1.x(),
          bezier.control1.y(),
          bezier.control2.x(),
          bezier.control2.y(),
          bezier.end.x(),
          bezier.end.y(),
        ); // 베지어 곡선을 그립니다.
        ctx.fillStrokeShape(shape); // 모양에 스트로크를 적용합니다.
      },
    });
    // 베지어 곡선을 레이어에 추가합니다.
    layer.add(bezierLine);

    // 이차 곡선의 제어점을 표시하기 위한 점선을 생성합니다.
    const quadLinePath = new Konva.Line({
      dash: [10, 10, 0, 10], // 점선 패턴
      strokeWidth: 3, // 선의 너비
      stroke: 'black', // 선의 색상
      lineCap: 'round', // 선 끝의 모양
      id: 'quadLinePath', // 선의 ID
      opacity: 0.3, // 선의 불투명도
      points: [0, 0], // 선의 초기 포인트
    });
    // 점선을 레이어에 추가합니다.
    layer.add(quadLinePath);

    // 베지어 곡선의 제어점을 표시하기 위한 점선을 생성합니다.
    const bezierLinePath = new Konva.Line({
      dash: [10, 10, 0, 10], // 점선 패턴
      strokeWidth: 3, // 선의 너비
      stroke: 'black', // 선의 색상
      lineCap: 'round', // 선 끝의 모양
      id: 'bezierLinePath', // 선의 ID
      opacity: 0.3, // 선의 불투명도
      points: [0, 0], // 선의 초기 포인트
    });
    // 점선을 레이어에 추가합니다.
    layer.add(bezierLinePath);

    // 이차 곡선 앵커에 대한 참조를 저장하기 위한 특수 객체입니다.
    const quad = {
      start: buildAnchor(60, 30), // 시작 앵커
      control: buildAnchor(240, 110), // 제어 앵커
      end: buildAnchor(80, 160), // 끝 앵커
    };

    // 베지어 곡선 앵커에 대한 참조를 저장하기 위한 특수 객체입니다.
    const bezier = {
      start: buildAnchor(280, 20), // 시작 앵커
      control1: buildAnchor(530, 40), // 첫 번째 제어 앵커
      control2: buildAnchor(480, 150), // 두 번째 제어 앵커
      end: buildAnchor(300, 150), // 끝 앵커
    };

    // 앵커 위치에 맞춰 점선 라인을 업데이트합니다.
    updateDottedLines();
  }, []); // 빈 배열을 의존성으로 하여 컴포넌트가 마운트된 후에만 실행합니다.

  // Konva 스테이지를 위한 div를 렌더링하고, containerRef와 스타일을 적용합니다.
  return <div ref={containerRef} style={{ width: '100%', height: '100vh', backgroundColor: '#f0f0f0' }} />;
};

// 컴포넌트를 기본 내보내기로 내보냅니다.
export default KonvaDemo;
