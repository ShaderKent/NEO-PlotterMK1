interface StatDisplayProps {
  title: string;
  value: string;
}
function StatDisplay({ title, value }: StatDisplayProps) {
  return (
    <div className="flex rounded w-9/10 justify-items-start ml-2 mt-2 shrink shadow-2xl">
      <div
        id="statTitle1"
        className="basis-auto border-2 border-black px-2 rounded bg-green-700 text-black justify-self-start "
      >
        {title}
      </div>
      <div className="basis-auto border-2 px-2 rounded ml-1 bg-white">
        {value}
      </div>
    </div>
  );
}

export default StatDisplay;
