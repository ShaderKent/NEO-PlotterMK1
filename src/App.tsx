import OrbitPlot from "./OrbitPlot";
import "./App.css";
import { useEffect, useState } from "react";

import SideBar from "./SideBar";
import InfoTab1 from "./InfoTab1";
import InfoTab2 from "./InfoTab2";
import InfoTab3 from "./InfoTab3";
import TitleBar from "./TitleBar";
import TimeShifter from "./TimeShifter";

import type {
  API_Response_List_Data,
  NEO_JSON_Object,
  Orbital_Data,
  OrbitingBody,
  PlanetDisplay
} from "./types";
import planetStaticData from "./planetData";
import InfoTab4 from "./InfoTab4";
// import ExplainTab from "./ExplainTab";

function App() {
  const today = new Date();
  //Date today since UTC Epoch (J1 1970)
  const todayUTC = Date.parse(today.toISOString());
  //Seconds from J1 1970 TO J1 2000
  const unixEpoch = 946684800 * 1000;
  //Convert todays date to J2000 format (seconds)
  const todayAdjustedToJ2000 = todayUTC - unixEpoch;
  const degToRad = Math.PI / 180;
  //January 1, 4713 BC ending on Jan 1 2000 at 12:00pm in seconds
  const t = 2451545 * (24 * 60 * 60 * 1000);

  // State management

  //API Request/Data Management
  //Handles the timing of trace calculations until the API Fetch
  const [isLoaded1, setIsLoaded1] = useState<Boolean>(false);
  //Handles display of Plot, waits till data has been calculated
  const [isLoaded2, setIsLoaded2] = useState<Boolean>(false);
  const [API_Request_Date, setAPI_Request_Date] = useState<string>(
    today.toISOString().substring(0, 10)
  );
  //3542517 Random number to prevent 0 error
  const [API_Request_Id, setAPI_Request_Id] = useState<number>(3542517);
  const [API_NEO_List, setAPI_NEO_List] = useState<API_Response_List_Data[]>(
    []
  );
  const [requestedOrbitTime, setRequestedOrbitTime] =
    useState<number>(todayAdjustedToJ2000);

  console.log("Today adjusted to j2000", todayAdjustedToJ2000);
  //Orbital Data
  const [orbitingBodyArr, setOrbitingBodyArr] = useState<OrbitingBody[]>([]); //Vestigial as array (currently)
  const [planetData, setPlanetData] = useState<{
    display: PlanetDisplay;
    planets: Orbital_Data[];
  }>({
    display: {
      mercury: true,
      venus: true,
      earth: true,
      mars: true
    },
    planets: planetStaticData
  });

  //Adds 1 day to the selectedDate (adjusting for Month/Year)
  const getSelectedDateEnd = (date: string) => {
    const year = Number.parseInt(date.substring(0, 4));
    const month = Number.parseInt(date.substring(5, 7));
    const day = Number.parseInt(date.substring(8, 10));

    const startDate = Date.UTC(year, month - 1, day, 0, 0, 0);
    const startDatePlusOne = Number(startDate) + 24 * 60 * 60 * 1000;
    const endDate = new Date(startDatePlusOne);
    const endDateString = endDate.toISOString().substring(0, 10);
    return endDateString;
  };

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
        date:
          Number(data.orbital_data.perihelion_time) * (24 * 60 * 60 * 1000) - t, //Converted to j2000 time in milliseconds
        M: Number(data.orbital_data.mean_anomaly),
        e: Number(data.orbital_data.eccentricity),
        a: Number(data.orbital_data.semi_major_axis),
        o: Number(data.orbital_data.ascending_node_longitude) * degToRad,
        i: Number(data.orbital_data.inclination) * degToRad,
        p: Number(data.orbital_data.perihelion_argument) * degToRad,
        T: Number(data.orbital_data.orbital_period)
      }
    };
    return orbitingBody;
  };
  async function fetchNEOListData() {
    //Fetches a list of NEO objects for the date provided
    try {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${API_Request_Date}&end_date=${getSelectedDateEnd(
          API_Request_Date
        )}&api_key=YJK8aZ88VJ3LvbCoC9swoyw3aHI4a0cSpcldpxgj`
      );
      if (!response.ok) {
        throw new Error(
          `First API Call: HTTP error! status: ${response.status}`
        );
      }
      const json = await response.json();
      setAPI_NEO_List([...json.near_earth_objects[String(API_Request_Date)]]);
    } catch (e) {
      console.log("First API Call: error");
    } finally {
      console.log("Success: First API call completed");
    }
  }
  async function fetchNEOIdData() {
    //Fetches NEO data for a specific ID value
    try {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/neo/${Number(
          API_Request_Id
        )}?api_key=YJK8aZ88VJ3LvbCoC9swoyw3aHI4a0cSpcldpxgj`
      );
      if (!response.ok) {
        throw new Error(
          `Second API Call: HTTP error! status: ${response.status}`
        );
      }
      const json = await response.json();
      const orbBody = handleSetOrbitalData(json);
      setOrbitingBodyArr([orbBody]);
    } catch (e) {
      console.log("Second API Call: error");
    } finally {
      console.log("Success: Second API call completed");
      setIsLoaded1(true); //Triggers render
    }
  }

  //Runs first API Request when requested date changes
  useEffect(() => {
    fetchNEOListData();
  }, [API_Request_Date]);

  //Runs second API Request when requested ID changes
  useEffect(() => {
    fetchNEOIdData();
    setIsLoaded1(false); //Resets API load wait
    setIsLoaded2(false); //Resets calculation load wait
  }, [API_Request_Id]);

  return (
    <div className="w-screen h-screen">
      <TitleBar />
      <SideBar />
      {/* <ExplainTab /> */}
      <InfoTab1
        API_NEO_List={API_NEO_List}
        setAPI_Request_Id={setAPI_Request_Id}
        setAPI_Request_Date={setAPI_Request_Date}
        setRequestedOrbitTime={setRequestedOrbitTime}
        orbitingBodyArr={orbitingBodyArr}
      />
      <InfoTab2 orbitingBodyArr={orbitingBodyArr} />
      <InfoTab3
        orbitingBodyArr={orbitingBodyArr}
        requestedOrbitTime={requestedOrbitTime}
        setRequestedOrbitTime={setRequestedOrbitTime}
        API_Request_Id={API_Request_Id}
        API_Request_Date={API_Request_Date}
      />
      <InfoTab4 planetData={planetData} setPlanetData={setPlanetData} />
      <TimeShifter
        requestedOrbitTime={requestedOrbitTime}
        setRequestedOrbitTime={setRequestedOrbitTime}
      />
      <OrbitPlot
        isLoaded1={isLoaded1}
        isLoaded2={isLoaded2}
        setIsLoaded2={setIsLoaded2}
        requestedOrbitTime={requestedOrbitTime}
        orbitingBodyArr={orbitingBodyArr}
        setOrbitingBodyArr={setOrbitingBodyArr}
        planetData={planetData}
        setPlanetData={setPlanetData}
      />
    </div>
  );
}

export default App;
