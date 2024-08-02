// React와 Konva에서 필요한 라이브러리와 훅을 가져오기
import React, { useRef, useEffect } from 'react';
import Konva from 'konva';

// KonvaDemo라는 함수형 컴포넌트 정의
const KonvaDemo = () => {
  // useRef 훅을 사용하여 컨테이너 div에 대한 참조 생성
  const containerRef = useRef(null);

  // 컴포넌트가 마운트된 후 코드를 실행하기 위해 useEffect 훅 사용
  useEffect(() => {
    // 창의 너비와 높이 가져오기
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 주어진 (x, y) 위치에 앵커 포인트를 만드는 함수
    const buildAnchor = (x, y) => {
      // 앵커에 대한 새로운 Konva.Circle 인스턴스 생성
      const anchor = new Konva.Circle({
        x: x, // 앵커의 x 좌표
        y: y, // 앵커의 y 좌표
        radius: 10, // 원의 반지름
        stroke: '#666', // 원 테두리의 색상
        fill: '#ddd', // 원을 채울 색상
        strokeWidth: 2, // 원 테두리의 너비
        draggable: true, // 원을 드래그 가능하게 설정
      });
      // 레이어에 앵커 추가
      layer.add(anchor);

      // 마우스오버 이벤트 리스너 추가하여 커서 스타일과 테두리 너비 변경
      anchor.on('mouseover', function () {
        document.body.style.cursor = 'pointer';
        this.strokeWidth(4);
      });
      // 마우스아웃 이벤트 리스너 추가하여 커서 스타일과 테두리 너비 재설정
      anchor.on('mouseout', function () {
        document.body.style.cursor = 'default';
        this.strokeWidth(2);
      });

      // 드래그 이동 이벤트 리스너 추가하여 사각형 업데이트
      anchor.on('dragmove', function () {
        updateRectangles();
      });

      // 앵커 반환하여 다른 곳에서 사용할 수 있도록 설정
      return anchor;
    };

    // 새로운 Konva.Stage 인스턴스를 생성하고 컨테이너 div에 연결
    const stage = new Konva.Stage({
      container: containerRef.current, // 컨테이너 div에 대한 참조
      width: width, // 스테이지의 너비
      height: height, // 스테이지의 높이
    });

    // 새로운 Konva.Layer 인스턴스 생성
    const layer = new Konva.Layer();
    // 레이어를 스테이지에 추가
    stage.add(layer);

    // 앵커 위치를 기준으로 사각형의 위치와 크기를 업데이트하는 함수
    const updateRectangles = () => {
      const q = quad; // 이차 곡선 앵커에 대한 참조
      const b = bezier; // 베지어 곡선 앵커에 대한 참조

      // ID로 사각형 찾기
      const quadRect = layer.findOne('#quadRect');
      const bezierRect = layer.findOne('#bezierRect');

      // 이차 사각형의 위치와 크기 업데이트
      const quadMidX = (q.start.x() + q.end.x()) / 2;
      const quadMidY = (q.start.y() + q.end.y()) / 2;
      const quadWidth = Math.hypot(q.end.x() - q.start.x(), q.end.y() - q.start.y());
      const quadAngle = Math.atan2(q.end.y() - q.start.y(), q.end.x() - q.start.x()) * (180 / Math.PI);

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
      const bezierWidth = Math.hypot(b.end.x() - b.start.x(), b.end.y() - b.start.y());
      const bezierAngle = Math.atan2(b.end.y() - b.start.y(), b.end.x() - b.start.x()) * (180 / Math.PI);

      bezierRect.position({
        x: bezierMidX,
        y: bezierMidY,
      });
      bezierRect.size({ width: bezierWidth, height: 20 });
      bezierRect.offsetX(bezierWidth / 2);
      bezierRect.offsetY(10);
      bezierRect.rotation(bezierAngle);
    };

    // 이차 점들에 대한 사각형 생성
    const quadRect = new Konva.Rect({
      stroke: 'black', // 사각형 테두리의 색상
      strokeWidth: 4, // 사각형 테두리의 너비
      id: 'quadRect', // 사각형의 ID
    });
    // 레이어에 사각형 추가
    layer.add(quadRect);

    // 베지어 점들에 대한 사각형 생성
    const bezierRect = new Konva.Rect({
      stroke: 'black', // 사각형 테두리의 색상
      strokeWidth: 4, // 사각형 테두리의 너비
      id: 'bezierRect', // 사각형의 ID
    });
    // 레이어에 사각형 추가
    layer.add(bezierRect);

    // 이차 사각형의 앵커에 대한 참조를 저장하기 위한 특수 객체
    const quad = {
      start: buildAnchor(60, 30), // 시작 앵커
      end: buildAnchor(240, 110), // 끝 앵커
    };

    // 베지어 사각형의 앵커에 대한 참조를 저장하기 위한 특수 객체
    const bezier = {
      start: buildAnchor(280, 20), // 시작 앵커
      end: buildAnchor(530, 40), // 끝 앵커
    };

    // 앵커 위치에 맞게 사각형을 업데이트
    updateRectangles();
  }, []); // 빈 의존성 배열을 사용하여 컴포넌트가 마운트된 후 한 번만 실행

  // Konva 스테이지를 보유할 div를 렌더링하고, containerRef에 대한 참조와 일부 스타일을 설정
  return <div ref={containerRef} style={{ width: '100%', height: '100vh', backgroundColor: '#f0f0f0' }} />;
};

// 컴포넌트를 기본 내보내기로 내보내기
export default KonvaDemo;
