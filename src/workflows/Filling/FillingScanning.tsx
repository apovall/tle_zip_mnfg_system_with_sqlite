import { useState, useEffect, useRef, Dispatch, SetStateAction, useContext } from 'react'
import { FillingJobDetails } from "../../types/interfaces";
import QRCodeInputSimple from '../../components/shared/QRCodeInputSimple'
import DispenserDetailDisplay from './DispenserDetailDisplay'
import GenericButton from '../../components/shared/GenericButton';
import { assignFillingSerialsToDispensers } from '../../better-sqlite3';
import { SystemContext } from "../../context/SystemContext";

interface FillingScanningProps {
  jobDetails: FillingJobDetails;
  setFillingSerial: Dispatch<SetStateAction<string>>
  fillingSerial: string;
  setReadComplete: Dispatch<SetStateAction<boolean>>
  readComplete: boolean
}

function FillingScanning({
  jobDetails,
  setFillingSerial,
  fillingSerial,
  setReadComplete,
  readComplete
}: FillingScanningProps) {

  const focus = useRef<HTMLInputElement>(null);
  const systemContext = useContext(SystemContext);


  const [displayedSerial, setDisplayedSerial] = useState<string | null>(null)
  const [saveDisabled, setSaveDisabled] = useState<boolean>(true)
  const [errorStyling, setErrorStyling] = useState<string>("opacity-0")
  const [scannedSerials, setScannedSerials] = useState<Set<string>>(new Set());

  const handleEnter = (e: React.ChangeEvent<HTMLInputElement> & React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter" && e.target.value) {2
      setDisplayedSerial(fillingSerial)
      setSaveDisabled(false)
      // Is new & unique
      if (!scannedSerials.has(fillingSerial)){
        setErrorStyling("opacity-0")
      } else {
        setErrorStyling("opacity-100")
      }
      setFillingSerial("")
    }
      // setReadComplete(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReadComplete(false)
    console.log(e.target)
    setFillingSerial(e.target.value);
  }
  
  const handleSave = () => {
    console.log('saving units')
    assignFillingSerialsToDispensers(jobDetails.jobNumber, scannedSerials)
    systemContext.setPageNumber( systemContext.pageNumber + 1 )
  }

  const handleDelete = (serial:string) => {
    // Delete filling from set only.
    console.log(`Deleting ${serial} from set:`, scannedSerials)
    setScannedSerials((prev) => {
      const updatedSet = new Set(prev)
      updatedSet.delete(serial)
      return new Set(updatedSet)
    })
  }

  useEffect(() => {
    if (displayedSerial !== null && displayedSerial.length > 0){
      setScannedSerials((prev) => {
        const updatedSet = new Set(prev)
        updatedSet.add(displayedSerial)
        return new Set(updatedSet)
      })
    }
  }, [displayedSerial])

  return (
    <div className="w-full mx-auto">
      <div>
        <QRCodeInputSimple 
          label="Scan or enter filling serial number"
          handleInputChange={handleInputChange}
          handleEnter={handleEnter}
          value={fillingSerial}
          focus={focus} 
        />
        <p className={`text-cancel font-semibold text-lg text-center ${errorStyling}`}>Filling serial {displayedSerial} already scanned in this job.</p>
      </div>

      <DispenserDetailDisplay 
        serials={scannedSerials} 
        deleteEntry={handleDelete}
        unitType='Filling Serial'/>

      <div className="flex flex-row justify-center">
        <GenericButton 
          text="Assign serials to dispensers"
          isDisabled={saveDisabled}
          onClickFunction={handleSave}
        />
      </div>
    </div>
  )
}

export default FillingScanning