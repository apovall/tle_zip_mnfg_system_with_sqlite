import { useState, SetStateAction, Dispatch, useEffect, useRef } from "react";
import QRCodeInputSimple from "../../components/shared/QRCodeInputSimple";
import { FillingJobDetails } from "../../types/interfaces";
import NextButton from "../../components/shared/NextButton";
import { createDispenserFillingEntry, removeDispenserFillingEntry } from "../../better-sqlite3";
import DispenserDetailDisplay from "./DispenserDetailDisplay";

interface DispenserScanningProps {
  jobDetails: FillingJobDetails;
  setQRCode: Dispatch<SetStateAction<string>>;
  qrCode: string;
  setReadComplete: Dispatch<SetStateAction<boolean>>;
  readComplete: boolean;
  scannedSerials: Set<string>;
  setScannedSerials: Dispatch<SetStateAction<Set<string>>>;
}

function DispenserScanning({
  jobDetails, 
  setQRCode, 
  qrCode, 
  setReadComplete, 
  readComplete,
  scannedSerials,
  setScannedSerials
}: DispenserScanningProps) {

  const focus = useRef<HTMLInputElement>(null)

  const [displayedQR, setDisplayedQR] = useState<string | null>(null)
  const [nextDisabled, setNextDisabled] = useState<boolean>(true)
  const [errorStyling, setErrorStyling] = useState<string>("opacity-0")
  // const [scannedSerials, setScannedSerials] = useState<Set<string>>(new Set());

  const handleEnter = (e: React.ChangeEvent<HTMLInputElement> & React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter" && e.target.value) {
      const regex = /^[A-B][0-9]{7}$/
      if (qrCode && regex.test(qrCode)){
        setDisplayedQR(qrCode)
        setNextDisabled(false)
        // Is new & unique
        if (!scannedSerials.has(qrCode)){
          createDispenserFillingEntry(jobDetails.jobNumber, qrCode)
          setErrorStyling("opacity-0")
        } else {
          setErrorStyling("opacity-100")
        }
        // Save entry to database

      } else if (qrCode !== null && readComplete){
        setDisplayedQR("Invalid serial number")
        setNextDisabled(true)
      }
      setQRCode("")
      // setReadComplete(true)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReadComplete(false)
    console.log(e.target)
    setQRCode(e.target.value);
  }

  const handleDelete = (dispenserSerial:string) => {
    removeDispenserFillingEntry(jobDetails.jobNumber, dispenserSerial)
    setScannedSerials((prev) => {
      let updatedSerials = new Set(prev)
      updatedSerials.delete(dispenserSerial)
      return updatedSerials
    })
    setQRCode("")
    setDisplayedQR("")
    focus.current?.focus()
  }

  useEffect(() => {
    if (displayedQR !== null && displayedQR.length > 0 && displayedQR !== "Invalid serial number"){
      setScannedSerials((prev) => {
        const updatedSet = new Set(prev)
        updatedSet.add(displayedQR)
        return new Set(updatedSet)
      })
    }
  }, [displayedQR])

  useEffect(() => {
    console.log('in here', scannedSerials)
    if (scannedSerials.size == 0){
      setNextDisabled(true)
    } else {
      setNextDisabled(false)
    }
  }, [scannedSerials])



  return (
    <div className="w-full mx-auto">
      <div>
        <QRCodeInputSimple 
          label="Scan or enter dispenser serial"
          handleInputChange={handleInputChange}
          handleEnter={handleEnter}
          value={qrCode}
          focus={focus} 
        />
        <p className={`text-cancel font-semibold text-lg text-center ${errorStyling}`}>Unit {displayedQR} already scanned in this job.</p>
      </div>

      <DispenserDetailDisplay 
        serials={scannedSerials}
        deleteEntry={handleDelete}
        unitType="Dispenser"
        />

      <div className="flex flex-row justify-center">
        <NextButton 
          text="Assign Filling Serial Numbers"
          isDisabled={nextDisabled}
        />
      </div>
    </div>
  )
}

export default DispenserScanning
