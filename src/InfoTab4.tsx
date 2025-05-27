import SliderOn from "./SliderOn";
import type { Orbital_Data, PlanetDisplay } from "./types";

interface InfoTab4Props {
  planetData: {
    display: PlanetDisplay;
    planets: Orbital_Data[];
  };
  setPlanetData: Function;
}

function InfoTab4({ planetData, setPlanetData }: InfoTab4Props) {
  return (
    <>
      <div className="static w-1/3 h-full">
        <div
          id="infoTab4"
          className="move-off-X fixed left-0 md:left-15 top-15 w-full md:top-65 md:h-45 md:w-50 z-10 border-2 rounded-md bg-gray-500 transition-all duration-1000"
        >
          <div className="absolute right-0 h-full w-1/12 bg-gray-700 rounded-r-sm inset-ring-2 inset-ring-gray-800"></div>
          <div className="flex p-2">
            <div className="px-2 mr-2 rounded bg-gray-700 text-white border-2 border-gray-800">
              Mercury
            </div>
            <div
              className="absolute right-20 pt-[2px]"
              onClick={() => {
                setPlanetData(
                  (prev: {
                    display: PlanetDisplay;
                    planets: Orbital_Data[];
                  }) => {
                    const change = !prev.display.mercury;
                    console.log(change);
                    return {
                      ...planetData,
                      display: {
                        ...planetData.display,
                        mercury: change
                      }
                    };
                  }
                );
              }}
            >
              <div className="pr-2">
                <SliderOn id="tab4Toggle1" />
              </div>
            </div>
          </div>
          <div className="flex p-2">
            <div className="px-2 mr-2 rounded bg-gray-700 text-white border-2 border-gray-800">
              Venus
            </div>
            <div
              className="absolute right-20 pt-[2px]"
              onClick={() => {
                setPlanetData(
                  (prev: {
                    display: PlanetDisplay;
                    planets: Orbital_Data[];
                  }) => {
                    const change = !prev.display.venus;
                    console.log(change);
                    return {
                      ...planetData,
                      display: {
                        ...planetData.display,
                        venus: change
                      }
                    };
                  }
                );
              }}
            >
              <div className="pr-2">
                <SliderOn id="tab4Toggle2" />
              </div>
            </div>
          </div>
          <div className="flex p-2">
            <div className="px-2 mr-2 rounded bg-gray-700 text-white border-2 border-gray-800">
              Earth
            </div>
            <div
              className="absolute right-20 pt-[2px]"
              onClick={() => {
                setPlanetData(
                  (prev: {
                    display: PlanetDisplay;
                    planets: Orbital_Data[];
                  }) => {
                    const change = !prev.display.earth;
                    console.log(change);
                    return {
                      ...planetData,
                      display: {
                        ...planetData.display,
                        earth: change
                      }
                    };
                  }
                );
              }}
            >
              <div className="pr-2">
                <SliderOn id="tab4Toggle3" />
              </div>
            </div>
          </div>
          <div className="flex p-2">
            <div className="px-2 mr-2 rounded bg-gray-700 text-white border-2 border-gray-800">
              Mars
            </div>
            <div
              className="absolute right-20 pt-[2px]"
              onClick={() => {
                setPlanetData(
                  (prev: {
                    display: PlanetDisplay;
                    planets: Orbital_Data[];
                  }) => {
                    const change = !prev.display.mars;
                    return {
                      ...planetData,
                      display: {
                        ...planetData.display,
                        mars: change
                      }
                    };
                  }
                );
              }}
            >
              <div className="pr-2">
                <SliderOn id="tab4Toggle4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InfoTab4;
