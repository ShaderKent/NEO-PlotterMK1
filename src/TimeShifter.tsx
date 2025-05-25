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
        className="absolute bottom-5 left-15 md:w-1/4 h-5 md:h-1/8 border-2 rounded-md transition-all duration-1000 z-10 bg-gray-200"
      >
        {requestedOrbitTime ? (
          <>
            <div className="flex flex-row ml-3">
              <StatDisplay
                title="Date: "
                value={formatTime(requestedOrbitTime).substring(0, 10)}
                type="tab3"
              />
              <StatDisplay
                title="Time: "
                value={formatTime(requestedOrbitTime).substring(11, 16)}
                type="tab3"
              />
            </div>
          </>
        ) : null}
        <div className="flex w-9/10 justify-around ml-6">
          <div className="border-2 flex my-2">
            <div
              onClick={() => {
                handleClick("-week");
              }}
            >
              <MdOutlineKeyboardDoubleArrowLeft size={20} />
            </div>
            <div
              onClick={() => {
                handleClick("-day");
              }}
            >
              <MdOutlineKeyboardArrowLeft size={20} />
            </div>
            <div
              onClick={() => {
                handleClick("+day");
              }}
            >
              <MdOutlineKeyboardArrowRight size={20} />
            </div>
            <div
              onClick={() => {
                handleClick("+week");
              }}
            >
              <MdOutlineKeyboardDoubleArrowRight size={20} />
            </div>
          </div>

          <div className="border-2 flex flex-row my-2">
            <div
              onClick={() => {
                handleClick("-hour");
              }}
            >
              <MdOutlineKeyboardDoubleArrowLeft size={20} />
            </div>
            <div
              onClick={() => {
                handleClick("-minute");
              }}
            >
              <MdOutlineKeyboardArrowLeft size={20} />
            </div>
            <div
              onClick={() => {
                handleClick("+minute");
              }}
            >
              <MdOutlineKeyboardArrowRight size={20} />
            </div>
            <div
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
