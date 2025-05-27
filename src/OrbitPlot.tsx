import { useEffect, useState } from "react";
import "./App.css";
import Plot from "react-plotly.js";
import type { Orbital_Data, OrbitingBody, PlanetDisplay } from "./types";

// TODO Add Redux to final project
//  X   Add plotly
//  X Figure out how to graph an orbit with plotly
//  X  Pull data from api NASA
//      Cleanup Code/move API request to another file
//  X   Graph that data
//  X  Make basic UI
//      Confirm Accuracy of Earth's Data
//  X   Add plot for orbital body
//  X    cycle through different api objects
//  X   Add point arrays to state?
//      Dynamic grid axis size

// NASA API Key: YJK8aZ88VJ3LvbCoC9swoyw3aHI4a0cSpcldpxgj
// https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=DEMO_KEY

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
  // Constants
  // const t = 2451545 * (24 * 60 * 60 * 1000); //January 1, 4713 BC ending on Jan 1 2000 at 12:00pm in seconds
  // const degToRad = Math.PI / 180;
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
  // const calcAdjMeanAnomaly = (
  //   Tx: number | undefined,
  //   orbDat?: Orbital_Data
  // ) => {
  //   if (orbDat && Tx) {
  //     const Mx = (2 * Math.PI * (Tx - t)) / (orbDat?.T * 24 * 60 * 60 * 1000);
  //     return Mx;
  //   }
  // };
  const calcAdjMeanAnomaly = (date: number, orbDat: Orbital_Data) => {
    if (orbDat) {
      const Mx =
        (2 * Math.PI * (date - orbDat.date)) / (orbDat.T * 24 * 60 * 60 * 1000);
      return Mx;
    }
  };
  const calcTrueAnomaly = (Mx?: number, orbDat?: Orbital_Data) => {
    if (Mx && orbDat) {
      // Mx = Mx * degToRad;
      const v = Mx + 2 * orbDat.e * Math.sin(Mx);
      return v;
    }
  };
  //New Calcs
  const calcPerifocalPosition = (orbDat: Orbital_Data, index: number) => {
    const rx =
      orbDat.a /
      (1 - orbDat.e * orbDat.e) /
      (1 + orbDat.e * Math.cos(((2 * Math.PI) / 360) * index));
    return rx;
  };

  // const calcPerifocalPositionAtDate = (orbDat: Orbital_Data, date: number) => {
  //   const remainingOrbitArc =
  //     ((date - orbDat.date) / (24 * 60 * 60 * 1000)) % orbDat.T;
  //   console.log("remainingOrbArc: ", remainingOrbitArc);
  //   const rx =
  //     orbDat.a /
  //     (1 - orbDat.e * orbDat.e) /
  //     (1 + orbDat.e * Math.cos(((2 * Math.PI) / orbDat.T) * remainingOrbitArc));
  //   return [rx, remainingOrbitArc];
  // };

  const calcPerifocalPositionAtDate2 = (v?: number, orbDat?: Orbital_Data) => {
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

  // const calc2DxyEllipsePoint = (
  //   rx: number,
  //   remainingOrbArc: number = 1,
  //   orbDat: Orbital_Data
  // ) => {
  //   const x = rx * Math.cos(((2 * Math.PI) / orbDat.T) * remainingOrbArc);
  //   const y = rx * Math.sin(((2 * Math.PI) / orbDat.T) * remainingOrbArc);
  //   return [x, y];
  // };

  const calc2DxyEllipsePoint2 = (rx?: number, v?: number) => {
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

  const XYZNewOrbDatCalc = (orbDat?: Orbital_Data) => {
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

  // const XYZNewPointCalc = (date: number, orbDat?: Orbital_Data) => {
  //   if (orbDat) {
  //     const rxAndRadRemainingArr = calcPerifocalPositionAtDate(orbDat, date);
  //     const ellipsePoint2d = calc2DxyEllipsePoint(
  //       rxAndRadRemainingArr[0],
  //       rxAndRadRemainingArr[1],
  //       orbDat
  //     );
  //     const coordinatePoint = calc3DEllipseFrom2D(ellipsePoint2d, orbDat);
  //     if (coordinatePoint) {
  //       return {
  //         x: coordinatePoint[0],
  //         y: coordinatePoint[1],
  //         z: coordinatePoint[2]
  //       };
  //     }
  //   }
  // };

  const XYZNewPointCalc2 = (date: number, orbDat: Orbital_Data) => {
    if (orbDat) {
      const Mx = calcAdjMeanAnomaly(date, orbDat);
      const v = calcTrueAnomaly(Mx, orbDat);
      const rx = calcPerifocalPositionAtDate2(v, orbDat);
      const ellipsePoint2d = calc2DxyEllipsePoint2(rx, v);
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

  //Calculation of derived values
  // const getAdjustedT2 = (value: string, change: number, date: number) => {
  //   const secondsSinceJ200 = date - t;
  //   switch (value) {
  //     case "day":
  //       const timeChange = change * 24 * 60 * 60 * 1000;
  //       return secondsSinceJ200 + timeChange;
  //       break;
  //     default:
  //       break;
  //   }
  // };

  // const calcTrueAnomaly2 = (Mx: number | undefined, orbDat?: Orbital_Data) => {
  //   if (Mx && orbDat) {
  //     Mx = Mx * degToRad;
  //     const e = Number(orbDat.e);
  //     const i1 = 2 * e - e ** (3 / 4) * Math.sin(Mx);
  //     const i2 = (5 / 4) * e ** 2 * Math.sin(2 * Mx);
  //     const i3 = (13 / 12) * e ** 3 * Math.sin(3 * Mx);
  //     const i4 = (103 / 96) * e ** 4 * Math.sin(4 * Mx);
  //     const i5 = (1097 / 960) * e ** 5 * Math.sin(5 * Mx);
  //     const v = Mx + (180 / Math.PI) * (i1 + i2 + i3 + i4 + i5);
  //     return v; //Value in degrees
  //   }
  // };
  // const calcMeanDistance = (orbDat?: Orbital_Data) => {
  //   if (orbDat) {
  //     const aX = orbDat.a / (1 - orbDat.e);
  //     return aX; //Value is in A.U.   //NOT SURE IF THIS WORKS
  //   }
  // };

  // const calcHelioDist = (
  //   ax: number | undefined,
  //   v: number | undefined,
  //   orbDat?: Orbital_Data
  // ) => {
  //   if (ax && v && orbDat) {
  //     const r = (ax * (1 - orbDat.e ** 2)) / (1 + orbDat.e * Math.cos(v)); //Currently dont have Ex updated to use ax
  //     return r; //Value is in A.U.
  //   }
  // };
  // const calcXYZ = (
  //   //Calculates the rectangular coordinates from angular coordinates
  //   r: number | undefined,
  //   v: number | undefined,
  //   orbDat?: Orbital_Data
  // ) => {
  //   if (r && v && orbDat) {
  //     const o = Number(orbDat.o) * degToRad;
  //     const p = Number(orbDat.p) * degToRad;
  //     const i = Number(orbDat.i) * degToRad;
  //     const x =
  //       r *
  //       (Math.cos(o) * Math.cos(v + p - o) -
  //         Math.sin(o) * Math.sin(v + p - o) * Math.cos(i));
  //     const y =
  //       r *
  //       (Math.sin(o) * Math.cos(v + p - o) +
  //         Math.cos(o) * Math.sin(v + p - o) * Math.cos(i));
  //     const z = r * (Math.sin(v + p - o) * Math.sin(i));
  //     return [x, y, z]; //Value is in A.U.
  //   }
  // };

  //Coordinate Generation Functions
  // const XYZFromOrbData = (orbDat?: Orbital_Data) => {
  //   if (orbDat) {
  //     let x = [];
  //     let y = [];
  //     let z = [];
  //     for (let i = 0; i < orbDat.T + 10; i += 1) {
  //       const Tx = getAdjustedT2("day", i, orbDat.date);
  //       const Mx = calcAdjMeanAnomaly(Tx, orbDat);
  //       const v = calcTrueAnomaly(Mx, orbDat);
  //       const ax = calcMeanDistance(orbDat);
  //       const rx = calcHelioDist(ax, v, orbDat);
  //       const coordinatePoint = calcXYZ(rx, v, orbDat);
  //       if (coordinatePoint) {
  //         x.push(Number(coordinatePoint[0]));
  //         y.push(Number(coordinatePoint[1]));
  //         z.push(Number(coordinatePoint[2]));
  //       }
  //     }
  //     return { x: x, y: y, z: z };
  //   }
  // };

  // const XYZForSpecificDate = (date: number, orbDat: Orbital_Data) => {
  //   const Tx = Number(date);
  //   const Mx = calcAdjMeanAnomaly(Tx, orbDat);
  //   const v = calcTrueAnomaly(Mx, orbDat);
  //   const a = calcMeanDistance(orbDat);
  //   const r = calcHelioDist(a, v, orbDat);
  //   const coordinatePoint = calcXYZ(r, v, orbDat);
  //   return coordinatePoint;
  // };

  //   Coordinate Generation
  //   Traces
  // useEffect(() => {
  //   console.log("Trace Generating useEffect triggered: Top");
  //   //If API requests have resolved: calculate trace data and immutably update the OrbitingBody.orbit data.
  //   if (isLoaded1) {
  //     console.log("Trace Generating useEffect triggered: isLoaded1 loop");
  //     let copyOrbBodyArr = orbitingBodyArr?.slice();
  //     copyOrbBodyArr?.forEach((body) => {
  //       body.orbitalData.orbit = XYZFromOrbData(body?.orbitalData);
  //     });
  //     setOrbitingBodyArr(copyOrbBodyArr);
  //     console.log(copyOrbBodyArr[0]);
  //     //Update conditional rendering of the Plot
  //     setIsLoaded2(true);
  //   }
  // }, [isLoaded1]); //Dependent on API ID response completion

  useEffect(() => {
    console.log("Trace Generating useEffect triggered: Top");
    //If API requests have resolved: calculate trace data and immutably update the OrbitingBody.orbit data.
    if (isLoaded1) {
      console.log("Trace Generating useEffect triggered: isLoaded1 loop");
      let copyOrbBodyArr = orbitingBodyArr?.slice();
      copyOrbBodyArr?.forEach((body) => {
        body.orbitalData.orbit = XYZNewOrbDatCalc(body?.orbitalData);
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
      const mercuryTraceData = XYZNewOrbDatCalc(planetData.planets[0]);
      setPlanetData({
        ...planetData,
        planets: [
          ...planetData.planets,
          (planetData.planets[0].orbit = mercuryTraceData)
        ]
      });
      const mercuryXYZ = XYZNewPointCalc2(
        requestedOrbitTime,
        planetData.planets[0]
      );
      // if (mercuryXYZ) {
      //   setXYZMercury([[mercuryXYZ[0]], [mercuryXYZ[1]], [mercuryXYZ[2]]]);
      // }
      if (mercuryXYZ) {
        setXYZMercury([[mercuryXYZ.x], [mercuryXYZ.y], [mercuryXYZ.z]]);
      }
    }
    if (planetData.planets[1] && planetData.display.venus == true) {
      const venusTraceData = XYZNewOrbDatCalc(planetData.planets[1]);
      setPlanetData({
        ...planetData,
        planets: [
          ...planetData.planets,
          (planetData.planets[1].orbit = venusTraceData)
        ]
      });
      const venusXYZ = XYZNewPointCalc2(
        requestedOrbitTime,
        planetData.planets[1]
      );
      // if (venusXYZ) {
      //   setXYZVenus([[venusXYZ[0]], [venusXYZ[1]], [venusXYZ[2]]]);
      // }
      if (venusXYZ) {
        setXYZVenus([[venusXYZ.x], [venusXYZ.y], [venusXYZ.z]]);
      }
    }
    if (planetData.planets[2] && planetData.display.earth == true) {
      const earthTraceData = XYZNewOrbDatCalc(planetData.planets[2]);
      setPlanetData({
        ...planetData,
        planets: [
          ...planetData.planets,
          (planetData.planets[2].orbit = earthTraceData)
        ]
      });
      const earthXYZ = XYZNewPointCalc2(
        requestedOrbitTime,
        planetData.planets[2]
      );
      // if (earthXYZ) {
      //   setXYZEarth([[earthXYZ[0]], [earthXYZ[1]], [earthXYZ[2]]]);
      // }
      if (earthXYZ) {
        setXYZEarth([[earthXYZ.x], [earthXYZ.y], [earthXYZ.z]]);
      }
    }
    if (planetData.planets[3] && planetData.display.mars == true) {
      const marsTraceData = XYZNewOrbDatCalc(planetData.planets[3]);
      setPlanetData({
        ...planetData,
        planets: [
          ...planetData.planets,
          (planetData.planets[3].orbit = marsTraceData)
        ]
      });
      const marsXYZ = XYZNewPointCalc2(
        requestedOrbitTime,
        planetData.planets[3]
      );
      // if (marsXYZ) {
      //   setXYZMars([[marsXYZ[0]], [marsXYZ[1]], [marsXYZ[2]]]);
      // }
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
      const NEOXYZ = XYZNewPointCalc2(
        requestedOrbitTime,
        orbitingBodyArr[0].orbitalData
      );
      // const NEOXYZ = XYZForSpecificDate(
      //   requestedOrbitTime,
      //   orbitingBodyArr[0].orbitalData
      // );
      // if (NEOXYZ) {
      //   setXYZNEO([[NEOXYZ[0]], [NEOXYZ[1]], [NEOXYZ[2]]]);
      // }
      if (NEOXYZ) {
        setXYZNEO([[NEOXYZ.x], [NEOXYZ.y], [NEOXYZ.z]]);
      }
    }
  }, [isLoaded1, requestedOrbitTime]); //Dependent on API ID response completion and requestedOrbitTime change

  // Earth Coordinate
  useEffect(() => {
    if (planetData.display.mercury == true) {
      const mercuryXYZ = XYZNewPointCalc2(
        requestedOrbitTime,
        planetData.planets[0]
      );
      // if (mercuryXYZ) {
      //   setXYZMercury([[mercuryXYZ[0]], [mercuryXYZ[1]], [mercuryXYZ[2]]]);
      // }
      if (mercuryXYZ) {
        setXYZMercury([[mercuryXYZ.x], [mercuryXYZ.y], [mercuryXYZ.z]]);
      }
    }
    if (planetData.display.venus == true) {
      const venusXYZ = XYZNewPointCalc2(
        requestedOrbitTime,
        planetData.planets[1]
      );
      // if (venusXYZ) {
      //   setXYZVenus([[venusXYZ[0]], [venusXYZ[1]], [venusXYZ[2]]]);
      // }
      if (venusXYZ) {
        setXYZVenus([[venusXYZ.x], [venusXYZ.y], [venusXYZ.z]]);
      }
    }
    if (planetData.display.earth == true) {
      const earthXYZ = XYZNewPointCalc2(
        requestedOrbitTime,
        planetData.planets[2]
      );
      // if (earthXYZ) {
      //   setXYZEarth([[earthXYZ[0]], [earthXYZ[1]], [earthXYZ[2]]]);
      // }
      if (earthXYZ) {
        setXYZEarth([[earthXYZ.x], [earthXYZ.y], [earthXYZ.z]]);
      }
    }
    if (planetData.display.mars == true) {
      const marsXYZ = XYZNewPointCalc2(
        requestedOrbitTime,
        planetData.planets[3]
      );
      // if (marsXYZ) {
      //   setXYZMars([[marsXYZ[0]], [marsXYZ[1]], [marsXYZ[2]]]);
      // }
      if (marsXYZ) {
        setXYZMars([[marsXYZ.x], [marsXYZ.y], [marsXYZ.z]]);
      }
    }
  }, [requestedOrbitTime]); //dependent upon requestedOrbitTime change

  //Trace Definitions (for Plotly)
  const NEOtrace = {
    x: orbitingBodyArr[0]?.orbitalData.orbit?.x,
    y: orbitingBodyArr[0]?.orbitalData.orbit?.y,
    z: orbitingBodyArr[0]?.orbitalData.orbit?.z,
    type: "scatter3d",
    mode: "lines",
    marker: { color: "blue" },
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
    marker: { color: "blue", size: 3 }
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
    marker: { color: "red" },
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
    marker: { color: "red", size: 5 }
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
      {isLoaded2 ? null : <p>Loading...</p>}
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
              // minreducedwidth
              // minreducedheight
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

//============================================================//
//            NOTES USED TO FIGURE OUT THESE CALCS            //
//                                                            //
//============================================================//
/*TEMPORARY INTERFACE => ADDED NOTES I FOUND HELPFUL
// interface Orbital_Data {
//   type: string; // ecc == 0 => Circular, ecc < 1 => Elliptic, ecc == 1 => "Parabolic"m, ecc > 1 "hyperbolic"
//   i: number; // "inclination"
//   e: number; // "eccentricity"
//   o: number; // capital omega => "ascending_node_longitude"
//   p: number; // small omega => "perihelion_argument"
//   q: number; // "perihelion_distance"
//   Q: number; // "aphelion_distance"
//   P: number; // "orbital_period"
//   n: number; // "mean_motion"
//   t: number; // "epoch time => constant 946728000000" => 2451545
//   T: number; // "perihelion_time" => expressed in epoch time
//   dT: number; // "T-t" => time since Perihelion
//   M: number; // "mean anomaly" => 0 at perihelion and 180 at aphelion
//   L: number; // Mean Longitude => M + w + N
//   E: number; // Eccentric anomaly: M = E - e * sin(E)
//   v: number; // True anomaly: angle from perihelion to the planet as from the sun => 2 * atan(w)   =>
//   // v = m + (2 * e - 0.25 *pow(e,3) + 5/96 * pow(e,5)) * sin(m) +
//   //(1.25 * pow(e,2) - 11/24 * pow(e,4)) * sin(2*m) +
//   //(13/12 * pow(e,3) - 43/64 * pow(e,5)) * sin(3*m) +
//   //103/96 * pow(e,4) * sin(4*m) + 1097/960 * pow(e,5) * sin(5*m);  =>
//   // M = 232.910644 degrees or 4.065057601 radians
//   //  e = 0.093346v = 224.9688989 degrees  or 3.926448  radians
//   // Therefore, v = 224.9688989 degrees  or 3.926448  radians
//   r: number; // Heliocentric distance => planets distance to the sun =>  q * ( 1 + w*w )   =>  r = a * (1 - e^2) / [1 + e * cos(v)]
//   a: number; // Mean distance => (used for eliptical?) => a = q/(1-e)  <= 'Right ascension'
// }
*/
/*ORBITAL DATA API RESPONSE STRUCTURE
// "orbital_data": {
//     "orbit_id": "30",
//     "orbit_determination_date": "2023-08-23 05:49:41",
//     "first_observation_date": "2010-07-18",
//     "last_observation_date": "2023-08-22",
//     "data_arc_in_days": 4783,
//     "observations_used": 123,
//     "orbit_uncertainty": "0",
//     "minimum_orbit_intersection": ".0160379",
//     "jupiter_tisserand_invariant": "8.149",
//     "epoch_osculation": "2460800.5",  => 9255 since epoch
//   e  "eccentricity": ".6758435764026873",
//   a  "semi_major_axis": ".6820856911517545",
//   i  "inclination": "12.58725238186114",
// Omega "ascending_node_longitude": "306.5069351665489",
//     "orbital_period": "205.758049964439",
// p(a) of Sun = "perihelion_distance": ".2211024582306539",
// small omega  "perihelion_argument": "195.6453414534589",
// r(a) of Sun = "aphelion_distance": "1.143068924072855",
//   JD?  "perihelion_time": "2460889.401960145344",
//  M   "mean_anomaly": "204.4546609094758",
//  n   "mean_motion": "1.749627779142631",
//     "equinox": "J2000",
//     "orbit_class": {
//       "orbit_class_type": "ATE",
//       "orbit_class_description": "Near-Earth asteroid orbits similar to that of 2062 Aten",
//       "orbit_class_range": "a (semi-major axis) \u003C 1.0 AU; q (perihelion) \u003E 0.983 AU"
//     }
*/
/*DESCRIPTION OF ELEMENTS
// e = Eccentricty => "Pointiness" of the orbit
// a = Semi-major Axis => Half the maximum diameter of the elliptical orbit
// r(subscript a) = apoapsis => furthest point in the orbit
// = a(1+e)
// r(subscript p) = periapsis => closest point in the orbit
// = a(1-e)
// i = inclination => angle between the plane of the orbit and the reference plane
// 0-90deg normal direction orbit
// 90-180deg retrograde orbits
// Omega (greek symbol) = longitude of the ascending node
//Angle at the point where the orbit ascending passes through the horizontal plane of the earth and sun
//Measured in deg, measured counterclockwise
// omacron (green symbol looks like w) = Argument of periapsis
// The angle between the ascending node and the periapsis (lowest point of orbit)
// w with a slash above it = longitude of periapsis
//          w(slash) = Omega + omacron
// M = mean anomaly => imaginary angle that is zero at periapsis and increases at a constant rate of 360 per orbit
//        Normally measured at epoch or J2000
// n = mean motion => rate at which mean anomaly changes
// 2pie/T
//    For low inclination orbits: L = w(slash)+M
// v = true anomaly => actual angle between the orbiting body and periapsis
// Used to compute the position of the body
// No way to directly compute v from M so you need to:
// E = eccentric anomaly
//    M = E-e(sin)E      <= Keplers equation

// 3 Steps:

//    0) Prep:
//        Calculate time t in centuries from j2000
//        // month is zero-indexed, so 0 is January
//        let tMillisFromJ2000 = Date.now() - Date.UTC(2000, 0, 1, 12, 0, 0);
//        let tCenturiesFromJ2000 = tMillisFromJ2000 / (1000*60*60*24*365.25*100);
//        Reference point in time Jan 1 2000 (J2000 at noon) (for getting the plane of earth and sun as reference)

//        Calculate current values of each of the orbital params.
//        Semimajor axis of Earth from 1800-2500
//        a0 = 1.00000261; adot = 0.00000562
//        var a = a0 + adot * tCenturiesFromJ2000;

//    1) Keplers Equation:
//    2) Compute 2d position of the body
//    3) Rotate the 2d position into 3d coordinates
*/
/*BREAKING DOWN THE CODE FOUND IN NASA's CUSTOM ORBIT WEBAPP
  //https://ssd.jpl.nasa.gov/tools/orbit_diagram.html


  //Perihelion distance = var qr (?)
  //Eccentricity = var ecc
  //Inclination = var inc (in degrees)
  //Long. of ascending node (deg)  = var omega
  //Argument of perihelion (deg) = var raan
  //Time of perihelion passage = var tp

  // Derived:
  // var sma = perihelion distance / (1 - eccentricity);
  // var period = 2 * Math.PI * Math.sqrt(sma * sma * sma / gm )  => NOT SURE WHAT GM IS
  // n = Math.sqrt( gm/sma/sma/sma);  => I have n
  // vper = Math.sqrt(2*gm/Perihelion Distance -gm / sma) * au2km / day2sec  => Velocity at peri?
  // vapo = Math.sqrt(2*gm/(sma * (1 + ecc)) - gm/sma) * au2km / day2sec  => Velocity at peri?

  //constants
  // var rad2deg = 57.2957795130823;
  // var deg2rad = 1 / rad2deg;
  // var rmax = 55;
  // var gm = 0.00029591220828559;
  // var au2km = 149597870.7;
  // var km2au = 1 / au2km;
  // var day2sec = 86400;

  // function update_elements() {
  //   var qr = parseFloat($('#inp_qr').val());
  //   var ecc = parseFloat($('#inp_ecc').val());
  //   var inc = parseFloat($('#inp_inc').val());
  //   var raan = parseFloat($('#inp_raan').val());
  //   var omega = parseFloat($('#inp_omega').val());
  //   var tp = parseFloat($('#inp_tp').val());


  // // Derived variables:
  // var type;
  // var sma = qr / ( 1 - ecc );
  // var period = 2 * Math.PI * Math.sqrt( sma * sma * sma / gm );
  // var n = Math.sqrt( gm / sma / sma / sma );
  // var vper = Math.sqrt( 2 * gm / qr - gm / sma ) * au2km / day2sec;
  // var vapo = Math.sqrt( 2 * gm / (sma * (1 + ecc)) - gm / sma ) * au2km / day2sec;
  // sma = sma.toFixed(2);
  // period = period.toFixed(2);
  // n = n.toExponential(4);
  // vper = vper.toFixed(2);
  // vapo = vapo.toFixed(2);
  // if ( ecc == 0 ) {
  //   type = "Circular"; 
  // } else if ( ecc < 1 ) {
  //   type = "Elliptic";
  // } else if ( ecc == 1 ) {
  //   type = "Parabolic";
  //   sma = "Inf";
  //   period = "N/A";
  //   n = "N/A";
  //   vapo = "N/A";
  // } else if ( ecc > 1 ) {
  //   type = "Hyperbolic";
  //   period = "N/A";
  //   n = "N/A";
  //   vapo = "N/A";
  // }
  // var date = jd2cal(tp);
  // $("#orbit_class").html(type);
  // $("#orbital_period").html(period);
  // $("#mean_motion").html(n);
  // $("#peri_date").html(date.string);
  // $("#peri_vel").html(vper);
  // $("#apo_vel").html(vapo);
  // $("#semimajor_axis").html(sma);
  // return {};
  // };
*/
/*HELPFUL NOTES FROM ANOTHER ORBIT CALCULATING PROJECT ONLINE
// CODE FOUND AT: https://www.hackster.io/30506/calculation-of-right-ascension-and-declination-402218
//   X = r * [cos(o) * cos(v + p - o) - sin(o) * sin(v + p - o) *
//   cos(i)]
//   Y = r * [sin(o) * cos(v + p - o) + cos(o) * sin(v + p - o) *
//   cos(i)]
//   Z = r * [sin(v + p - o) * sin(i)]

//   r is radius vector
//   v is true anomaly
//   o is longitude of ascending node
//   p is longitude of perihelion
//   i is inclination of plane of orbit

//   the quantity v + p - o is the angle of the planet measured
//   in the plane of the orbit from the ascending node
*/
