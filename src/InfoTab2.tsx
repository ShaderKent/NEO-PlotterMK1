import StatDisplay from "./StatDisplay";
import type { OrbitingBody } from "./types";

interface InfoTab2Props {
  orbitingBodyArr: Array<OrbitingBody>;
}

function InfoTab3({ orbitingBodyArr }: InfoTab2Props) {
  return (
    <>
      <div className="static w-1/3 h-full">
        <div
          id="infoTab2"
          className="fixed left-0 md:left-15 top-15 md:top-19 pb-3 w-full md:w-2/5 z-11 border-2 rounded-md bg-cyan-600 transition-all duration-1000"
        >
          <div className="absolute right-0 h-full w-1/10 bg-cyan-800 rounded-r-sm inset-ring-2 inset-ring-cyan-900"></div>

          {orbitingBodyArr[0] ? (
            <>
              <StatDisplay
                title="Mean Anomaly (M)"
                value={
                  String(orbitingBodyArr[0].orbitalData.M.toFixed(7)) + " °"
                }
                type="tab2"
              />
              <StatDisplay
                title="Eccentricity (e)"
                value={String(orbitingBodyArr[0].orbitalData.e.toFixed(7))}
                type="tab2"
              />
              <StatDisplay
                title="Inclination (i)"
                value={
                  String(orbitingBodyArr[0].orbitalData.i.toFixed(7)) + " °"
                }
                type="tab2"
              />
              <StatDisplay
                title="Ascending-Node L. (Ω)"
                value={
                  String(orbitingBodyArr[0].orbitalData.o.toFixed(7)) + " °"
                }
                type="tab2"
              />
              <StatDisplay
                title="Perihelion Arg. (ω)"
                value={
                  String(orbitingBodyArr[0].orbitalData.p.toFixed(7)) + " °"
                }
                type="tab2"
              />
              <StatDisplay
                title="Perihelion distance (q)"
                value={
                  String(orbitingBodyArr[0].orbitalData.q.toFixed(7)) + " A.U"
                }
                type="tab2"
              />
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default InfoTab3;
