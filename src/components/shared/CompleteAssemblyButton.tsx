import { useContext, useRef } from "react";
import { SystemContext } from "../../context/SystemContext";

interface CompleteAssemblyButtonProps {
  text: string;
  isDisabled: boolean;
  pageOverride?: number | null;
  saveResults: React.MouseEventHandler<HTMLButtonElement>;
}

function CompleteAssemblyButton({ text, isDisabled, pageOverride=null, saveResults }: CompleteAssemblyButtonProps) {
  // const { pageNumber, setPageNumber } = useContext(SystemContext);
  const styling = isDisabled ? "bg-disabled" : "bg-gradient-to-r from-zip-light to-zip-dark hover:scale-105"

  return (
    <button
      className={`mt-20 w-1/2 text-white text-2xl self-center rounded-2xl py-4 ${styling} uppercase  transition-transform`}
      disabled={isDisabled}
      onClick={saveResults}
    >
      {text}
    </button>
  );
}

export default CompleteAssemblyButton;
