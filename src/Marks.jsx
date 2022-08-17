import "./map.css";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { geoPath, geoGraticule, geoOrthographic, geoEqualEarth } from "d3";
import { select, pointer } from "d3-selection";
import "./App.css";
import * as d3 from "d3";
import Exchange from "./exchange.png";
import { Container, Button } from "react-floating-action-button";

// const config = {
//   speed: 0.01,
//   verticalTilt: 0,
//   horizontalTilt: 0,
// };

// config.addEventListner("mousemove", (e) => OnMouseMove(e));

export const Marks = ({ data: { land, interiors }, x, y, cities }) => {
  const [VerticalTilt, setVerticalTilt] = useState(0);
  const [HorizontalTilt, setHorizontalTilt] = useState(0);
  const [drawing, setDrawing] = useState(false);
  const [ortho, setOrtho] = useState(false);

  // const [currentX, setCurrentX] = useState(x);
  // const [currentY, setCurrentY] = useState(y);
  // const [newX, setnewX] = useState(0);
  // const [newY, setnewY] = useState(0);

  const projection = ortho
    ? geoOrthographic()
        .scale(250)
        .translate([800, 350])
        .rotate([HorizontalTilt, VerticalTilt, 0])
        .center([0, 0])
    : geoEqualEarth()
        .scale(250)
        .translate([800, 350])
        .rotate([HorizontalTilt, VerticalTilt, 0])
        .center([0, 0]);

  // const start = Date.now();
  // projection.rotate([1e-2 * (Date.now() - start), -15]);

  const path = geoPath(projection);
  const graticule = geoGraticule();

  function OnMouseMove(e) {
    console.log(e);
    setVerticalTilt(e.clientY);
    setHorizontalTilt(e.clientX);
  }

  // let svg = document.querySelector("#svg");
  // svg.addEventListener((e) => OnMouseMove(e));
  const drawingAreaRef = useRef();

  const mouseMove = useCallback(
    function (event) {
      const [x, y] = d3.pointer(event);
      // setnewX(x);
      // setnewY(y);
      if (drawing) {
        setHorizontalTilt(x);
        setVerticalTilt(y);
        // setCurrentX(x);
        // setCurrentY(y);
      }
    },
    [drawing]
  );

  useEffect(() => {
    const area = d3.select(drawingAreaRef.current);
    area.on("mousemove", mouseMove);
    return () => area.on("mousemove", null);
  }, [mouseMove]);

  function enableDrawing() {
    setDrawing(true);
  }

  function disableDrawing() {
    setDrawing(false);
  }

  var div = select("g");
  div.on("click", createDot);
  function createDot() {
    // Using d3.mouse() function
    let pos = pointer(this);
    console.log(pos);
    select("div")
      .append("div")
      .style("background-color", "white")
      .style("position", "absolute")
      .style("margin-left", `${pos[0] - 10}px`)
      .style("margin-right", `${pos[0] - 10}px`)
      .style("margin-top", `${pos[1] - 10}px`)
      .style("margin-bottom", `${pos[1] - 10}px`);
  }

  return (
    <>
      <svg
        width="100%"
        height="1000px"
        preserveAspectRatio="none"
        draggable="true"
        onDrag={(e) => OnMouseMove(e)}
        onDoubleClick={(e) => OnMouseMove(e)}
      >
        <g
          className="marks"
          id="marks"
          transform={`translate(${x}, ${y})`}
          ref={drawingAreaRef}
          onMouseDown={enableDrawing}
          onMouseUp={disableDrawing}
        >
          <path className="sphere" d={path({ type: "Sphere" })} />
          <path className="graticules" d={path(graticule())} />
          {land.features.map((feature) => (
            <path className="land" d={path(feature)} />
          ))}
          <path className="interiors" d={path(interiors)} />
          {!ortho
            ? cities.map((d) => {
                const [x, y] = projection([d.lng, d.lat]);
                return <circle cx={x} cy={y} r={1.5} />;
              })
            : null}
        </g>
      </svg>

      <Container>
        <Button
          tooltip="Change Perspective"
          icon={Exchange}
          rotate={true}
          onClick={() => setOrtho(!ortho)}
        />
      </Container>
    </>
  );
};
