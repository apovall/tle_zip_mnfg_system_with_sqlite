import { useContext, Dispatch, SetStateAction, useEffect, useRef } from "react";
import { SystemContext } from "../../context/SystemContext";
import { UnitDetails } from "@/types/interfaces";

interface CompleteTestButtonProps {
  text: string;
  isDisabled: boolean;
  pageTarget: number;
  unitDetails: UnitDetails;
  baseUnitDetails: UnitDetails;
  setUnitDetails: Dispatch<SetStateAction<UnitDetails>>;
  setTestingInProgress: Dispatch<SetStateAction<boolean>>;
}

function CompleteTestButton({
  text,
  isDisabled,
  setTestingInProgress,
  pageTarget,
  unitDetails,
  baseUnitDetails,
  setUnitDetails
}: CompleteTestButtonProps) {
  const { setPageNumber } = useContext(SystemContext);
  const focusButton = useRef<HTMLButtonElement>(null)

  const styling = isDisabled
    ? "bg-disabled"
    : "bg-gradient-to-r from-zip-light to-zip-dark hover:scale-105";

  const resetAndContinue = () => {
    baseUnitDetails = {
      ...baseUnitDetails, 
      resistorLoaded: unitDetails['resistorLoaded'], 
      batchNumber: unitDetails['batchNumber']
    }
      setPageNumber(pageTarget)
      setUnitDetails(baseUnitDetails)
      setTestingInProgress(true)
  }

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
          resetAndContinue()
        }
      }}
      onClick={resetAndContinue}
    >
      {text}
    </button>
  );
}

export default CompleteTestButton;
