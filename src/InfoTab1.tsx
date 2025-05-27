import { useState, type ChangeEvent } from "react";
import type { API_Response_List_Data, OrbitingBody } from "./types";
import { FaArrowAltCircleDown } from "react-icons/fa";
import StatDisplay from "./StatDisplay";

interface selectedNEO {
  close_approach_data: [{ close_approach_date_full: string }];
}

interface InfoTab1Props {
  setAPI_Request_Id: Function;
  setAPI_Request_Date: Function;
  setRequestedOrbitTime: Function;
  API_NEO_List: any[];
  orbitingBodyArr: Array<OrbitingBody>;
}

function InfoTab1({
  setAPI_Request_Id,
  setAPI_Request_Date,
  setRequestedOrbitTime,
  API_NEO_List,
  orbitingBodyArr
}: InfoTab1Props) {
  //Constants
  const unixEpoch = 946684800 * 1000; //Seconds from J1 1970 TO J1 2000
  const dropDownTop = document.getElementById("dropDownTop");

  const getFormattedCurrentDate = () => {
    const currentDate = new Date();
    currentDate.toISOString().substring(0, 10);
    return String(currentDate);
  };

  //State Variables
  const [selectedDate, setSelectedDate] = useState<string>(
    getFormattedCurrentDate()
  );
  const [selectedNEO, setSelectedNEO] = useState<selectedNEO | null>(null);

  //Handlers
  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
    setAPI_Request_Date(event.target.value);
    //Sets the requested Time to Midnight of the requested day
    setRequestedOrbitTime(Date.parse(event.target.value) - unixEpoch);
  };

  const handleClickDropDown = () => {
    dropDownTop?.classList.toggle("hidden");
  };
  const handleClickDropDownItem = (
    dropDownItemId: string,
    dropDownListItem: selectedNEO
  ) => {
    const id = dropDownItemId;
    setSelectedNEO(dropDownListItem);
    setAPI_Request_Id(Number(id));
    setRequestedOrbitTime(
      Date.parse(
        dropDownListItem.close_approach_data[0].close_approach_date_full
      ) - unixEpoch
      // / (24 * 60 * 60)
    );
    dropDownTop?.classList.toggle("hidden");
  };

  return (
    <>
      <div className="static w-1/2 h-full">
        <div
          id="infoTab1"
          className="move-off-X fixed top-15 left-0 md:left-15 pb-2 pr-6 z-12 border-2 rounded-md md:w-2/5 w-full bg-green-600 transition-all duration-1000"
        >
          <div className="absolute right-0 h-full w-1/12 bg-green-800 rounded-r-sm inset-ring-2 inset-ring-green-900 md:max-w-10"></div>
          {API_NEO_List ? null : <div className="loadingDiv">Loading...</div>}
          {API_NEO_List ? (
            <>
              <div className="relative flex flex-row m-2 border-2 box-border rounded-sm bg-white font-bold justify-self-start">
                <h3 className="m-auto bg-green-700 shadow-2xl px-1">
                  NEO Approach Date:
                </h3>
                <input
                  type="date"
                  value={String(selectedDate)}
                  onChange={(e) => handleDateChange(e)}
                  className="border-l-2 px-2 "
                ></input>
              </div>
              <div className="relative">
                <div
                  onClick={() => {
                    handleClickDropDown();
                  }}
                  className="border-2 bg-white px-5 rounded cursor-pointer font-bold w-[200px] ml-2 flex justify-between shadow-sm"
                >
                  Objects
                  <FaArrowAltCircleDown size={16} className="self-center" />
                </div>
                <div
                  id="dropDownTop"
                  className="rounded  border-2 bg-white py-1 absolute ml-2 w-8/9 my-[1px] shadow-md justify-items-start hidden"
                >
                  {API_NEO_List.map((listItem: API_Response_List_Data) => {
                    return (
                      <div
                        key={listItem.neo_reference_id}
                        id={listItem.neo_reference_id}
                        onClick={() =>
                          handleClickDropDownItem(
                            String(listItem.neo_reference_id),
                            listItem
                          )
                        }
                        className="cursor-pointer hover:bg-gray-300 px-2 flex justify-between w-full"
                      >
                        <div>{listItem.name}</div>
                        <div>
                          {String(
                            listItem.close_approach_data[0]
                              .close_approach_date_full
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {orbitingBodyArr[0] ? (
                  <div id="reactiveColumns">
                    <div id="reactiveCol1">
                      <StatDisplay
                        title="Name:"
                        value={String(orbitingBodyArr[0].name)}
                        type="tab1"
                      />

                      <div className="flex flex-row justify-items-start">
                        {selectedNEO ? (
                          <div className="inline basis-auto">
                            <StatDisplay
                              title="Time:"
                              value={String(
                                selectedNEO.close_approach_data[0].close_approach_date_full.substring(
                                  12,
                                  18
                                )
                              )}
                              type="tab1"
                            />
                          </div>
                        ) : null}
                        <div className="inline">
                          <StatDisplay
                            title="ID:"
                            value={String(orbitingBodyArr[0].id)}
                            type="tab1"
                          />
                        </div>
                      </div>
                      <StatDisplay
                        title="Diameter (Max):"
                        value={String(
                          orbitingBodyArr[0].EstDiameterMax.toFixed(1) + " m"
                        )}
                        type="tab1"
                      />

                      <StatDisplay
                        title="Diameter (Min):"
                        value={String(
                          orbitingBodyArr[0].EstDiameterMin.toFixed(1) + " m"
                        )}
                        type="tab1"
                      />

                      <StatDisplay
                        title="Period:"
                        value={String(
                          orbitingBodyArr[0].orbitalPeriod.toFixed(2) + " days"
                        )}
                        type="tab1"
                      />
                    </div>
                    <div id="reactiveCol2">
                      <StatDisplay
                        title="Relative Speed:"
                        value={String(
                          orbitingBodyArr[0].closeApproachRelSpeed.toFixed(1) +
                            " km/s"
                        )}
                        type="tab1"
                      />
                      <StatDisplay
                        title="Hazard:"
                        value={String(orbitingBodyArr[0].hazard)}
                        type="tab1"
                      />

                      <StatDisplay
                        title="First Observed:"
                        value={String(orbitingBodyArr[0].firstObservation)}
                        type="tab1"
                      />
                      {/* </div>
                    <div> */}
                      <StatDisplay
                        title="Orbit Established:"
                        value={String(
                          orbitingBodyArr[0].orbitalData.date
                        ).substring(0, 11)}
                        type="tab1"
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
        -
      </div>
    </>
  );
}

export default InfoTab1;
