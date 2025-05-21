import { useState, type ChangeEvent } from "react";
import type { API_Response_List_Data, OrbitingBody } from "./types";
import { FaArrowAltCircleDown } from "react-icons/fa";

interface InfoTab1Props {
  setAPI_Request_Id: Function;
  setAPI_Request_Date: Function;
  API_NEO_List: any[];
  orbitingBodyArr: Array<OrbitingBody>;
}

function InfoTab1({
  setAPI_Request_Id,
  setAPI_Request_Date,
  API_NEO_List,
  orbitingBodyArr
}: InfoTab1Props) {
  //Constants
  const dropDownTop = document.getElementById("dropDownTop");

  const getFormattedCurrentDate = () => {
    const currentDate = new Date();
    currentDate.toISOString().substring(0, 10);
    return String(currentDate);
  };

  //State Variable
  const [selectedDate, setSelectedDate] = useState<string>(
    getFormattedCurrentDate()
  );

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
    setAPI_Request_Date(event.target.value);
  };
  const handleClickDropDown = () => {
    dropDownTop?.classList.toggle("hidden");
  };
  const handleClickDropDownItem = (dropDownItemId: string) => {
    const id = dropDownItemId;
    setAPI_Request_Id(Number(id));
    dropDownTop?.classList.toggle("hidden");
  };
  return (
    <>
      <div className="static w-1/3 h-full">
        <div
          id="infoTab1"
          className="fixed top-15 left-0 md:left-15 md:h-2/3 h-1/3 z-12 border-2 rounded-md md:w-1/3 w-full bg-green-600 transition-all duration-1000"
        >
          {API_NEO_List ? null : <div className="loadingDiv">Loading...</div>}
          {API_NEO_List ? (
            <>
              <div className="flex flex-row m-2 border-2 box-border rounded-sm">
                <h3 className="px-5 m-auto">NEO Approach Date:</h3>
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
                  className="border-solid border-gray-400 bg-white border-[1px] px-5 rounded cursor-pointer font-bold w-[200px] ml-4 flex justify-between shadow-sm"
                >
                  Options
                  <FaArrowAltCircleDown size={16} className="self-center" />
                </div>
                <div
                  id="dropDownTop"
                  className="rounded border-gray-500 border-2 bg-white py-1 absolute ml-4 w-8/9 my-[1px] shadow-md justify-items-start hidden"
                >
                  {API_NEO_List.map((listItem: API_Response_List_Data) => {
                    return (
                      <div
                        id={listItem.neo_reference_id}
                        onClick={() =>
                          handleClickDropDownItem(
                            String(listItem.neo_reference_id)
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
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default InfoTab1;
