import React, { useRef, useEffect, useState } from 'react';
import Konva from 'konva';

const KonvaDemo = () => {
  const containerRef = useRef(null);
  const [lineData, setLineData] = useState({ startX: '', startY: '', endX: '', endY: '' });
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const anchorsRef = useRef([]);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const stage = new Konva.Stage({
      container: containerRef.current,
      width: width,
      height: height,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    stageRef.current = stage;
    layerRef.current = layer;
  }, []);

  const buildAnchor = (x, y) => {
    const layer = layerRef.current;

    const anchor = new Konva.Circle({
      x: x,
      y: y,
      radius: 20,
      stroke: '#666',
      fill: '#ddd',
      strokeWidth: 2,
      draggable: true,
    });
    layer.add(anchor);

    anchor.on('mouseover', function () {
      document.body.style.cursor = 'pointer';
      this.strokeWidth(4);
    });
    anchor.on('mouseout', function () {
      document.body.style.cursor = 'default';
      this.strokeWidth(2);
    });

    anchor.on('dragmove', function () {
      updateDottedLines();
      highlightOverlappingAnchors(this);
    });

    anchor.on('dragend', function () {
      mergeAnchors(this);
    });

    return anchor;
  };

  const updateDottedLines = () => {
    anchorsRef.current.forEach(({ line, start, end }) => {
      line.points([start.x(), start.y(), end.x(), end.y()]);
    });
    layerRef.current.batchDraw();
  };

  const highlightOverlappingAnchors = (draggedAnchor) => {
    const stage = stageRef.current;
    stage.find('Circle').forEach((anchor) => {
      if (anchor === draggedAnchor) return;
      if (isOverlapping(draggedAnchor, anchor)) {
        anchor.stroke('#ff0000');
      } else {
        anchor.stroke('#666');
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

    stage.find('Circle').forEach((anchor) => {
      if (anchor === draggedAnchor) return;
      if (isOverlapping(draggedAnchor, anchor)) {
        updateAnchorReferences(draggedAnchor, anchor);
        draggedAnchor.destroy(); // Remove the dragged anchor
        layer.batchDraw();
        merged = true;
      }
    });
    if (!merged) {
      draggedAnchor.stroke('#666');
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
    console.log(count)
    updateDottedLines();
  };

  const createNewAnchors = () => {
    const { startX, startY, endX, endY } = lineData;

    if (startX === '' || startY === '' || endX === '' || endY === '') {
      alert('Please fill all the coordinates');
      return;
    }

    const parsedStartX = parseFloat(startX);
    const parsedStartY = parseFloat(startY);
    const parsedEndX = parseFloat(endX);
    const parsedEndY = parseFloat(endY);

    const startAnchor = buildAnchor(parsedStartX, parsedStartY);
    const endAnchor = buildAnchor(parsedEndX, parsedEndY);

    const newLine = new Konva.Line({
      points: [parsedStartX, parsedStartY, parsedEndX, parsedEndY],
      stroke: 'black',
      strokeWidth: 2,
      lineCap: 'round',
      dash: [10, 10, 0, 10],
      opacity: 0.3,
    });
    const layer = layerRef.current;
    layer.add(newLine);

    anchorsRef.current.push({ start: startAnchor, end: endAnchor, line: newLine });
    layer.batchDraw();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLineData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div>
      <div>
        <input
          type="text"
          name="startX"
          value={lineData.startX}
          onChange={handleChange}
          placeholder="Start X"
        />
        <input
          type="text"
          name="startY"
          value={lineData.startY}
          onChange={handleChange}
          placeholder="Start Y"
        />
        <input
          type="text"
          name="endX"
          value={lineData.endX}
          onChange={handleChange}
          placeholder="End X"
        />
        <input
          type="text"
          name="endY"
          value={lineData.endY}
          onChange={handleChange}
          placeholder="End Y"
        />
        <button onClick={createNewAnchors}>Create Anchors</button>
      </div>
      <div ref={containerRef} style={{ width: '100%', height: '100vh', backgroundColor: '#f0f0f0' }} />
    </div>
  );
};

export default KonvaDemo;
