function TitleBar() {
  return (
    <>
      <div className="static">
        <h3 className="absolute top-2 right-10 text-xl z-9">
          Near-Earth-Object Orbit Visualizer
        </h3>
        <div className="absolute w-full right-[-20px] top-[-5px]">
          <div className="parallelogram absolute right-0 bg-gray-400 rounded-md border-2"></div>
        </div>
      </div>
    </>
  );
}

export default TitleBar;
