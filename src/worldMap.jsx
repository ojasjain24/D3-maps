import React, { useState, useRef, useEffect, useCallback } from "react";
import { json } from "d3";
import { feature, mesh } from "topojson";
import { Marks } from "./Marks";
import "./map.css";
import { Cities } from "./Cities";

const jsonUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

export const WorldMap = (x, y) => {
  const [data, setData] = useState(null);
  const cities = Cities();

  useEffect(() => {
    json(jsonUrl).then((topology) => {
      const { countries, land } = topology.objects;
      setData({
        land: feature(topology, land),
        interiors: mesh(topology, countries, (a, b) => a !== b),
      });
    });
  }, []);

  if (!data || !cities) {
    return <pre>Loading...</pre>;
  }
  console.log(data);

  return (
    <div>
      <Marks data={data} x={0} y={0} cities={cities} />
    </div>
  );
};
