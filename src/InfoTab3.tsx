import { useEffect, useState } from "react";
import SliderOff from "./SliderOff";
import StatDisplay from "./StatDisplay";
import type { OrbitingBody } from "./types";

interface InfoTab3Props {
  orbitingBodyArr: Array<OrbitingBody>;
  requestedOrbitTime: number;
  setRequestedOrbitTime: Function;
  API_Request_Id: number;
  API_Request_Date: string;
}

function InfoTab3({
  orbitingBodyArr,
  requestedOrbitTime,
  setRequestedOrbitTime,
  API_Request_Id,
  API_Request_Date
}: InfoTab3Props) {
  //Static Variables
  const unixEpoch = 946684800 * 1000; //Seconds from J1 1970 TO J1 2000
  //State Variables
  const [toggle1State, setToggle1State] = useState<Boolean>(false);
  const [prevRequestedOrbitTime, setPrevRequestedOrbitTime] =
    useState<number>();

  useEffect(() => {
    const tab3Slider1 = document.getElementById("tab3Slider1");
    setToggle1State(false);
    tab3Slider1?.classList.add("justify-self-end", "bg-gray-800");
    tab3Slider1?.classList.remove("justify-self-start", "bg-green-600");
  }, [API_Request_Date, API_Request_Id]);

  return (
    <div className="static w-1/3 h-full">
      <div
        id="infoTab3"
        className="move-off-X fixed left-0 md:left-15 top-15 pb-2 w-full md:top-23 md:w-3/7 z-10 border-2 rounded-md bg-fuchsia-700 transition-all duration-1000"
      >
        <div className="absolute right-0 h-full w-1/12 bg-fuchsia-800 rounded-r-sm inset-ring-2 inset-ring-fuchsia-900"></div>
        {orbitingBodyArr[0] ? (
          <>
            <div className="mr-2">
              <StatDisplay
                title="Closest Historical Approach"
                value={String(orbitingBodyArr[0].closeApproachDate)}
                type="tab3"
              />

              <StatDisplay
                title="Closest Known Approach"
                value={
                  String(orbitingBodyArr[0].closeApproachDistance.toFixed(2)) +
                  " km"
                }
                type="tab3"
              />
            </div>
            <div className="flex">
              <StatDisplay
                title="Relative Speed:"
                value={String(
                  orbitingBodyArr[0].closeApproachRelSpeed.toFixed(1) + " km/s"
                )}
                type="tab3"
              />
              <div
                className="relative mt-[8px] right-20 "
                onClick={() => {
                  if (!toggle1State) {
                    setPrevRequestedOrbitTime(requestedOrbitTime);
                    setRequestedOrbitTime(
                      Date.parse(orbitingBodyArr[0].closeApproachDate) -
                        unixEpoch
                    );
                    console.log(
                      "SettingReqOrbitTime: ",
                      Date.parse(orbitingBodyArr[0].closeApproachDate) -
                        unixEpoch,
                      " current ReqOrbitTime= ",
                      requestedOrbitTime
                    );
                    setToggle1State(true);
                  } else {
                    setRequestedOrbitTime(prevRequestedOrbitTime);
                    console.log(
                      "setting Req time to prevTime: ",
                      prevRequestedOrbitTime
                    );
                    setToggle1State(false);
                  }
                }}
              >
                <SliderOff id="tab3Slider1" />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default InfoTab3;
