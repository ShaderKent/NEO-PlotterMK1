import OrbitPlot from "./OrbitPlot";
import "./App.css";
import { useEffect, useState } from "react";

import type { NEO_JSON_Object, Orbital_Data } from "./types";

function App() {
  const earthStaticData: Orbital_Data = {
    date: "2023-05-14 12:00:00",
    M: 100.46435,
    e: 0.01671022,
    q: 0.98329,
    o: 11.26064,
    i: 0.0157,
    p: 102.94719
  };

  // State management
  const [isLoaded, setIsLoaded] = useState<Boolean>(false);
  //   const [NEO_Data, setNEO_Data] = useState<NEO_JSON_Object>(); //Container for main API response data
  const [orbitalData, setOrbitalData] = useState<Orbital_Data>(); //Sub container for orbital data for ease of use
  const [earthData, setEarthData] = useState<Orbital_Data>(earthStaticData);

  //API call
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://api.nasa.gov/neo/rest/v1/neo/3542517?api_key=YJK8aZ88VJ3LvbCoC9swoyw3aHI4a0cSpcldpxgj"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        handleSetOrbitalData(json.orbital_data);
      } catch (e) {
        console.log("error");
      } finally {
        setIsLoaded(true); //Triggers render
      }
    }
    fetchData();
  }, []); //Runs once on refresh

  const handleSetOrbitalData = (data: NEO_JSON_Object["orbital_data"]) => {
    //Splits relevant off of the main JSON object for calculating orbits
    setOrbitalData({
      date: data.orbit_determination_date ?? "",
      M: Number(data.mean_anomaly),
      e: Number(data.eccentricity),
      q: Number(data.perihelion_distance),
      o: Number(data.ascending_node_longitude),
      i: Number(data.inclination),
      p: Number(data.perihelion_argument)
    });
  };
  return (
    <>
      <OrbitPlot
        isLoaded={isLoaded}
        setOrbitData={setOrbitalData}
        setEarthOrbitData={setEarthData}
        earthOrbitData={earthData}
        orbitData={orbitalData}
      />
    </>
  );
}

export default App;
