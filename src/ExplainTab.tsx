import { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";

function ExplainTab() {
  const explainTab = document.querySelector("#explainTab");
  const [toggle, setToggle] = useState<Boolean>(false);

  const handleClick = () => {
    if (!toggle) {
      setToggle(true);

      explainTab?.classList.remove("left-[-4px]");
      explainTab?.classList.add("left-140");
    } else {
      setToggle(false);

      explainTab?.classList.add("left-[-4px]");
      explainTab?.classList.remove("left-140");
    }
  };
  return (
    <div
      id="explainTab"
      className="flex
       fixed top-15 md:top-3 left-[-1000px] md:left-15 pb-2 pr-6 z-12 border-2 rounded-md w-15 bg-gray-400 transition-all duration-1000"
    >
      <div className="w-16 h-full mt-[6px] ml-3" onClick={handleClick}>
        <FaQuestionCircle size={32} className="text-white" />
      </div>
      <div
        id="foldOutSlider"
        className="absolute left-0 w-130 max-w-[100vw] rounded bg-gray-400 text-sm"
      >
        <div className="p-2 flex flex-wrap">
          <h3>Welcome! This is a near-Earth-object (NEO) visualizer.</h3>
          <p>Data is pulled from NASA's NEO API. (https://api.nasa.gov/neo/)</p>
          <p>
            The "green" tab allows the selection of specific dates and objects.
          </p>
          <p>- NEO's are sorted by the time of approach to Earth.</p>
          <p>
            Orbits are calculated from the six parameters listed in the "blue"
            tab.
          </p>
          <p>
            You can select each object's closest known approach on the "purple"
            tab.
          </p>
          <p>
            The "orange" tab toggles a time-stepper, allowing you to control
            time.
          </p>
          <hr></hr>
          <p>
            <a href="https://github.com/ShaderKent/NEO-PlotterMK1">
              Source code
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ExplainTab;
