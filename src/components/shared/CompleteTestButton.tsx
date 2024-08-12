import { useContext, Dispatch, SetStateAction, useEffect, useRef } from "react";
import { SystemContext } from "../../context/SystemContext";
import { UnitDetails, SetUnitDetails } from "@/types/interfaces";

interface CompleteTestButtonProps {
  text: string;
  isDisabled: boolean;
  pageTarget: number;
  baseUnitDetails: UnitDetails;
  setUnitDetails: Dispatch<SetStateAction<UnitDetails>>;
  setTestingInProgress: Dispatch<SetStateAction<boolean>>;
}

function CompleteTestButton({
  text,
  isDisabled,
  setTestingInProgress,
  pageTarget,
  baseUnitDetails,
  setUnitDetails
}: CompleteTestButtonProps) {
  const { setPageNumber } = useContext(SystemContext);
  const focusButton = useRef<HTMLButtonElement>(null)

  const styling = isDisabled
    ? "bg-disabled"
    : "bg-gradient-to-r from-zip-light to-zip-dark hover:scale-105";


  useEffect(() => {
    if (focusButton.current){
      focusButton.current.focus()
    }
  }, [isDisabled])

  return (
    <button
      className={`mt-10 w-1/2 text-white text-2xl self-center rounded-2xl py-4 ${styling} uppercase  transition-transform`}
      disabled={isDisabled}
      ref={focusButton}
      onKeyDown={(e) => {
        if (e.key == "Enter"){
          setPageNumber(pageTarget)
          setUnitDetails(baseUnitDetails)
          setTestingInProgress(true)
        }
      }}
      onClick={() => {
        setUnitDetails(baseUnitDetails)
        setPageNumber(pageTarget)
        setTestingInProgress(true)
      }}
    >
      {text}
    </button>
  );
}

export default CompleteTestButton;
