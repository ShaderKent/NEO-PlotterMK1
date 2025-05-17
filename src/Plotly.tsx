import { useEffect, useState } from "react";
import "./App.css";
import Plot from "react-plotly.js";
import React from "react";

// // TODO Add Redux to final project
// //  X   Add plotly
// //  X Figure out how to graph an orbit with plotly
// //  X  Pull data from api NASA
// //      Cleanup Code/move API request to another file
// //  X   Graph that data
// //      Make basic UI
// //      Confirm Accuracy of Earth's Data
// //      Add plot for orbital body
// //      cycle through different api objects

// // NASA API Key: YJK8aZ88VJ3LvbCoC9swoyw3aHI4a0cSpcldpxgj
// // https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=DEMO_KEY
// interface NEO_JSON_Object {
//   id: number;
//   neo_reference_id: number;
//   name: string;
//   designation: string;
//   absolute_magnitude_h: number;
//   is_potentially_hazardous_asteroid: boolean;
//   nasa_jpl_url: string;
//   estimated_diameter: {
//     feet: {
//       estimated_diameter_max: number;
//       estimated_diameter_min: number;
//     };
//     kilometers: {
//       estimated_diameter_max: number;
//       estimated_diameter_min: number;
//     };
//     meters: {
//       estimated_diameter_max: number;
//       estimated_diameter_min: number;
//     };
//     miles: {
//       estimated_diameter_max: number;
//       estimated_diameter_min: number;
//     };
//   };
//   orbital_data: {
//     aphelion_distance: string;
//     ascending_node_longitude: string;
//     data_arc_in_days: number;
//     eccentricity: string;
//     epoch_osculation: string;
//     equinox: string;
//     first_observation_date: string;
//     inclination: string;
//     jupiter_tisserand_invariant: string;
//     last_observation_date: string;
//     mean_anomaly: string;
//     mean_motion: string;
//     minimum_orbit_intersection: string;
//     observations_used: number;
//     orbit_determination_date: string;
//     orbit_id: string;
//     orbit_uncertainty: string;
//     orbital_period: string;
//     perihelion_argument: string;
//     perihelion_distance: string;
//     perihelion_time: string;
//     semi_major_axis: string;
//     orbit_class: {
//       orbit_class_type: string;
//       orbit_class_description: string;
//       orbit_class_range: string;
//     };
//   };
//   close_approach_data: Array<Close_Approach_Data>;
//   links: {
//     self: string;
//   };
// }
// interface Close_Approach_Data {
//   close_approach_date: string;
//   close_approach_date_full: string;
//   epoch_date_close_approach: number;
//   orbiting_body: string;
//   miss_distance: {
//     astronomical: string;
//     lunar: string;
//     kilometers: string;
//     miles: string;
//   };
//   relative_velocity: {
//     kilometers_per_hour: string;
//     kilometers_per_second: string;
//     miles_per_hour: string;
//   };
// }
interface Orbital_Data {
  date: string; //Date of data collection => used to calculate future values relative to a constant t (J2000)
  M: number; //Mean Anomaly => How far around the orbit the object currently is in degrees. 0 at perihelion, 180 at aphelion
  e: number; //Eccentricity => How 'pointy' the orbit is: 0 = circular, < 1 = Elliptical, > 1 == Parabolic, > 1 = Hyperbolic
  q: number; //Perihelion distance => Distance in A.U. from the sun at closest part of orbit
  o: number; //'Omega'(Capital) or ascending node longitude => Angle at the point where the orbit ascending passes through the horizontal plane of the earth and sun, in deg (counterclockwise)
  i: number; //Inclination => // angle (deg) between the plane of the orbit and the reference plane > 0-90deg normal direction orbit > 90-180deg retrograde orbits
  p: number; //'omega'(lowecase) or perihelion argument => The angle between the ascending node and the periapsis (lowest point of orbit)
  v?: number; //True anomaly (DERIVED) => actual angle between the orbiting body and periapsis
  a?: number; //Mean distance (DERIVED) => also known as the Semi-Major Axis
  r?: number; //Heliocenteric Distance (DERIVED) => Body's distance ot the sun
  orbit?: Array<Array<number>>; //Calculated orbit data in the form [[x],[y],[z]]
}

interface myProps {}
interface myState {
  testCounter: number;
  data: Array<any>;
  layout: object;
  APIData: object;
  orbitalData: {
    NEO: Orbital_Data | any;
    earth: Orbital_Data | any;
  };
}

// Constants
const t = 946728000000; //Time in milliseconds after J2000 => used for calculating positions relative to this 'epoch'
const today = new Date();

const earthOrbitData: Orbital_Data = {
  date: "2023-05-14 12:00:00",
  M: 100.46435,
  e: 0.01671022,
  q: 0.98329,
  o: 11.26064,
  i: 0.0157,
  p: 102.94719
};

