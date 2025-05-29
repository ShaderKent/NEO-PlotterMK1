import { useEffect, useState } from "react";
import "./App.css";
import Plot from "react-plotly.js";
import type { Orbital_Data, OrbitingBody, PlanetDisplay } from "./types";
import LoadingSpinner from "./LoadingSpinner";

interface Props {
  isLoaded1: Boolean;
  isLoaded2: Boolean;
  setIsLoaded2: Function;
  requestedOrbitTime: number;
  orbitingBodyArr: OrbitingBody[];
  setOrbitingBodyArr: Function;
  planetData: {
    display: PlanetDisplay;
    planets: Orbital_Data[];
  };
  setPlanetData: Function;
}

function OrbitPlot({
  isLoaded1,
  isLoaded2,
  setIsLoaded2,
  requestedOrbitTime,
  orbitingBodyArr,
  setOrbitingBodyArr,
  planetData,
  setPlanetData
}: Props) {
  //State Variables
  const [traceArr, setTraceArr] = useState<Array<object>>([]);
  const [XYZNEO, setXYZNEO] = useState<Array<Array<number>>>([[0], [0], [0]]);
  const [XYZMercury, setXYZMercury] = useState<Array<Array<number>>>([
    [0],
    [0],
    [0]
  ]);
  const [XYZVenus, setXYZVenus] = useState<Array<Array<number>>>([
    [0],
    [0],
    [0]
  ]);
  const [XYZEarth, setXYZEarth] = useState<Array<Array<number>>>([
    [0],
    [0],
    [0]
  ]);
  const [XYZMars, setXYZMars] = useState<Array<Array<number>>>([[0], [0], [0]]);

  // Style Constants
  const bg_gray_800 = "#1e2939";

  const calcAdjMeanAnomaly = (date: number, orbDat: Orbital_Data) => {
    //Calculates Mean anomaly for x date (Mx)
    //Represents how many radians around the orbit have passed starting at periapsis.
    if (orbDat) {
      const Mx =
        (2 * Math.PI * (date - orbDat.date)) / (orbDat.T * 24 * 60 * 60 * 1000);
      return Mx;
    }
  };
  const calcTrueAnomaly = (Mx?: number, orbDat?: Orbital_Data) => {
    if (Mx && orbDat) {
      const v = Mx + 2 * orbDat.e * Math.sin(Mx);
      return v;
    }
  };
  const calcPerifocalPosition = (orbDat: Orbital_Data, index: number) => {
    const rx =
      orbDat.a /
      (1 - orbDat.e * orbDat.e) /
      (1 + orbDat.e * Math.cos(((2 * Math.PI) / 360) * index));
    return rx;
  };
  const calcPerifocalPositionAtDate = (v?: number, orbDat?: Orbital_Data) => {
    if (orbDat && v) {
      const rx =
        orbDat.a / (1 - orbDat.e * orbDat.e) / (1 + orbDat.e * Math.cos(v));
      return rx;
    }
  };
  const calc2DxyEllipse = (rx: number, index: number) => {
    const x = rx * Math.cos(((2 * Math.PI) / 360) * index);
    const y = rx * Math.sin(((2 * Math.PI) / 360) * index);
    return [x, y];
  };
  const calc2DxyEllipsePoint = (rx?: number, v?: number) => {
    if (rx && v) {
      const x = rx * Math.cos(v);
      const y = rx * Math.sin(v);
      return [x, y];
    }
  };
  const calc3DEllipseFrom2D = (array2d?: number[], orbDat?: Orbital_Data) => {
    if (array2d && orbDat) {
      const x =
        array2d[0] *
          (Math.cos(orbDat.p) * Math.cos(orbDat.o) -
            Math.sin(orbDat.p) * Math.cos(orbDat.i) * Math.sin(orbDat.o)) -
        array2d[1] *
          (Math.sin(orbDat.p) * Math.cos(orbDat.o) +
            Math.cos(orbDat.p) * Math.cos(orbDat.i) * Math.sin(orbDat.o));
      const y =
        array2d[0] *
          (Math.cos(orbDat.p) * Math.sin(orbDat.o) +
            Math.sin(orbDat.p) * Math.cos(orbDat.i) * Math.cos(orbDat.o)) +
        array2d[1] *
          (Math.cos(orbDat.p) * Math.cos(orbDat.i) * Math.cos(orbDat.o) -
            Math.sin(orbDat.p) * Math.sin(orbDat.o));
      const z =
        array2d[0] * (Math.sin(orbDat.p) * Math.sin(orbDat.i)) +
        array2d[1] * (Math.cos(orbDat.p) * Math.sin(orbDat.i));
      return [x, y, z];
    }
  };
  const XYZOrbDatCalc = (orbDat?: Orbital_Data) => {
    if (orbDat) {
      let x = [];
      let y = [];
      let z = [];
      for (let i = 0; i < 380; i += 1) {
        const rx = calcPerifocalPosition(orbDat, i);
        const ellipsePoint2d = calc2DxyEllipse(rx, i);
        const coordinatePoint = calc3DEllipseFrom2D(ellipsePoint2d, orbDat);
        if (coordinatePoint) {
          x.push(Number(coordinatePoint[0]));
          y.push(Number(coordinatePoint[1]));
          z.push(Number(coordinatePoint[2]));
        }
      }
      return { x: x, y: y, z: z };
    }
  };
  const XYZPointCalc = (date: number, orbDat: Orbital_Data) => {
    if (orbDat) {
      const Mx = calcAdjMeanAnomaly(date, orbDat);
      const v = calcTrueAnomaly(Mx, orbDat);
      const rx = calcPerifocalPositionAtDate(v, orbDat);
      const ellipsePoint2d = calc2DxyEllipsePoint(rx, v);
      const coordinatePoint = calc3DEllipseFrom2D(ellipsePoint2d, orbDat);
      if (coordinatePoint) {
        return {
          x: coordinatePoint[0],
          y: coordinatePoint[1],
          z: coordinatePoint[2]
        };
      }
    }
  };
  useEffect(() => {
    console.log("Trace Generating useEffect triggered: Top");
    //If API requests have resolved: calculate trace data and immutably update the OrbitingBody.orbit data.
    if (isLoaded1) {
      console.log("Trace Generating useEffect triggered: isLoaded1 loop");
      let copyOrbBodyArr = orbitingBodyArr?.slice();
      copyOrbBodyArr?.forEach((body) => {
        body.orbitalData.orbit = XYZOrbDatCalc(body?.orbitalData);
      });
      setOrbitingBodyArr(copyOrbBodyArr);
      console.log(copyOrbBodyArr[0]);
      //Update conditional rendering of the Plot
      setIsLoaded2(true);
    }
  }, [isLoaded1]); //Dependent on API ID response completion

  //Calculation / handling of Earth's orbit trace and initial point generation
  useEffect(() => {
    console.log("earthXYZ and EarthTrace useEffect: none");
    if (planetData.planets[0] && planetData.display.mercury == true) {
      const mercuryTraceData = XYZOrbDatCalc(planetData.planets[0]);
      setPlanetData({
        ...planetData,
        planets: [
          ...planetData.planets,
          (planetData.planets[0].orbit = mercuryTraceData)
        ]
      });
      const mercuryXYZ = XYZPointCalc(
        requestedOrbitTime,
        planetData.planets[0]
      );
      if (mercuryXYZ) {
        setXYZMercury([[mercuryXYZ.x], [mercuryXYZ.y], [mercuryXYZ.z]]);
      }
    }
    if (planetData.planets[1] && planetData.display.venus == true) {
      const venusTraceData = XYZOrbDatCalc(planetData.planets[1]);
      setPlanetData({
        ...planetData,
        planets: [
          ...planetData.planets,
          (planetData.planets[1].orbit = venusTraceData)
        ]
      });
      const venusXYZ = XYZPointCalc(requestedOrbitTime, planetData.planets[1]);
      if (venusXYZ) {
        setXYZVenus([[venusXYZ.x], [venusXYZ.y], [venusXYZ.z]]);
      }
    }
    if (planetData.planets[2] && planetData.display.earth == true) {
      const earthTraceData = XYZOrbDatCalc(planetData.planets[2]);
      setPlanetData({
        ...planetData,
        planets: [
          ...planetData.planets,
          (planetData.planets[2].orbit = earthTraceData)
        ]
      });
      const earthXYZ = XYZPointCalc(requestedOrbitTime, planetData.planets[2]);
      if (earthXYZ) {
        setXYZEarth([[earthXYZ.x], [earthXYZ.y], [earthXYZ.z]]);
      }
    }
    if (planetData.planets[3] && planetData.display.mars == true) {
      const marsTraceData = XYZOrbDatCalc(planetData.planets[3]);
      setPlanetData({
        ...planetData,
        planets: [
          ...planetData.planets,
          (planetData.planets[3].orbit = marsTraceData)
        ]
      });
      const marsXYZ = XYZPointCalc(requestedOrbitTime, planetData.planets[3]);
      if (marsXYZ) {
        setXYZMars([[marsXYZ.x], [marsXYZ.y], [marsXYZ.z]]);
      }
    }
  }, []); //runs once on mount

  // Point Coordinates
  // NEO Coordinate
  useEffect(() => {
    console.log(
      "NEOXYZ useEffect: requestedOrbitTime, isLoaded1 => isLoaded? : ReqOrbitTime:",
      requestedOrbitTime,
      " isLoaded1: ",
      isLoaded1
    );
    if (isLoaded1) {
      console.log("Arrived at NEO");
      const NEOXYZ = XYZPointCalc(
        requestedOrbitTime,
        orbitingBodyArr[0].orbitalData
      );

      if (NEOXYZ) {
        setXYZNEO([[NEOXYZ.x], [NEOXYZ.y], [NEOXYZ.z]]);
      }
    }
  }, [isLoaded1, requestedOrbitTime]); //Dependent on API ID response completion and requestedOrbitTime

  // Earth Coordinate
  useEffect(() => {
    if (planetData.display.mercury == true) {
      const mercuryXYZ = XYZPointCalc(
        requestedOrbitTime,
        planetData.planets[0]
      );
      if (mercuryXYZ) {
        setXYZMercury([[mercuryXYZ.x], [mercuryXYZ.y], [mercuryXYZ.z]]);
      }
    }
    if (planetData.display.venus == true) {
      const venusXYZ = XYZPointCalc(requestedOrbitTime, planetData.planets[1]);
      if (venusXYZ) {
        setXYZVenus([[venusXYZ.x], [venusXYZ.y], [venusXYZ.z]]);
      }
    }
    if (planetData.display.earth == true) {
      const earthXYZ = XYZPointCalc(requestedOrbitTime, planetData.planets[2]);
      if (earthXYZ) {
        setXYZEarth([[earthXYZ.x], [earthXYZ.y], [earthXYZ.z]]);
      }
    }
    if (planetData.display.mars == true) {
      const marsXYZ = XYZPointCalc(requestedOrbitTime, planetData.planets[3]);
      if (marsXYZ) {
        setXYZMars([[marsXYZ.x], [marsXYZ.y], [marsXYZ.z]]);
      }
    }
  }, [requestedOrbitTime]); //dependent upon requestedOrbitTime

  //Trace Definitions (for Plotly)
  const NEOtrace = {
    x: orbitingBodyArr[0]?.orbitalData.orbit?.x,
    y: orbitingBodyArr[0]?.orbitalData.orbit?.y,
    z: orbitingBodyArr[0]?.orbitalData.orbit?.z,
    type: "scatter3d",
    mode: "lines",
    marker: { color: "red" },
    line: { shape: "spline", width: 2, dash: "solid" }
  };
  const NEOMarker = {
    x: XYZNEO[0],
    y: XYZNEO[1],
    z: XYZNEO[2],
    hoverinfo: "text",
    text: "NEO",
    type: "scatter3d",
    mode: "markers",
    marker: { color: "red", size: 3 }
  };
  const mercuryTrace = {
    x: planetData.planets[0]?.orbit?.x,
    y: planetData.planets[0]?.orbit?.y,
    z: planetData.planets[0]?.orbit?.z,
    type: "scatter3d",
    mode: "lines",
    marker: { color: "orange" },
    line: { shape: "spline", width: 2, dash: "solid" }
  };
  const mercuryMarker = {
    x: XYZMercury[0],
    y: XYZMercury[1],
    z: XYZMercury[2],
    hoverinfo: "text",
    text: "Mercury",
    type: "scatter3d",
    mode: "markers",
    marker: { color: "orange", size: 5 }
  };
  const venusTrace = {
    x: planetData.planets[1]?.orbit?.x,
    y: planetData.planets[1]?.orbit?.y,
    z: planetData.planets[1]?.orbit?.z,
    type: "scatter3d",
    mode: "lines",
    marker: { color: "purple" },
    line: { shape: "spline", width: 2, dash: "solid" }
  };
  const venusMarker = {
    x: XYZVenus[0],
    y: XYZVenus[1],
    z: XYZVenus[2],
    hoverinfo: "text",
    text: "Venus",
    type: "scatter3d",
    mode: "markers",
    marker: { color: "purple", size: 5 }
  };
  const earthTrace = {
    x: planetData.planets[2]?.orbit?.x,
    y: planetData.planets[2]?.orbit?.y,
    z: planetData.planets[2]?.orbit?.z,
    type: "scatter3d",
    mode: "lines",
    marker: { color: "green" },
    line: { shape: "spline", width: 2, dash: "solid" }
  };
  const earthMarker = {
    x: XYZEarth[0],
    y: XYZEarth[1],
    z: XYZEarth[2],
    hoverinfo: "text",
    text: "Earth",
    type: "scatter3d",
    mode: "markers",
    marker: { color: "green", size: 5 }
  };
  const marsTrace = {
    x: planetData.planets[3]?.orbit?.x,
    y: planetData.planets[3]?.orbit?.y,
    z: planetData.planets[3]?.orbit?.z,
    type: "scatter3d",
    mode: "lines",
    marker: { color: "blue" },
    line: { shape: "spline", width: 2, dash: "solid" }
  };
  const marsMarker = {
    x: XYZMars[0],
    y: XYZMars[1],
    z: XYZMars[2],
    hoverinfo: "text",
    text: "Mars",
    type: "scatter3d",
    mode: "markers",
    marker: { color: "blue", size: 5 }
  };
  const sunMarker = {
    x: [0],
    y: [0],
    z: [0],
    hoverinfo: "text",
    text: "Sun",
    type: "scatter3d",
    mode: "markers",
    marker: { color: "yellow", size: 12 }
  };

  //Plotly Trace/Data Array
  useEffect(() => {
    setTraceArr([
      NEOtrace,
      NEOMarker,
      sunMarker,
      mercuryTrace,
      mercuryMarker,
      venusTrace,
      venusMarker,
      earthTrace,
      earthMarker,
      marsTrace,
      marsMarker
    ]);
  }, [isLoaded2]); //Waits for calculations to complete

  // Updates the traceArr to whatever is currently listed as displayed
  useEffect(() => {
    const tempTraceArray = [NEOtrace, NEOMarker, sunMarker];
    if (planetData.display.mercury)
      tempTraceArray.push(mercuryTrace, mercuryMarker);
    if (planetData.display.venus) tempTraceArray.push(venusTrace, venusMarker);
    if (planetData.display.earth) tempTraceArray.push(earthTrace, earthMarker);
    if (planetData.display.mars) tempTraceArray.push(marsTrace, marsMarker);
    setTraceArr(tempTraceArray);
  }, [planetData.display, requestedOrbitTime]);

  return (
    <div className="bg-gray-900 static">
      {isLoaded2 ? null : (
        <div id="loadingBox" className="absolute">
          <p className="m-auto">
            <LoadingSpinner />
          </p>
        </div>
      )}
      {isLoaded2 ? (
        <div
          id="plot-container"
          className="absolute right-0 bottom-2 top-20 md:top-14 w-full"
        >
          <Plot
            divId="mainPlot"
            className="w-full h-full"
            data={traceArr}
            useResizeHandler
            layout={{
              // autosize: true,
              margin: {
                t: 0,
                b: 0,
                l: 0,
                r: 0
              },
              paper_bgcolor: bg_gray_800,
              showlegend: false,
              uirevision: "true", //Look into this, allows for zoom to persist with more setup (keep state)
              yaxis: {
                color: "#fff",
                tickmode: "linear",
                ticks: "outside",
                scaleanchor: "y"
              },
              xaxis: {
                tickmode: "linear"
              },
              modebar: {
                orientation: "v",
                remove: ["resetCameraLastSave3d"]
              },
              scene: {
                xaxis: {
                  range: [-3.0, 3.0],
                  color: "#fff"
                },
                yaxis: {
                  range: [-3.0, 3.0],
                  color: "#fff"
                },
                zaxis: {
                  range: [-3.0, 3.0],
                  color: "#fff"
                },
                aspectratio: {
                  x: 1,
                  y: 1,
                  z: 1
                }
              }
            }}
            config={{ responsive: true }}
          />
        </div>
      ) : null}
    </div>
  );
}

export default OrbitPlot;
