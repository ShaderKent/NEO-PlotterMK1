import OrbitPlot from "./OrbitPlot";
import "./App.css";
import { useEffect, useState } from "react";

import type { NEO_JSON_Object, Orbital_Data, OrbitingBody } from "./types";
import Input from "./Input";

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
  const [API_ID, setAPI_ID] = useState<Number>(3542517);
  //   const [NEO_Data, setNEO_Data] = useState<NEO_JSON_Object>(); //Container for main API response data
  const [orbitingBody, setOrbitingBody] = useState<OrbitingBody>(); //Sub container for orbital data for ease of use
  const [earthData, setEarthData] = useState<Orbital_Data>(earthStaticData);

  //API call
  //https://api.nasa.gov/neo/rest/v1/neo/3542517?api_key=YJK8aZ88VJ3LvbCoC9swoyw3aHI4a0cSpcldpxgj
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://api.nasa.gov/neo/rest/v1/neo/${API_ID}?api_key=YJK8aZ88VJ3LvbCoC9swoyw3aHI4a0cSpcldpxgj`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        handleSetOrbitalData(json);
      } catch (e) {
        console.log("error");
      } finally {
        setIsLoaded(true); //Triggers render
      }
    }
    fetchData();
  }, [API_ID]); //Runs on each update of API_ID

  const handleSetOrbitalData = (data: NEO_JSON_Object) => {
    //Splits relevant off of the main JSON object for calculating orbits

    //Determines the index of the approach closest to earth, allows selection of only that data below.
    const approachDistanceData = data.close_approach_data;
    let minApproach = Math.min(
      ...approachDistanceData.map((item) =>
        Number(item.miss_distance.astronomical)
      )
    );
    console.log(minApproach);
    let count = -1;
    let minApproachIndex = -1;
    approachDistanceData.forEach((approach) => {
      count++;
      if (Number(approach.miss_distance.astronomical) == minApproach) {
        minApproachIndex = count;
      }
    });
    console.log("indexOfMinApproach: ", minApproachIndex);
    setOrbitingBody({
      id: Number(data.neo_reference_id),
      name: String(data.name),
      OrbitingBody: String(
        data.close_approach_data[minApproachIndex].orbiting_body
      ),
      hazard: Boolean(data.is_potentially_hazardous_asteroid),
      orbitalPeriod: Number(data.orbital_data.orbital_period),
      closeApproachDistance: Number(
        data.close_approach_data[minApproachIndex].miss_distance.kilometers
      ),
      closeApproachRelSpeed: Number(
        data.close_approach_data[minApproachIndex].relative_velocity
          .kilometers_per_second
      ),
      closeApproachDate: String(
        data.close_approach_data[minApproachIndex].close_approach_date_full
      ),
      closeApproachEpochDate: Number(
        data.close_approach_data[minApproachIndex].close_approach_date_full
      ),
      EstDiameterMin: Number(
        data.estimated_diameter.meters.estimated_diameter_min
      ),
      EstDiameterMax: Number(
        data.estimated_diameter.meters.estimated_diameter_max
      ),
      firstObservation: String(data.orbital_data.first_observation_date),
      lastObservation: String(data.orbital_data.last_observation_date),
      orbitalData: {
        date: String(data.orbital_data.orbit_determination_date),
        M: Number(data.orbital_data.mean_anomaly),
        e: Number(data.orbital_data.eccentricity),
        q: Number(data.orbital_data.perihelion_distance),
        o: Number(data.orbital_data.ascending_node_longitude),
        i: Number(data.orbital_data.inclination),
        p: Number(data.orbital_data.perihelion_argument)
      }
    });
  };
  return (
    <>
      <Input setAPI={setAPI_ID} orbitingBody={orbitingBody} />
      <OrbitPlot
        isLoaded={isLoaded}
        setOrbitingBody={setOrbitingBody}
        setEarthOrbitData={setEarthData}
        earthOrbitData={earthData}
        orbitingBody={orbitingBody}
      />
    </>
  );
}

export default App;
