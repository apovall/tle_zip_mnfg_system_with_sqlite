import { useContext } from "react";
import { SystemContext } from "../../context/SystemContext";

function NextButton({ text, isDisabled, pageOverride=null }: { text: string, isDisabled: boolean, pageOverride?:number|null}) {
  const { pageNumber, setPageNumber } = useContext(SystemContext);
  const styling = isDisabled ? "bg-disabled" : "bg-gradient-to-r from-zip-light to-zip-dark hover:scale-105"


  return (
    <button
      className={`mt-40 w-1/2 text-white text-2xl self-center rounded-2xl py-4 ${styling} uppercase  transition-transform`}
      disabled={isDisabled}
      onClick={() => setPageNumber(pageOverride ? pageOverride : pageNumber + 1)}
    >
      {text}
    </button>
  );
}

export default NextButton;
