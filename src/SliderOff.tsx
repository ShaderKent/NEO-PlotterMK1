interface SliderOffProps {
  id: string;
}

function SliderOff({ id }: SliderOffProps) {
  const togglePeg = document.getElementById(id);

  const handleClick = () => {
    togglePeg?.classList.toggle("justify-self-end");
    togglePeg?.classList.toggle("justify-self-start");
    togglePeg?.classList.toggle("bg-gray-800");
    togglePeg?.classList.toggle("bg-green-600");
  };
  return (
    <div
      className="absolute w-14 h-6 bg-gray-300 rounded-4xl border-2"
      onClick={() => {
        handleClick();
      }}
    >
      <div
        id={id}
        className="justify-self-end my-[1px] mx-[2px] h-[18px] w-[18px] bg-gray-800 rounded-4xl"
      ></div>
    </div>
  );
}

export default SliderOff;
