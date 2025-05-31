import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight
} from "react-icons/md";
import StatDisplay from "./StatDisplay";

interface TimeShifterProps {
  requestedOrbitTime: number;
  setRequestedOrbitTime: Function;
}

function TimeShifter({
  requestedOrbitTime,
  setRequestedOrbitTime
}: TimeShifterProps) {
  const unixEpoch = 946684800 * 1000; //Seconds from J1 1970 TO J1 2000
  const formatTime = (time: number) => {
    return new Date(time).toISOString().substring(0, 19);
  };

  const handleClick = (value: string) => {
    let change = 0;
    switch (value) {
      case "-week":
        change = -7 * 24 * 60 * 60 * 1000;
        break;
      case "+week":
        change = 7 * 24 * 60 * 60 * 1000;
        break;
      case "-day":
        change = -1 * 24 * 60 * 60 * 1000;
        break;
      case "+day":
        change = 1 * 24 * 60 * 60 * 1000;
        break;
      case "-hour":
        change = -1 * 60 * 60 * 1000;
        break;
      case "+hour":
        change = 1 * 60 * 60 * 1000;
        break;
      case "-minute":
        change = -1 * 60 * 1000;
        break;
      case "+minute":
        change = 1 * 60 * 1000;
        break;
      default:
        break;
    }
    setRequestedOrbitTime((prev: any) => {
      const change1000 = change;
      return (prev = Number(prev) + change1000);
    });
  };

  return (
    <div className="static">
      <div
        id="timeShifter"
        className="pl-3 pb-2 fixed bottom-[-5px] left-[-5px] w-[105vw] md:left-15 md:bottom-[-10px] md:w-2/5 h-22 border-2 rounded-md transition-all duration-1000 z-10 bg-gray-300"
      >
        {requestedOrbitTime ? (
          <div>
            <div className="flex flex-row justify-evenly ml-[-25px]">
              <div className="w-45">
                <StatDisplay
                  title="Date: "
                  value={formatTime(requestedOrbitTime + unixEpoch).substring(
                    0,
                    10
                  )}
                  type="timeShifter"
                />
              </div>
              <div>
                <StatDisplay
                  title="Time: "
                  value={formatTime(requestedOrbitTime + unixEpoch).substring(
                    11,
                    16
                  )}
                  type="timeShifter"
                />
              </div>
            </div>
          </div>
        ) : null}
        <div className="flex justify-around">
          <div className="border-2 flex my-2 rounded shadow-2xl bg-orange-200">
            <div
              className="w-7 ml-2"
              onClick={() => {
                handleClick("-week");
              }}
            >
              <MdOutlineKeyboardDoubleArrowLeft size={20} />
            </div>
            <div
              className="w-7"
              onClick={() => {
                handleClick("-day");
              }}
            >
              <MdOutlineKeyboardArrowLeft size={20} />
            </div>
            <div
              className="w-7"
              onClick={() => {
                handleClick("+day");
              }}
            >
              <MdOutlineKeyboardArrowRight size={20} />
            </div>
            <div
              className="w-7"
              onClick={() => {
                handleClick("+week");
              }}
            >
              <MdOutlineKeyboardDoubleArrowRight size={20} />
            </div>
          </div>

          <div className="border-2 flex flex-row my-2 bg-orange-200 rounded shadow-2xl">
            <div
              className="w-7 ml-2"
              onClick={() => {
                handleClick("-hour");
              }}
            >
              <MdOutlineKeyboardDoubleArrowLeft size={20} />
            </div>
            <div
              className="w-7"
              onClick={() => {
                handleClick("-minute");
              }}
            >
              <MdOutlineKeyboardArrowLeft size={20} />
            </div>
            <div
              className="w-7"
              onClick={() => {
                handleClick("+minute");
              }}
            >
              <MdOutlineKeyboardArrowRight size={20} />
            </div>
            <div
              className="w-7"
              onClick={() => {
                handleClick("+hour");
              }}
            >
              <MdOutlineKeyboardDoubleArrowRight size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimeShifter;
