export function Spinner() {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="loading loading-ring loading-xl text-[#D2531E]">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
