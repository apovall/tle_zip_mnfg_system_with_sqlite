import { useContext, Dispatch, SetStateAction } from "react";
import { SystemContext } from "../../context/SystemContext";
import { UnitDetails } from "@/types/interfaces";

interface BackButtonProps{
  text:string;
  marginOverride?: string;
  unitDetails?: UnitDetails
  baseUnitDetails?: UnitDetails
  setUnitDetails?: Dispatch<SetStateAction<UnitDetails>>;
}

function BackButton({ text, marginOverride="mt-40", unitDetails, baseUnitDetails, setUnitDetails  }: BackButtonProps) {
  const { pageNumber, setPageNumber } = useContext(SystemContext);

  const resetUnitData = () => {
    if (unitDetails && baseUnitDetails && setUnitDetails){
      baseUnitDetails = {
        ...baseUnitDetails, 
        resistorLoaded: unitDetails['resistorLoaded'], 
        batchNumber: unitDetails['batchNumber']
      }
      setUnitDetails(baseUnitDetails)
    }
  }

  return (
    <button
      className={`self-start mx-4 ${marginOverride} text-2xl border-2 border-zip-dark hover:bg-zip-light hover:text-white hover:scale-105 rounded-2xl py-2 px-8 uppercase transition-colors`}
      onClick={() => {
        setPageNumber(pageNumber - 1)
        resetUnitData()
      }}
    >
      {text}
    </button>
  );
}

export default BackButton;
