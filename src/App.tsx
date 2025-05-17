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
  const endDate = "2015-09-09"; //Temp date used to simulate a date range

  // State management
  const [isLoaded1, setIsLoaded1] = useState<Boolean>(false); //Handles the timing of trace calculations until the API Fetch
  const [isLoaded2, setIsLoaded2] = useState<Boolean>(false); //Handles display of Plot, waits till data has been calculated
  const [API_Request_Date, setAPI_Request_Date] =
    useState<String>("2015-09-08");
  const [API_ID, setAPI_ID] = useState<Number>(3542517);
  const [earthData, setEarthData] = useState<Orbital_Data>(earthStaticData);
  const [orbitingBodyArr, setOrbitingBodyArr] = useState<OrbitingBody[]>([]); //An array of 5 orbiting bodies

  //API call
  //`https://api.nasa.gov/neo/rest/v1/feed?start_date=${START_DATE}&end_date=${END_DATE}&api_key=YJK8aZ88VJ3LvbCoC9swoyw3aHI4a0cSpcldpxgj`
  //https://api.nasa.gov/neo/rest/v1/neo/3542517?api_key=YJK8aZ88VJ3LvbCoC9swoyw3aHI4a0cSpcldpxgj

  const handleSetOrbitalData = (data: NEO_JSON_Object) => {
    //Splits relevant off of the main JSON object for calculating orbits

    //Determines the index of the approach closest to earth, allows selection of only that data below.
    const approachDistanceData = data.close_approach_data;
    let minApproach = Math.min(
      ...approachDistanceData.map((item) =>
        Number(item.miss_distance.astronomical)
      )
    );
    let count = -1;
    let minApproachIndex = -1;
    approachDistanceData.forEach((approach) => {
      count++;
      if (Number(approach.miss_distance.astronomical) == minApproach) {
        minApproachIndex = count;
      }
    });

    //Defines Orbiting body using passed in JSON values
    const orbitingBody: OrbitingBody = {
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
    };
    return orbitingBody;
  };

  async function fetchNEOListData() {
    //Fetches the first 5 NEO responses for a given date range and pulls their id reference number
    //    Then passes those reference numbers to the next API call as an array.
    try {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${API_Request_Date}&end_date=${endDate}&api_key=YJK8aZ88VJ3LvbCoC9swoyw3aHI4a0cSpcldpxgj`
      );
      if (!response.ok) {
        throw new Error(
          `Outer API Call: HTTP error! status: ${response.status}`
        );
      }
      const json = await response.json();
      const idCallValues = [
        json.near_earth_objects[String(API_Request_Date)][0].neo_reference_id,
        json.near_earth_objects[String(API_Request_Date)][1].neo_reference_id,
        json.near_earth_objects[String(API_Request_Date)][2].neo_reference_id,
        json.near_earth_objects[String(API_Request_Date)][3].neo_reference_id,
        json.near_earth_objects[String(API_Request_Date)][4].neo_reference_id
      ];
      fetchIDData(idCallValues);
    } catch (e) {
      console.log("Outer API Call: error");
    } finally {
      console.log("Success: Outer API call completed");
    }
  }

  async function fetchIDData(idCallValues: Array<number>) {
    //Takes a list of NEO reference numbers and makes a fetch call for each one, storing their values in state
    //Designed to be able to call it for an individual object id as well (NEED TO TEST THIS)
    try {
      //Creates an array of the needed urls
      let API_ID_URLs: String[] = [];
      idCallValues.forEach((id) => {
        const url = `https://api.nasa.gov/neo/rest/v1/neo/${Number(
          id
        )}?api_key=YJK8aZ88VJ3LvbCoC9swoyw3aHI4a0cSpcldpxgj`;
        API_ID_URLs.push(url);
      });
      //Calls an async fetch request for each item in the url array, add their responses to a response array
      let API_Responses: Response[] = [];
      for (let i = 0; i < API_ID_URLs.length; i++) {
        const response = await fetch(String(API_ID_URLs[i]));
        API_Responses.push(response);
      }
      //Checks each item in the response array and logs an error if needed
      for (let i = 0; i < API_Responses.length; i++) {
        if (!API_Responses[i].ok) {
          throw new Error(
            `Inner: HTTP error! status: ${API_Responses[i].status}`
          );
        }
      }
      //Cycles through the response array and parses them as json, adding them to a json array.
      let JSON_Arr: any[] = [];
      for (let i = 0; i < API_Responses.length; i++) {
        const json = await API_Responses[i].json();
        JSON_Arr.push(json);
      }
      //Passes each item in the json array into a function that grabs the relevant data and returns an OrbitingBody object
      //Adds those objects to an array
      let bodyArr: OrbitingBody[] = [];
      for (let i = 0; i < JSON_Arr.length; i++) {
        const orbBody = handleSetOrbitalData(JSON_Arr[i]);
        bodyArr.push(orbBody);
      }
      //Immutably sets the orbitalBodyArr to the values in the OrbitingBody array described above
      setOrbitingBodyArr([...bodyArr]);
    } catch (e) {
      console.log("Inner API Loop: error");
    } finally {
      console.log("Success: Inner API call completed");
      setIsLoaded1(true); //Triggers render
    }
  }

  //Runs the initial API request
  useEffect(() => {
    fetchNEOListData();
  }, []); //Once at startup

  return (
    <>
      <Input setAPI={setAPI_ID} orbitingBodyArr={orbitingBodyArr} />
      <OrbitPlot
        isLoaded1={isLoaded1}
        setIsLoaded1={setIsLoaded1}
        isLoaded2={isLoaded2}
        setIsLoaded2={setIsLoaded2}
        setOrbitingBodyArr={setOrbitingBodyArr}
        setEarthOrbitData={setEarthData}
        earthOrbitData={earthData}
        orbitingBodyArr={orbitingBodyArr}
      />
    </>
  );
}

export default App;
