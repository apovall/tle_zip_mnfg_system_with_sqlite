import { useContext } from "react";
import { SystemContext } from "../../context/SystemContext";

function ActionSelector({
  type,
  text,
}: {
  type: "test" | "assemble";
  text: string;
}) {
  const systemContext = useContext(SystemContext);
  const bgColour = type == "test" ? "bg-zip-light" : "bg-zip-dark";

  return (
    <div
      className={`w-[500px] h-[500px] ${bgColour} flex flex-row justify-center mx-20 cursor-pointer hover:scale-105 transition-transform hover:rounded-xl`}
      onClick={() => {
        systemContext.setPageNumber(0)
        systemContext.setActiveJob(type)
      }}
    >
      <h1 className="self-center text-white text-4xl">{text}</h1>
    </div>
  );
}

export default ActionSelector;
