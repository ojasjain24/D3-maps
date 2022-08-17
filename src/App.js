import "./App.css";
import { WorldMap } from "./worldMap";

function App() {
  // const Arc = d3
  //   .arc()
  //   .innerRadius(90)
  //   .outerRadius(100)
  //   .startAngle(0)
  //   .endAngle(Math.PI * 2);

  return (
    <div className="App">
      <WorldMap x={0} y={0} />
    </div>
  );
}

export default App;
