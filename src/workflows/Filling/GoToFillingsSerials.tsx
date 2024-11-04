import { useContext } from "react";
import { SystemContext } from "../../context/SystemContext";

interface GoToFillingsSerialsProps {
  text: string;
  marginOverride?: string;
}

function GoToFillingsSerials({
  text,
  marginOverride = "mt-40",
}: GoToFillingsSerialsProps) {
  const { pageNumber, setPageNumber } = useContext(SystemContext);

  return (
    <button
      className={`
          self-end mx-4 ${marginOverride} 
          text-2xl border-2 bg-acceptable-green
           text-white hover:scale-105 rounded-2xl
           py-2 px-8 uppercase transition-all`}
      onClick={() => {
        setPageNumber(pageNumber + 1);
      }}
    >
      {text}
    </button>
  );
}

export default GoToFillingsSerials;
