import { useState, useContext, useEffect, useRef } from "react";
import { SystemContext } from "../../context/SystemContext";
import { readTable } from "../../better-sqlite3";

import { AssemblyJobDetails } from "../../types/interfaces";

import UnitScanning from "./UnitScanning";

import QRCodeBatchInput from "../../components/shared/QRCodeBatchInput";
import NextButton from "../../components/shared/NextButton";
import CompleteAssemblyButton from "../../components/shared/CompleteAssemblyButton";
import BackButton from "../../components/shared/BackButton";
import { BatchCodesProps } from "../../types/interfaces";
import CancelJobGeneric from "../../components/shared/CancelJobGeneric";

import { saveAssemblyResults } from "../../better-sqlite3";

/* 
  Need new database
  Need database look up based on QR code being scanned, if QR code is a body assembly type
  Need QR code scanner

*/

function AssemblyWrapper() {
  const { pageNumber, setPageNumber } = useContext(SystemContext);
  
  const focus = useRef<HTMLInputElement>(null);

  let componentBlock;
  const [ batchNumber, setBatchNumber ] = useState<string | null>("");
  const [ readComplete, setReadComplete ] = useState<boolean>(false);

  const [batchCodes, setBatchCodes] = useState<BatchCodesProps>({
    pcbSerial: null,
    dispenserSerial: null,
  });

  const [readQuantities, setReadQuantities] = useState<{
    pcbSerial: number | null;
    dispenserSerial: number | null;
  }>({
    pcbSerial: null,
    dispenserSerial: null,
  });

  function disableCompleteButton() {
    if (readQuantities.dispenserSerial == null || readQuantities.pcbSerial == null) {
      return true;
    }
    if (readQuantities.dispenserSerial >= 4) {
      return true;
    }
    return false;
  }

  function lookupSerialNumber(type: string, serialNumber: string) {
    let clause = `WHERE ${type} = '${serialNumber}'`;
    let rows = readTable("zip_h2_assembly", clause); // read entire table
    let lookupKey = type.replace("_serial", "Serial"); // aligning naming conventions to keep things DRYer

    setReadQuantities((prev) => {
      return { ...prev, [lookupKey]: rows.length };
    });
  }

  function saveResults () {
    let dispenserType = 'unknown'
    if (batchCodes.dispenserSerial !== null){
      dispenserType = batchCodes.dispenserSerial[0].toLowerCase() == "a" ? "H2 Zero" : "H2 Lure"
    }

    const data = { 
      batchNumber: batchNumber,
      dispenserSerial: batchCodes.dispenserSerial,
      pcbSerial: batchCodes.pcbSerial,
      dispenserType: dispenserType
    }
    saveAssemblyResults(data)

    // Reset state
    setReadComplete(false)
    setBatchCodes({
      pcbSerial: null,
      dispenserSerial: null,
    })
    setReadQuantities({
      pcbSerial: null,
      dispenserSerial: null,
    })

    console.log('refocusing')
    focus.current?.focus()
  }
  
  switch (pageNumber) {
    case 4:
      componentBlock = (
        <>
          <QRCodeBatchInput
            label="Assembly Batch Number"
            setQRString={setBatchNumber}
            target="qrCode"
            value={batchNumber}
          />
          <NextButton
            text="Next"
            isDisabled={batchNumber == null || batchNumber.length < 1}
          />
          <CancelJobGeneric text="Cancel Job" />
        </>
      );
      break;
    case 5:
      componentBlock = (
        <>
          <UnitScanning
            batchCodes={batchCodes}
            setBatchCodes={setBatchCodes}
            setReadComplete={setReadComplete}
            readQuantities={readQuantities}
            focus={focus}
          />
          <CompleteAssemblyButton
            text="Save & continue"
            isDisabled={disableCompleteButton()}
            saveResults={saveResults}
          />
          <BackButton text="Back" />
        </>
      );
      break;

    default:
      componentBlock = <>placeholder</>;
      break;
  }

  useEffect(() => {
    // If read is complete, then do look up in database
    if (readComplete) {
      if (batchCodes.dispenserSerial) {
        lookupSerialNumber("dispenser_serial", batchCodes.dispenserSerial);
      }
      if (batchCodes.pcbSerial) {
        lookupSerialNumber("pcb_serial", batchCodes.pcbSerial);
      }
      // lookupSerialNumber(batchCodes.pcbSerial, "pcb_serial")
    }
  }, [batchCodes, readComplete]);

  useEffect(() => {
    console.log(readQuantities);
  }, [readQuantities]);

  return (
    <div className="w-full h-screen flex flex-col justify-center">
      {componentBlock}
    </div>
  );
}

export default AssemblyWrapper;

