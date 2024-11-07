import { useContext } from "react";
import { SystemContext } from "../../context/SystemContext";

function ActionSelector({
  type,
  text,
  disabled = false,
}: {
  type: "test" | "assemble" | "resistor_check" | "fill_dispeners" | "box_shipping" | "6_pack" | "72_pack";
  text: string;
  disabled?: boolean;
}) {
  const systemContext = useContext(SystemContext);
  const bgColour = type == "test" || type == 'assemble' ? "bg-zip-light" : "bg-zip-dark";
  let size = type == "test" ? "w-[500px] h-[500px]" : "w-[225px] h-[225px]";
  size = type == "assemble" ? "w-[225px] h-[500px]" : size;
  const fontSize = type == "test" ? "text-4xl" : "text-2xl";
  const disabledStyling = disabled ? "opacity-50" : "hover:scale-105 hover:rounded-xl cursor-pointer disabled";

  return (
    <div
      className={
        `${size} ${bgColour} ${disabledStyling}
        flex flex-row justify-center 
        mx-20 rounded-md transition-transform 
        `}
      onClick={() => {
        if (disabled) {
          return;
        }
        switch (type) {
          case 'test':
            systemContext.setPageNumber(0)
            break;
          case 'resistor_check':
            systemContext.setPageNumber(3)
          break;
          case 'assemble':
            systemContext.setPageNumber(4)
          break;
          case 'fill_dispeners':
            systemContext.setPageNumber(5)
          break;
          case '6_pack':
            systemContext.setPageNumber(1)
          break;
          default:
            return
        }
        systemContext.setActiveJob(type)
      }}
    >
      <h1 className={`${fontSize} self-center text-white text-center mx-4`}>{text}</h1>
    </div>
  );
}

export default ActionSelector;
