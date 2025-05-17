import { useState } from "react";
import type { ChangeEvent, MouseEvent } from "react";
import type { OrbitingBody } from "./types";

interface Props {
  setAPI: Function;
  orbitingBodyArr: OrbitingBody[] | undefined;
}

function Input({ setAPI, orbitingBodyArr }: Props) {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleClick = (event: MouseEvent) => {
    console.log(inputValue);
    setAPI(Number(inputValue));
  };

  return (
    <>
      <input type="number" value={inputValue} onChange={handleChange} />
      <button onClick={handleClick}>Submit</button>
      {orbitingBodyArr ? (
        <p>
          {/* {orbitingBodyArr[1].orbitalData.M
            ? orbitingBodyArr[1].orbitalData.M
            : "poopie"} */}
        </p>
      ) : (
        <p>Waiting</p>
      )}
    </>
  );
}
export default Input;
