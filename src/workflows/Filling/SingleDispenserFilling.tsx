import { useState, SetStateAction, Dispatch, useEffect } from "react";
import QRCodeBatchInput from "../../components/shared/QRCodeBatchInput";
import { FillingJobDetails } from "../../types/interfaces";
import SaveDispenserFillingButton from "./SaveDispenserFillingButton";
import { readDispenserFillingDetails, createDispenserFillingEntry } from "../../better-sqlite3";
import DispenserDetailDisplay from "./DispenserDetailDisplay";

interface SingleDispenserFillingProps {
  jobDetails: FillingJobDetails
  setQRCode: Dispatch<SetStateAction<string | null>>
  qrCode: string | null
  setReadComplete: Dispatch<SetStateAction<boolean>>
  readComplete: boolean
}



function SingleDispenserFilling({jobDetails, setQRCode, qrCode, setReadComplete, readComplete}: SingleDispenserFillingProps) {

  const [unitFills, setUnitFills] = useState<number | null>(null)
  const [displayedQR, setDisplayedQR] = useState<string | null>(null)
  const [nextDisabled, setNextDisabled] = useState<boolean>(true)
  const [errorMessage, setErrorMesssage] = useState<string>("")

  const handleSave = () => {
    // Save updated refill number
    if (unitFills === null || qrCode == null){
      console.log('in this error message')
      setErrorMesssage(`Could not save dispenser filling entry. unitFills:${unitFills} | qrCode:${qrCode}`, )
      return
    }
    createDispenserFillingEntry(jobDetails.jobNumber, qrCode, unitFills + 1)
    setUnitFills(null)
    setDisplayedQR(null)
    setReadComplete(false)
    setNextDisabled(true)
  }

  useEffect(() => {
    const regex = /^[A-B][0-9]{7}$/
    
    if (qrCode && regex.test(qrCode) && readComplete){
      const results = readDispenserFillingDetails(jobDetails.jobNumber, qrCode)
      if(results instanceof Error){
        console.log('error')
      } else {
        console.log('read is complete', results)
        setDisplayedQR(qrCode)
        setReadComplete(false)
        setUnitFills(results?.times_filled)
        if (results?.times_filled !== null && results?.times_filled < 5){
          setNextDisabled(false)
        } else {
          setNextDisabled(true)
        }
      }
    } else if (qrCode !== null && readComplete){
      setDisplayedQR("Invalid serial number")
      setUnitFills(null)
      setReadComplete(false)
      setNextDisabled(true)
    }

  }, [readComplete])

  return (

    <div className="w-1/2">
      <QRCodeBatchInput
        label="Dispenser Serial Number"
        setQRString={setQRCode}
        target="qrCode"
        value={qrCode}
        submitOverride={true}
        setReadComplete={setReadComplete}
        autoFocus={false}
        resetQRString={false}
      />
      <DispenserDetailDisplay 
        serial={displayedQR}
        fills={unitFills}
      />
      <div className="flex flex-row justify-center">
        <SaveDispenserFillingButton 
          text="SAVE & NEXT"
          isDisabled={nextDisabled}
          handleSave={handleSave}
        />
        <p className="text-cancel text-sm">{errorMessage}</p>

      </div>
    </div>
  )
}

export default SingleDispenserFilling
  {/* <NextButton 
      text="GO"
      isDisabled = {false}
      pageOverride = {null}
    /> */}