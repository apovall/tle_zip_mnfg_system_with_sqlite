import { useState, useContext, useRef, ChangeEvent } from "react";
import { SystemContext } from "../../context/SystemContext";
import QRCodeInputSimple from "../../components/shared/QRCodeInputSimple";
import NextButton from "../../components/shared/NextButton";
import BackButton from "../../components/shared/BackButton";
import CancelJobGeneric from "../../components/shared/CancelJobGeneric";
import DispenserDetailDisplay from "../Filling/DispenserDetailDisplay";
import { createTwelveBoxEntry } from "../../better-sqlite3";
import GenericButton from "../../components/shared/GenericButton";

function TwelveBoxWrapper() {
  const { pageNumber, setPageNumber } = useContext(SystemContext);

  const packSize = 12;
  let componentBlock;
  const [ qrCode, setQRCode ] = useState<string>("");
  const [ shippingSerial, setShippingSerial ] = useState<string>("");
  const [ boxContentsType, setBoxContentsType ] = useState<string>("Lure");
  const [ dispenserSerial, setDispenserSerial ] = useState<Set<string>>(new Set());
  const [ errorStyling, setErrorStyling ] = useState<string>("opacity-0")
  const [ errorMsg, setErrorMsg ] = useState<string>("")
  const [ successMsg, setSuccessMsg ] = useState<string>("")
  const [ shippingLabelError, setShippingLabelError ] = useState<string>("opacity-0")
  
  const focus = useRef<HTMLInputElement>(null)

  const isCorrectShippingType = (serial: string) => {
    const regex = /^[S]-\d{7}$/
    if (regex.test(serial)){
      return true
    }  
    return false
  }

  const handleShippingEnter = (e: React.ChangeEvent<HTMLInputElement> & React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter" && e.target.value) {
      console.log("isCorrectShippingType(shippingSerial)", isCorrectShippingType(shippingSerial)); 
      if (isCorrectShippingType(shippingSerial)){
        setShippingLabelError("opacity-0")
      } else {
        setShippingLabelError("opacity-100")
        setShippingSerial("")
        return
      }
    }
  }

  const isCorrectBoxContentsType = (serial: string, boxContentsType: string) => {
    const regex = /^[A-B]6-[0-9]{7}$/

    if (dispenserSerial.has(serial)){
      setErrorStyling("opacity-100")
      setErrorMsg(`Unit ${qrCode} already scanned in this job.`)
      return false
    }

    if (dispenserSerial.size == packSize){
      setErrorStyling("opacity-100")
      setErrorMsg(`${packSize} Pack is full`)
      return false
    }

    if (regex.test(serial)){
      if (boxContentsType == "Lure" && serial[0] == "B"){
        return true
      } else if (boxContentsType == "Zero" && serial[0] == "A"){
        return true
      } else {
        setErrorStyling("opacity-100")
        setErrorMsg("Incorrect unit type for this box.")
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
      console.log(1);
      if (isCorrectBoxContentsType(qrCode, boxContentsType)){
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
    setBoxContentsType(e.target.value)
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
    createTwelveBoxEntry(shippingSerial, dispenserSerial, boxContentsType)
    setPageNumber(1)
    setSuccessMsg("12 Pack Box saved successfully to database")
    setShippingSerial("")
    setErrorMsg("")
    setDispenserSerial(new Set())
    setShippingLabelError("opacity-0")
  }

  switch (pageNumber) {
    case 1:
      componentBlock = (
        <>
        <p className="text-acceptable-green text-3xl text-center py-4 font-semibold">{successMsg}</p>
        <div className="flex flex-col justify-center">
          <QRCodeInputSimple 
            label="Scan or enter shipping box serial"
            handleInputChange={handleShippingChange}
            handleEnter={handleShippingEnter}
            value={shippingSerial}
            focus={focus} 
          />
          <p className={`text-cancel text-lg text-center py-4 font-semibold ${shippingLabelError}`}>Invalid serial or mismatch with selected 6 pack box contents</p>
          <div className="w-1/2 text-right mx-auto my-4 self-center">
            <div className="flex flex-row justify-center">
              <h3 className='basis-1/3 text-lg mx-4 self-center font-bold '>6 Pack Box Contents</h3>
              <select 
                name="dispenser_type" 
                id="dispenser_type" 
                onChange={handleSelect}
                className="basis-2/3 border-2 border-zip-dark rounded-lg p-4 self-center"
                >
                <option value="Lure" selected={boxContentsType == "Lure" ? true : false}>H2 Lure (B)</option>
                <option value="Zero" selected={boxContentsType == "Zero" ? true : false}>H2 Zero (A)</option>
              </select>
            </div>
          </div>
        </div>
          <NextButton
            text="Next"
            isDisabled={shippingSerial == null || shippingSerial.length < 1 || isCorrectShippingType(shippingSerial) == false}
          />
          <CancelJobGeneric text="Finish Job" />
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
            unitType={boxContentsType}
          />

          <GenericButton 
            text={"SAVE 12 BOX DETAILS"}
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

export default TwelveBoxWrapper