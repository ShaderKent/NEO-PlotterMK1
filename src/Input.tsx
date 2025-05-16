import type { Orbital_Data, OrbitingBody } from "./types";

interface Props {
  setAPI: Function;
  orbitingBody: OrbitingBody | undefined;
}

function Input({ setAPI, orbitingBody }: Props) {
  return (
    <>{orbitingBody ? <p>{orbitingBody.orbitalData.M}</p> : <p>Waiting</p>}</>
  );
}
export default Input;
