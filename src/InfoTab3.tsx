import StatDisplay from "./StatDisplay";
import type { OrbitingBody } from "./types";

interface InfoTab3Props {
  orbitingBodyArr: Array<OrbitingBody>;
}

function InfoTab3({ orbitingBodyArr }: InfoTab3Props) {
  return (
    <div className="static w-1/3 h-full">
      <div
        id="infoTab3"
        className="fixed left-0 md:left-15 top-15 h-1/3 w-full md:top-23 md:h-2/5 md:w-1/3 z-10 border-2 rounded-md bg-fuchsia-700 transition-all duration-1000"
      >
        <div className="absolute right-0 h-full w-1/10 bg-fuchsia-800 rounded-r-sm inset-ring-2 inset-ring-fuchsia-900"></div>
        {orbitingBodyArr[0] ? (
          <>
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
            <StatDisplay
              title="Relative Speed:"
              value={String(
                orbitingBodyArr[0].closeApproachRelSpeed.toFixed(1) + " km/s"
              )}
              type="tab3"
            />
          </>
        ) : null}
      </div>
    </div>
  );
}

export default InfoTab3;