class Plotly extends React.Component<myProps, myState> {
  constructor(props: object) {
    super(props);
    this.state = {
      testCounter: 0,
      data: [],
      layout: {},
      APIData: {},
      orbitalData: {
        NEO: {},
        earth: {
          date: "2023-05-14 12:00:00",
          M: 100.46435,
          e: 0.01671022,
          q: 0.98329,
          o: 11.26064,
          i: 0.0157,
          p: 102.94719,
          orbit: [[0], [0], [0]]
        }
      }
    };
  }

  initializePlot = () => {
    const trace1 = {
      x: this.state.orbitalData.NEO.orbit[0]
        ? this.state.orbitalData.NEO.orbit[0]
        : 0,
      y: this.state.orbitalData.NEO.orbit[1]
        ? this.state.orbitalData.NEO.orbit[1]
        : 0,
      z: this.state.orbitalData.NEO.orbit[2]
        ? this.state.orbitalData.NEO.orbit[2]
        : 0,
      type: "scatter3d",
      mode: "lines",
      marker: { color: "red" },
      line: { shape: "spline", width: 2, dash: "solid" },
      zmax: 1
    };

    const trace2 = {
      x: [10],
      y: [10],
      z: [0.3],
      hoverinfo: "text",
      text: "NEO",
      type: "scatter3d",
      mode: "markers",
      marker: { color: "red", size: 3 }
    };

    const trace3 = {
      x: [8], //this.state.orbitalData.earth.orbit[0],
      y: [8], //this.state.orbitalData.earth.orbit[1],
      z: [0.2], //this.state.orbitalData.earth.orbit[2],
      type: "scatter3d",
      mode: "lines",
      marker: { color: "green" },
      line: { shape: "spline", width: 2, dash: "solid" }
    };

    const trace4 = {
      x: [5],
      y: [5],
      z: [0.1],
      hoverinfo: "text",
      text: "Earth",
      type: "scatter3d",
      mode: "markers",
      marker: { color: "green", size: 5 }
    };

    const trace5 = {
      x: [0],
      y: [0],
      z: [0],
      hoverinfo: "text",
      text: "Sun",
      type: "scatter3d",
      mode: "markers",
      marker: { color: "yellow", size: 12 }
    };

    const layout = {
      width: 1000,
      height: 700,
      title: { text: "A Fancy Plot" },
      yaxis: {
        tickmode: "linear",
        ticks: "outside",
        tick0: 0,
        dtick: 0.25,
        ticklen: 8,
        tickwidth: 4
      },
      scene: {
        zaxis: {
          range: [-0.5, 0.5]
        }
      }
    };

    this.setState({
      data: [trace1],
      layout: layout
    });
  };
  handleSetOrbitalDataFromAPI = (data: any) => {
    //Splits relevant off of the main JSON object for calculating orbits
    this.setState({
      orbitalData: {
        ...this.state.orbitalData,
        NEO: {
          date: data.orbit_determination_date,
          M: data.mean_anomaly,
          e: data.eccentricity,
          q: data.perihelion_distance,
          o: data.ascending_node_longitude,
          i: data.inclination,
          p: data.perihelion_argument
        }
      }
    });
    console.log("Here", data.orbit_determination_date);
  };
  getAdjustedT = (value: string | null, change: number, dateString: string) => {
    //Used to calculate the adjusted time (Tx) for each point x along an orbit
    // Takes the orbit determination date splits it into years, months, days, hours, minutes, and seconds
    const year = dateString.substring(0, 4);
    const month = dateString.substring(5, 7);
    const day = dateString.substring(8, 10);
    const hour = dateString.substring(11, 13);
    const minute = dateString.substring(14, 16);
    const second = dateString.substring(17, 19);

    //Gets the UTC of that date in milliseconds
    const T0 = Date.UTC(
      Number(year),
      Number(month),
      Number(day),
      Number(hour),
      Number(minute),
      Number(second)
    );

    // Depending on the value passed in, adjusts the date in milliseconds accordingly
    // Finally, subtracts t => epoch constant (milliseconds since Jan 2000)
    switch (value) {
      case "year":
        return T0 + change * (1000 * 60 * 60 * 24 * 365.5) - t;
        break;
      case "day":
        return T0 + change * (1000 * 60 * 60 * 24) - t;
        break;
      case "hour":
        return T0 + change * (1000 * 60 * 60) - t;
        break;
      case "minute":
        return T0 + change * (1000 * 60) - t;
        break;
      case "second":
        return T0 + change * 1000 - t;
        break;
      default:
        return T0 - t;
    }
  };

