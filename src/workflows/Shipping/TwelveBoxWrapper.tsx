import { useState, useContext, useEffect, useRef, ChangeEvent } from "react";
import { SystemContext } from "../../context/SystemContext";
import QRCodeInputSimple from "../../components/shared/QRCodeInputSimple";
import NextButton from "../../components/shared/NextButton";
import BackButton from "../../components/shared/BackButton";
import CancelJobGeneric from "../../components/shared/CancelJobGeneric";
import DispenserDetailDisplay from "../Filling/DispenserDetailDisplay";
import { createSixPackEntry } from "../../better-sqlite3";
import GenericButton from "../../components/shared/GenericButton";

function SixPackWrapper() {
  const { pageNumber, setPageNumber } = useContext(SystemContext);

  const packSize = 12;
  let componentBlock;
  const [ qrCode, setQRCode ] = useState<string>("");
  const [ shippingSerial, setShippingSerial ] = useState<string>("");
  const [ dispenserType, setDispenserType ] = useState<string>("Lure");
  const [ dispenserSerial, setDispenserSerial ] = useState<Set<string>>(new Set());
  const [ errorStyling, setErrorStyling ] = useState<string>("opacity-0")
  const [ errorMsg, setErrorMsg ] = useState<string>("")
  const [ successMsg, setSuccessMsg ] = useState<string>("")
  
  const focus = useRef<HTMLInputElement>(null)

  const isCorrectDispenserType = (serial: string, dispenserType: string) => {
    const regex = /^[A-B][0-9]{7}$/

    if (dispenserSerial.has(serial)){
      setErrorStyling("opacity-100")
      setErrorMsg(`Unit ${qrCode} already scanned in this job.`)
      return false
    }

    if (dispenserSerial.size == packSize){
      setErrorStyling("opacity-100")
      setErrorMsg("6 Pack is full")
      return false
    }

    if (regex.test(serial)){
      if (dispenserType == "Lure" && serial[0] == "B"){
        return true
      } else if (dispenserType == "Zero" && serial[0] == "A"){
        return true
      } else {
        setErrorStyling("opacity-100")
        setErrorMsg("Incorrect unit type for box.")
        return false
      }
    } else {
      setErrorStyling("opacity-100")
      setErrorMsg("Invalid serial number")
      return false
    }
  }

  const handleDispenserEnter = (e: React.ChangeEvent<HTMLInputElement> & React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter" && e.target.value) {
      if (isCorrectDispenserType(qrCode, dispenserType)){
        setDispenserSerial((prev) => {
          let updatedSerials = new Set(prev)
          updatedSerials.add(qrCode)
          return updatedSerials
        })
        setErrorStyling("opacity-0")
      } else {
        setQRCode("")
        return
      }
      setErrorMsg("")
      setQRCode("")
    }     
  }

  const handleShippingChange = (e: ChangeEvent<HTMLInputElement>) => {
    setShippingSerial(e.target.value)
  }
  
  const handleDispenserChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQRCode(e.target.value)
  }

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setDispenserType(e.target.value)
  }

  const handleDelete = (dispenserSerial:string) => {
    setDispenserSerial((prev) => {
      let updatedSerials = new Set(prev)
      updatedSerials.delete(dispenserSerial)
      return updatedSerials
    })
    setQRCode("")
    focus.current?.focus()
  }

  const handleSave = () => {
    createSixPackEntry(shippingSerial, dispenserSerial, dispenserType)
    setPageNumber(1)
    setSuccessMsg("6 Pack saved successfully to database")
    setShippingSerial("")
    setErrorMsg("")
    setDispenserSerial(new Set())
  }

  switch (pageNumber) {
    case 1:
      componentBlock = (
        <>
        <p className="text-acceptable-green text-3xl text-center py-4 font-semibold">{successMsg}</p>
        <div className="flex flex-col justify-center">
          <QRCodeInputSimple 
            label="Scan or enter dispenser serial"
            handleInputChange={handleShippingChange}
            handleEnter={() => {}}
            value={shippingSerial}
            focus={focus} 
          />
          <div className="w-1/2 text-right mx-auto my-4 self-center">
            <div className="flex flex-row justify-center">
              <h3 className='basis-1/3 text-lg mx-4 self-center font-bold '>Unit Type</h3>
              <select 
                name="dispenser_type" 
                id="dispenser_type" 
                onChange={handleSelect}
                className="basis-2/3 border-2 border-zip-dark rounded-lg p-4 self-center"
                >
                <option value="Lure" selected={dispenserType == "Lure" ? true : false}>H2 Lure</option>
                <option value="Zero" selected={dispenserType == "Zero" ? true : false}>H2 Zero</option>
              </select>
            </div>
          </div>
        </div>
          <NextButton
            text="Next"
            isDisabled={shippingSerial == null || shippingSerial.length < 1 }
          />
          <CancelJobGeneric text="Cancel Job" />
        </>
      );
      break;
    case 2:
      componentBlock = (
        <>
          <QRCodeInputSimple 
            label="Scan or enter dispenser serial"
            handleInputChange={handleDispenserChange}
            handleEnter={handleDispenserEnter}
            value={qrCode}
            focus={focus} 
          />
          <p className={`text-cancel font-semibold text-lg text-center ${errorStyling}`}>{errorMsg}</p>
          <DispenserDetailDisplay 
            serials={dispenserSerial}
            deleteEntry={handleDelete}
            unitType={dispenserType}
          />

          <GenericButton 
            text={"SAVE 6 PACK DETAILS"}
            isDisabled={!(dispenserSerial.size == packSize)}
            marginOverride={'mt-20'}
            onClickFunction={handleSave}
          />
          <BackButton text="Back" />
        </>
      );
      break;

    default:
      componentBlock = <>placeholder</>;
      break;
  }

  return (
    <div className="w-full mt-16 flex flex-col justify-center">
      {componentBlock}
    </div>
  )
}

export default SixPackWrapper