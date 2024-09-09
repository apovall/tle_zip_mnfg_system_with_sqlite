import { useContext } from "react";
import { SystemContext } from "../../context/SystemContext";

function ActionSelector({
  type,
  text,
  disabled = false,
}: {
  type: "test" | "assemble" | "resistor_check";
  text: string;
  disabled?: boolean;
}) {
  const systemContext = useContext(SystemContext);
  const bgColour = type == "test" ? "bg-zip-light" : "bg-zip-dark";
  const size = type == "test" ? "w-[500px] h-[500px]" : "w-[225px] h-[225px]";
  const fontSize = type == "test" ? "text-4xl" : "text-2xl";
  const disabledStyling = disabled ? "opacity-50" : "hover:scale-105 hover:rounded-xl cursor-pointer";

  return (
    <div
      className={
        `${size} ${bgColour} ${disabledStyling}
        flex flex-row justify-center 
        mx-20 rounded-md transition-transform 
        `}
      onClick={() => {
        // Temporarily disabled
        if (type=='test'){
          systemContext.setPageNumber(0)
          systemContext.setActiveJob(type)
        }
        if (type=='resistor_check'){
          systemContext.setPageNumber(3)
          systemContext.setActiveJob(type)
        }
      }}
    >
      <h1 className={`${fontSize} self-center text-white text-center mx-4`}>{text}</h1>
    </div>
  );
}

export default ActionSelector;