  getAdjustedUTCForDate = (
    //Works with XYZForSpecificDate() to request point data (rather than traces)
    //Optional hour, minute, and seconds, but likely best to use 0,0,0 if unused
    year: number,
    month: number,
    day: number,
    hour?: number,
    minute?: number,
    second?: number
  ) => {
    if (hour && minute && second) {
      return Date.UTC(year, month, day, hour, minute, second) - t;
    } else {
      return Date.UTC(year, month, day) - t;
    }
  };

  //API Request from NASA NEO database
  callAPI = () => {
    const url =
      "https://api.nasa.gov/neo/rest/v1/neo/3542519?api_key=YJK8aZ88VJ3LvbCoC9swoyw3aHI4a0cSpcldpxgj";
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        //Stores the whole JSON response in state
        this.setState({
          APIData: json
        });
        //Updates the NEO orbital data in state separately for ease of use
        this.handleSetOrbitalDataFromAPI(json.orbital_data);
        this.calcOrbits();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  calcAdjMeanAnomaly = (T: number | undefined, orbDat?: Orbital_Data) => {
    if (T && orbDat) {
      const Mx = Number(orbDat.M) + 360 * (t / T); //t is in milliseconds currently
      return Mx; //Value in degrees
    }
  };

  calcTrueAnomaly = (Mx: number | undefined, orbDat?: Orbital_Data) => {
    if (Mx && orbDat) {
      const e = Number(orbDat.e);
      const i1 = 2 * e - e ** (3 / 4) * Math.sin(Mx);
      const i2 = (5 / 4) * e ** 2 * Math.sin(2 * Mx);
      const i3 = (13 / 12) * e ** 3 * Math.sin(3 * Mx);
      const i4 = (103 / 96) * e ** 4 * Math.sin(4 * Mx);
      const i5 = (1097 / 960) * e ** 5 * Math.sin(5 * Mx);
      const v = Mx + (180 / Math.PI) * (i1 + i2 + i3 + i4 + i5);
      return v; //Value in degrees
    }
  };
  calcMeanDistance = (orbDat?: Orbital_Data) => {
    if (orbDat) {
      const a = orbDat.q / (1 - orbDat.e);
      return a; //Value is in A.U.
    }
  };
  calcHelioDist = (
    a: number | undefined,
    v: number | undefined,
    orbDat?: Orbital_Data
  ) => {
    if (a && v && orbDat) {
      const r = (a * (1 - orbDat.e ** 2)) / (1 + orbDat.e * Math.cos(v));
      return r; //Value is in A.U.
    }
  };
  //Calculates the rectangular coordinates from angular coordinates
  calcXYZ = (
    r: number | undefined,
    v: number | undefined,
    orbDat?: Orbital_Data
  ) => {
    if (r && v && orbDat) {
      const o = Number(orbDat.o);
      const p = Number(orbDat.p);
      const i = Number(orbDat.i);
      const x =
        r *
        (Math.cos(o) * Math.cos(v + p - o) -
          Math.sin(o) * Math.sin(v + p - o) * Math.cos(i));
      const y =
        r *
        (Math.sin(o) * Math.cos(v + p - o) +
          Math.cos(o) * Math.sin(v + p - o) * Math.cos(i));
      const z = r * (Math.sin(v + p - o) * Math.sin(i));
      return [x, y, z]; //Value is in A.U.
    }
  };

  //Coordinate Generation Functions
  XYZFromOrbData = (orbDat?: Orbital_Data) => {
    if (orbDat) {
      let tempX = [];
      let tempY = [];
      let tempZ = [];
      for (let i = 0; i < 10; i += 0.01) {
        const Tx = this.getAdjustedT("day", i, orbDat.date);
        console.log(this.state.orbitalData.NEO.date);
        // console.log("Tx= ", Tx);
        const Mx = this.calcAdjMeanAnomaly(Tx, orbDat);
        // console.log("Mx= ", Mx);
        const v = this.calcTrueAnomaly(Mx, orbDat);
        const a = this.calcMeanDistance(orbDat);
        const r = this.calcHelioDist(a, v, orbDat);
        const coordinatePoint = this.calcXYZ(r, v, orbDat);
        if (coordinatePoint) {
          tempX.push(Number(coordinatePoint[0].toFixed(10)));
          tempY.push(Number(coordinatePoint[1].toFixed(10)));
          tempZ.push(Number(coordinatePoint[2].toFixed(10)));
        }
      }
      return [tempX, tempY, tempZ];
    }
  };

  XYZForSpecificDate = (
    year: number,
    month: number,
    day: number,
    hour?: number,
    minute?: number,
    second?: number,
    orbDat?: Orbital_Data
  ) => {
    const Tx = this.getAdjustedUTCForDate(
      year,
      month,
      day,
      hour,
      minute,
      second
    );
    const Mx = this.calcAdjMeanAnomaly(Tx, orbDat);
    const v = this.calcTrueAnomaly(Mx, orbDat);
    const a = this.calcMeanDistance(orbDat);
    const r = this.calcHelioDist(a, v, orbDat);
    const coordinatePoint = this.calcXYZ(r, v, orbDat);
    return coordinatePoint;
  };
  calcOrbits() {
    const tempNEOOrbData = this.XYZFromOrbData(this.state.orbitalData.NEO);
    console.log(tempNEOOrbData);
    this.setState({
      orbitalData: {
        ...this.state.orbitalData,
        NEO: {
          ...this.state.orbitalData.NEO,
          orbit: tempNEOOrbData
        }
      }
    });
  }

  refresh() {
    console.log("refreshed");
    this.setState({
      testCounter: this.state.testCounter + 1
    });
    console.log(this.state.orbitalData.NEO.orbit);
    this.calcOrbits();
  }
  //Coordinate Generation
  //Traces

  componentDidMount(): void {
    this.callAPI();
    this.initializePlot();
    // XYZOrbData = this.XYZFromOrbData(this.state.oribitalData.NEO);
  }

  //   //Point Data
  //   const earthXYZ = XYZForSpecificDate(
  //     today.getFullYear(),
  //     today.getMonth(),
  //     today.getDate(),
  //     0,
  //     0,
  //     0,
  //     earthData
  //   );
  //   // if (earthXYZ) {
  //   //   earthX_today[0] = earthXYZ[0];
  //   //   earthY_today[0] = earthXYZ[1];
  //   //   earthZ_today[0] = earthXYZ[2];
  //   // }
  //   const NEOXYZ = XYZForSpecificDate(
  //     today.getFullYear(),
  //     today.getMonth(),
  //     today.getDate(),
  //     0,
  //     0,
  //     0,
  //     orbitalData
  //   );
  //   // if (NEOXYZ) {
  //   //   NEOx_today[0] = NEOXYZ[0];
  //   //   NEOy_today[0] = NEOXYZ[1];
  //   //   NEOz_today[0] = NEOXYZ[2];
  //   // }

  render() {
    return (
      <>
        <button onClick={() => this.refresh()}>Refresh</button>
        <p>{this.state.orbitalData.earth.orbit[0][2]}</p>
        <Plot data={this.state.data} layout={this.state.layout} />
      </>
    );
  }

  //   // State Variables
  //   //Containers for xyz orbital coordinates
  // NEOx: Array<number> = [];
  //   let NEOy: Array<number> = [];
  //   let NEOz: Array<number> = [];
  //   // let NEOx_today: Array<number> = [];
  //   // let NEOy_today: Array<number> = [];
  //   // let NEOz_today: Array<number> = [];

  //   let earthX: Array<number> = [];
  //   let earthY: Array<number> = [];
  //   let earthZ: Array<number> = [];
  //   // let earthX_today: Array<number> = [];
  //   // let earthY_today: Array<number> = [];
  //   // let earthZ_today: Array<number> = [];

  //   // State management
  //   const [NEO_Data, setNEO_Data] = useState<NEO_JSON_Object>(); //Container for main API response data
  //   const [orbitalData, setOrbitalData] = useState<Orbital_Data>(); //Sub container for orbital data for ease of use
  //   const [mainPlotData, setMainPlotData] = useState<Plot_Data>({
  //
  //
  //   }); //Container for all traces/layout for the main plot

  //   //Calculation of derived values
  //   const getAdjustedT = (
  //     value: string | null,
  //     change: number,
  //     dateString: string
  //   ) => {
  //     //Used to calculate the adjusted time (Tx) for each point x along an orbit
  //     // Takes the orbit determination date splits it into years, months, days, hours, minutes, and seconds
  //     const year = dateString.substring(0, 4);
  //     const month = dateString.substring(5, 7);
  //     const day = dateString.substring(8, 10);
  //     const hour = dateString.substring(11, 13);
  //     const minute = dateString.substring(14, 16);
  //     const second = dateString.substring(17, 19);

  //     //Gets the UTC of that date in milliseconds
  //     const T0 = Date.UTC(
  //       Number(year),
  //       Number(month),
  //       Number(day),
  //       Number(hour),
  //       Number(minute),
  //       Number(second)
  //     );

  //     // Depending on the value passed in, adjusts the date in milliseconds accordingly
  //     // Finally, subtracts t => epoch constant (milliseconds since Jan 2000)
  //     switch (value) {
  //       case "year":
  //         return T0 + change * (1000 * 60 * 60 * 24 * 365.5) - t;
  //         break;
  //       case "day":
  //         return T0 + change * (1000 * 60 * 60 * 24) - t;
  //         break;
  //       case "hour":
  //         return T0 + change * (1000 * 60 * 60) - t;
  //         break;
  //       case "minute":
  //         return T0 + change * (1000 * 60) - t;
  //         break;
  //       case "second":
  //         return T0 + change * 1000 - t;
  //         break;
  //       default:
  //         return T0 - t;
  //     }
  //   };

  //   const getAdjustedUTCForDate = (
  //     //Works with XYZForSpecificDate() to request point data (rather than traces)
  //     //Optional hour, minute, and seconds, but likely best to use 0,0,0 if unused
  //     year: number,
  //     month: number,
  //     day: number,
  //     hour?: number,
  //     minute?: number,
  //     second?: number
  //   ) => {
  //     if (hour && minute && second) {
  //       return Date.UTC(year, month, day, hour, minute, second) - t;
  //     } else {
  //       return Date.UTC(year, month, day) - t;
  //     }
  //   };

  //   const calcAdjMeanAnomaly = (T: number | undefined, orbDat?: Orbital_Data) => {
  //     if (T && orbDat) {
  //       const Mx = Number(orbDat.M) + 360 * (t / T); //t is in milliseconds currently
  //       return Mx; //Value in degrees
  //     }
  //   };
  //   const calcTrueAnomaly = (Mx: number | undefined, orbDat?: Orbital_Data) => {
  //     if (Mx && orbDat) {
  //       const e = Number(orbDat.e);
  //       const i1 = 2 * e - e ** (3 / 4) * Math.sin(Mx);
  //       const i2 = (5 / 4) * e ** 2 * Math.sin(2 * Mx);
  //       const i3 = (13 / 12) * e ** 3 * Math.sin(3 * Mx);
  //       const i4 = (103 / 96) * e ** 4 * Math.sin(4 * Mx);
  //       const i5 = (1097 / 960) * e ** 5 * Math.sin(5 * Mx);
  //       const v = Mx + (180 / Math.PI) * (i1 + i2 + i3 + i4 + i5);
  //       return v; //Value in degrees
  //     }
  //   };
  //   const calcMeanDistance = (orbDat?: Orbital_Data) => {
  //     if (orbDat) {
  //       const a = orbDat.q / (1 - orbDat.e);
  //       return a; //Value is in A.U.
  //     }
  //   };
  //   const calcHelioDist = (
  //     a: number | undefined,
  //     v: number | undefined,
  //     orbDat?: Orbital_Data
  //   ) => {
  //     if (a && v && orbDat) {
  //       const r = (a * (1 - orbDat.e ** 2)) / (1 + orbDat.e * Math.cos(v));
  //       return r; //Value is in A.U.
  //     }
  //   };

  //   //Calculates the rectangular coordinates from angular coordinates
  //   const calcXYZ = (
  //     r: number | undefined,
  //     v: number | undefined,
  //     orbDat?: Orbital_Data
  //   ) => {
  //     if (r && v && orbDat) {
  //       const o = Number(orbDat.o);
  //       const p = Number(orbDat.p);
  //       const i = Number(orbDat.i);
  //       const x =
  //         r *
  //         (Math.cos(o) * Math.cos(v + p - o) -
  //           Math.sin(o) * Math.sin(v + p - o) * Math.cos(i));
  //       const y =
  //         r *
  //         (Math.sin(o) * Math.cos(v + p - o) +
  //           Math.cos(o) * Math.sin(v + p - o) * Math.cos(i));
  //       const z = r * (Math.sin(v + p - o) * Math.sin(i));
  //       return [x, y, z]; //Value is in A.U.
  //     }
  //   };

  //   //Coordinate Generation Functions
  //   const XYZFromOrbData = (
  //     // x: Array<number>,
  //     // y: Array<number>,
  //     // z: Array<number>,
  //     orbDat?: Orbital_Data
  //   ) => {
  //     if (orbDat) {
  //       let tempX = [];
  //       let tempY = [];
  //       let tempZ = [];
  //       for (let i = 0; i < 200; i += 0.01) {
  //         const Tx = getAdjustedT("day", i, orbDat.date);
  //         const Mx = calcAdjMeanAnomaly(Tx, orbDat);
  //         const v = calcTrueAnomaly(Mx, orbDat);
  //         const a = calcMeanDistance(orbDat);
  //         const r = calcHelioDist(a, v, orbDat);
  //         const coordinatePoint = calcXYZ(r, v, orbDat);
  //         if (coordinatePoint) {
  //           tempX.push(Number(coordinatePoint[0].toFixed(10)));
  //           tempY.push(Number(coordinatePoint[1].toFixed(10)));
  //           tempZ.push(Number(coordinatePoint[2].toFixed(10)));
  //         }
  //       }
  //       return [tempX, tempY, tempZ];
  //     }
  //   };

  //   const XYZForSpecificDate = (
  //     year: number,
  //     month: number,
  //     day: number,
  //     hour?: number,
  //     minute?: number,
  //     second?: number,
  //     orbDat?: Orbital_Data
  //   ) => {
  //     const Tx = getAdjustedUTCForDate(year, month, day, hour, minute, second);
  //     const Mx = calcAdjMeanAnomaly(Tx, orbDat);
  //     const v = calcTrueAnomaly(Mx, orbDat);
  //     const a = calcMeanDistance(orbDat);
  //     const r = calcHelioDist(a, v, orbDat);
  //     const coordinatePoint = calcXYZ(r, v, orbDat);
  //     return coordinatePoint;
  //   };

  //   //Coordinate Generation
  //   //Traces
  //   const XYZOrbData = XYZFromOrbData(orbitalData);
  //   const XYZEarthData = XYZFromOrbData(earthData);
  //   //Point Data
  //   const earthXYZ = XYZForSpecificDate(
  //     today.getFullYear(),
  //     today.getMonth(),
  //     today.getDate(),
  //     0,
  //     0,
  //     0,
  //     earthData
  //   );
  //   // if (earthXYZ) {
  //   //   earthX_today[0] = earthXYZ[0];
  //   //   earthY_today[0] = earthXYZ[1];
  //   //   earthZ_today[0] = earthXYZ[2];
  //   // }
  //   const NEOXYZ = XYZForSpecificDate(
  //     today.getFullYear(),
  //     today.getMonth(),
  //     today.getDate(),
  //     0,
  //     0,
  //     0,
  //     orbitalData
  //   );
  //   // if (NEOXYZ) {
  //   //   NEOx_today[0] = NEOXYZ[0];
  //   //   NEOy_today[0] = NEOXYZ[1];
  //   //   NEOz_today[0] = NEOXYZ[2];
  //   // }
  //   // Set Plot State
  //   setMainPlotData({
  //     ...mainPlotData,
  //     data: [
  //       ...mainPlotData.data,
  //       (mainPlotData.data[0] = {
  //         ...mainPlotData.data[0],
  //         x: 0,
  //         y: 0,
  //         z: 0,
  //         // x: XYZOrbData ? [0] : 0,
  //         // y: XYZOrbData ? [1] : 0,
  //         // z: XYZOrbData ? [2] : 0,
  //         type: "scatter3d",
  //         mode: "lines",
  //         marker: { color: "red" },
  //         line: { shape: "spline", width: 2, dash: "solid" },
  //         zmax: 1
  //       })
  //       // (mainPlotData.data[1] = {
  //       //   ...mainPlotData.data[1],
  //       //   x: [NEOXYZ ? [0] : 15],
  //       //   y: [NEOXYZ ? [1] : 15],
  //       //   z: [NEOXYZ ? [2] : 15]
  //       // }),
  //       // (mainPlotData.data[2] = {
  //       //   ...mainPlotData.data[2],
  //       //   x: XYZEarthData ? [0] : 0,
  //       //   y: XYZEarthData ? [1] : 0,
  //       //   z: XYZEarthData ? [2] : 0
  //       // }),
  //       // (mainPlotData.data[3] = {
  //       //   ...mainPlotData.data[3],
  //       //   x: [earthXYZ ? [0] : 0],
  //       //   y: [earthXYZ ? [1] : 0],
  //       //   z: [earthXYZ ? [2] : 0]
  //       // })
  //     ]
  //   });
  //   //Vestigial Currently
  //   const displayData = (
  //     <>
  //       <p>{NEO_Data?.id}</p>
  //       <p>{NEO_Data?.name}</p>
  //       <p>{NEO_Data?.designation}</p>
  //       <p>{NEO_Data?.is_potentially_hazardous_asteroid}</p>
  //       <p>{NEO_Data?.close_approach_data[0].close_approach_date}</p>
  //       <p>{NEO_Data?.orbital_data.aphelion_distance}</p>
  //       <p></p>
  //     </>
  //   );

  //   return (
  //     <>
  //       <div id="test"></div>
  //       <Plot
  //         data={mainPlotData.data}
  //         layout={mainPlotData.layout}
  //       />
  //     </>
  //   );
  // }
}

export default Plotly;

// //============================================================//
// //            NOTES USED TO FIGURE OUT THESE CALCS            //
// //                                                            //
// //============================================================//

// /*TEMPORARY INTERFACE => ADDED NOTES I FOUND HELPFUL
// // interface Orbital_Data {
// //   type: string; // ecc == 0 => Circular, ecc < 1 => Elliptic, ecc == 1 => "Parabolic"m, ecc > 1 "hyperbolic"
// //   i: number; // "inclination"
// //   e: number; // "eccentricity"
// //   o: number; // capital omega => "ascending_node_longitude"
// //   p: number; // small omega => "perihelion_argument"
// //   q: number; // "perihelion_distance"
// //   Q: number; // "aphelion_distance"
// //   P: number; // "orbital_period"
// //   n: number; // "mean_motion"
// //   t: number; // "epoch time => constant 946728000000" => 2451545
// //   T: number; // "perihelion_time" => expressed in epoch time
// //   dT: number; // "T-t" => time since Perihelion
// //   M: number; // "mean anomaly" => 0 at perihelion and 180 at aphelion
// //   L: number; // Mean Longitude => M + w + N
// //   E: number; // Eccentric anomaly: M = E - e * sin(E)
// //   v: number; // True anomaly: angle from perihelion to the planet as from the sun => 2 * atan(w)   =>
// //   // v = m + (2 * e - 0.25 *pow(e,3) + 5/96 * pow(e,5)) * sin(m) +
// //   //(1.25 * pow(e,2) - 11/24 * pow(e,4)) * sin(2*m) +
// //   //(13/12 * pow(e,3) - 43/64 * pow(e,5)) * sin(3*m) +
// //   //103/96 * pow(e,4) * sin(4*m) + 1097/960 * pow(e,5) * sin(5*m);  =>
// //   // M = 232.910644 degrees or 4.065057601 radians
// //   //  e = 0.093346v = 224.9688989 degrees  or 3.926448  radians
// //   // Therefore, v = 224.9688989 degrees  or 3.926448  radians
// //   r: number; // Heliocentric distance => planets distance to the sun =>  q * ( 1 + w*w )   =>  r = a * (1 - e^2) / [1 + e * cos(v)]
// //   a: number; // Mean distance => (used for eliptical?) => a = q/(1-e)  <= 'Right ascension'
// // }
// */
// /*ORBITAL DATA API RESPONSE STRUCTURE
// // "orbital_data": {
// //     "orbit_id": "30",
// //     "orbit_determination_date": "2023-08-23 05:49:41",
// //     "first_observation_date": "2010-07-18",
// //     "last_observation_date": "2023-08-22",
// //     "data_arc_in_days": 4783,
// //     "observations_used": 123,
// //     "orbit_uncertainty": "0",
// //     "minimum_orbit_intersection": ".0160379",
// //     "jupiter_tisserand_invariant": "8.149",
// //     "epoch_osculation": "2460800.5",  => 9255 since epoch
// //   e  "eccentricity": ".6758435764026873",
// //   a  "semi_major_axis": ".6820856911517545",
// //   i  "inclination": "12.58725238186114",
// // Omega "ascending_node_longitude": "306.5069351665489",
// //     "orbital_period": "205.758049964439",
// // p(a) of Sun = "perihelion_distance": ".2211024582306539",
// // small omega  "perihelion_argument": "195.6453414534589",
// // r(a) of Sun = "aphelion_distance": "1.143068924072855",
// //   JD?  "perihelion_time": "2460889.401960145344",
// //  M   "mean_anomaly": "204.4546609094758",
// //  n   "mean_motion": "1.749627779142631",
// //     "equinox": "J2000",
// //     "orbit_class": {
// //       "orbit_class_type": "ATE",
// //       "orbit_class_description": "Near-Earth asteroid orbits similar to that of 2062 Aten",
// //       "orbit_class_range": "a (semi-major axis) \u003C 1.0 AU; q (perihelion) \u003E 0.983 AU"
// //     }
// */
// /*DESCRIPTION OF ELEMENTS
// // e = Eccentricty => "Pointiness" of the orbit
// // a = Semi-major Axis => Half the maximum diameter of the elliptical orbit
// // r(subscript a) = apoapsis => furthest point in the orbit
// // = a(1+e)
// // r(subscript p) = periapsis => closest point in the orbit
// // = a(1-e)
// // i = inclination => angle between the plane of the orbit and the reference plane
// // 0-90deg normal direction orbit
// // 90-180deg retrograde orbits
// // Omega (greek symbol) = longitude of the ascending node
// //Angle at the point where the orbit ascending passes through the horizontal plane of the earth and sun
// //Measured in deg, measured counterclockwise
// // omacron (green symbol looks like w) = Argument of periapsis
// // The angle between the ascending node and the periapsis (lowest point of orbit)
// // w with a slash above it = longitude of periapsis
// //          w(slash) = Omega + omacron
// // M = mean anomaly => imaginary angle that is zero at periapsis and increases at a constant rate of 360 per orbit
// //        Normally measured at epoch or J2000
// // n = mean motion => rate at which mean anomaly changes
// // 2pie/T
// //    For low inclination orbits: L = w(slash)+M
// // v = true anomaly => actual angle between the orbiting body and periapsis
// // Used to compute the position of the body
// // No way to directly compute v from M so you need to:
// // E = eccentric anomaly
// //    M = E-e(sin)E      <= Keplers equation

// // 3 Steps:

// //    0) Prep:
// //        Calculate time t in centuries from j2000
// //        // month is zero-indexed, so 0 is January
// //        let tMillisFromJ2000 = Date.now() - Date.UTC(2000, 0, 1, 12, 0, 0);
// //        let tCenturiesFromJ2000 = tMillisFromJ2000 / (1000*60*60*24*365.25*100);
// //        Reference point in time Jan 1 2000 (J2000 at noon) (for getting the plane of earth and sun as reference)

// //        Calculate current values of each of the orbital params.
// //        Semimajor axis of Earth from 1800-2500
// //        a0 = 1.00000261; adot = 0.00000562
// //        var a = a0 + adot * tCenturiesFromJ2000;

// //    1) Keplers Equation:
// //    2) Compute 2d position of the body
// //    3) Rotate the 2d position into 3d coordinates
// */
// /*BREAKING DOWN THE CODE FOUND IN NASA's CUSTOM ORBIT WEBAPP
//   //https://ssd.jpl.nasa.gov/tools/orbit_diagram.html

//   //Perihelion distance = var qr (?)
//   //Eccentricity = var ecc
//   //Inclination = var inc (in degrees)
//   //Long. of ascending node (deg)  = var omega
//   //Argument of perihelion (deg) = var raan
//   //Time of perihelion passage = var tp

//   // Derived:
//   // var sma = perihelion distance / (1 - eccentricity);
//   // var period = 2 * Math.PI * Math.sqrt(sma * sma * sma / gm )  => NOT SURE WHAT GM IS
//   // n = Math.sqrt( gm/sma/sma/sma);  => I have n
//   // vper = Math.sqrt(2*gm/Perihelion Distance -gm / sma) * au2km / day2sec  => Velocity at peri?
//   // vapo = Math.sqrt(2*gm/(sma * (1 + ecc)) - gm/sma) * au2km / day2sec  => Velocity at peri?

//   //constants
//   // var rad2deg = 57.2957795130823;
//   // var deg2rad = 1 / rad2deg;
//   // var rmax = 55;
//   // var gm = 0.00029591220828559;
//   // var au2km = 149597870.7;
//   // var km2au = 1 / au2km;
//   // var day2sec = 86400;

//   // function update_elements() {
//   //   var qr = parseFloat($('#inp_qr').val());
//   //   var ecc = parseFloat($('#inp_ecc').val());
//   //   var inc = parseFloat($('#inp_inc').val());
//   //   var raan = parseFloat($('#inp_raan').val());
//   //   var omega = parseFloat($('#inp_omega').val());
//   //   var tp = parseFloat($('#inp_tp').val());

//   // // Derived variables:
//   // var type;
//   // var sma = qr / ( 1 - ecc );
//   // var period = 2 * Math.PI * Math.sqrt( sma * sma * sma / gm );
//   // var n = Math.sqrt( gm / sma / sma / sma );
//   // var vper = Math.sqrt( 2 * gm / qr - gm / sma ) * au2km / day2sec;
//   // var vapo = Math.sqrt( 2 * gm / (sma * (1 + ecc)) - gm / sma ) * au2km / day2sec;
//   // sma = sma.toFixed(2);
//   // period = period.toFixed(2);
//   // n = n.toExponential(4);
//   // vper = vper.toFixed(2);
//   // vapo = vapo.toFixed(2);
//   // if ( ecc == 0 ) {
//   //   type = "Circular";
//   // } else if ( ecc < 1 ) {
//   //   type = "Elliptic";
//   // } else if ( ecc == 1 ) {
//   //   type = "Parabolic";
//   //   sma = "Inf";
//   //   period = "N/A";
//   //   n = "N/A";
//   //   vapo = "N/A";
//   // } else if ( ecc > 1 ) {
//   //   type = "Hyperbolic";
//   //   period = "N/A";
//   //   n = "N/A";
//   //   vapo = "N/A";
//   // }
//   // var date = jd2cal(tp);
//   // $("#orbit_class").html(type);
//   // $("#orbital_period").html(period);
//   // $("#mean_motion").html(n);
//   // $("#peri_date").html(date.string);
//   // $("#peri_vel").html(vper);
//   // $("#apo_vel").html(vapo);
//   // $("#semimajor_axis").html(sma);
//   // return {};
//   // };
// */
// /*HELPFUL NOTES FROM ANOTHER ORBIT CALCULATING PROJECT ONLINE
// // CODE FOUND AT: https://www.hackster.io/30506/calculation-of-right-ascension-and-declination-402218
// //   X = r * [cos(o) * cos(v + p - o) - sin(o) * sin(v + p - o) *
// //   cos(i)]
// //   Y = r * [sin(o) * cos(v + p - o) + cos(o) * sin(v + p - o) *
// //   cos(i)]
// //   Z = r * [sin(v + p - o) * sin(i)]

// //   r is radius vector
// //   v is true anomaly
// //   o is longitude of ascending node
// //   p is longitude of perihelion
// //   i is inclination of plane of orbit

// //   the quantity v + p - o is the angle of the planet measured
// //   in the plane of the orbit from the ascending node
// */
