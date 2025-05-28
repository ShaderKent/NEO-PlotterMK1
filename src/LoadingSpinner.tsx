import { BiAnalyse } from "react-icons/bi";

function LoadingSpinner() {
  return (
    <div className="rotate">
      <div className="colorSpin">
        <BiAnalyse id="loadingIcon" />
      </div>
    </div>
  );
}

export default LoadingSpinner;
