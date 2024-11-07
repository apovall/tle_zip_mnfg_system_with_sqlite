import { useState, useContext, useEffect } from "react";
import { SystemContext } from "../../context/SystemContext";
import NextButton from "../../components/shared/NextButton";
import CancelJobGeneric from "../../components/shared/CancelJobGeneric";
import BackButton from "../../components/shared/BackButton";
import DispenserScanning from "./DispenserScanning";
import TextInput from "../../components/shared/TextInput";
import FillingScanning from "./FillingScanning";

import { FillingJobDetails } from "../../types/interfaces";
import JobComplete from "../shared/JobComplete";

function DispenserFillingWrapper() {
  let componentBlock;
  const { pageNumber, setPageNumber } = useContext(SystemContext);
  
  const [qrCode, setQRCode] = useState<string>("");
  const [fillingSerial, setFillingSerial] = useState<string>("");
  const [readComplete, setReadComplete] = useState<boolean>(false);
  const [jobDetails, setJobDetails] = useState<FillingJobDetails>({jobNumber: ""});
  const [dispenserSerials, setDispenserialSerials] = useState<Set<string>>(new Set());
  const [fillingSerials, setFillingSerials] = useState<Set<string>>(new Set());

  const handleComplete = () => {
    // Handle data reset and navigation
    setDispenserialSerials(new Set())
    setJobDetails({jobNumber: ""})
    setPageNumber(5);
  }
  
  useEffect(() => {
    console.log(jobDetails["jobNumber"])
  }, [jobDetails])

  switch (pageNumber) {
    case 5:
      componentBlock = (
        <>
          <div className="flex flex-col justify-center">
            <TextInput
              label="Filling Job Number"
              setInputValues={setJobDetails}
              target="jobNumber"
              value={jobDetails["jobNumber"]}
              submitOverride={false}
              autoFocus={true}
            />
          </div>
          <NextButton
            text="Next"
            isDisabled={
              jobDetails.jobNumber == "" ||
              jobDetails.jobNumber.length < 1
            }
            marginOverride="mt-20"
          />
          <CancelJobGeneric text="Cancel Job" marginOverride="mt-4" />
        </>
      );
      break;
    case 6:
      componentBlock = (
        <>
          <div className="h-screen flex flex-col justify-center">
            <DispenserScanning 
              jobDetails={jobDetails}
              setQRCode={setQRCode}
              qrCode={qrCode}
              setReadComplete={setReadComplete} 
              readComplete={readComplete}
              scannedSerials={dispenserSerials}
              setScannedSerials={setDispenserialSerials}
            />
          </div>
          <div className="flex flex-row justify-between">
            <BackButton text="Back" marginOverride="mb-10" />
            {/* <GoToFillingsSerials text="Go" marginOverride="mt-10" /> */}

          </div>
        </>
      );
      break;
    case 7:
      componentBlock = (
        <>
          <div className="h-screen flex flex-col justify-center">
            <FillingScanning 
              jobDetails={jobDetails}
              setFillingSerial={setFillingSerial}
              fillingSerial={fillingSerial}
              setReadComplete={setReadComplete}
              readComplete={readComplete}
              scannedSerials={fillingSerials}
              setScannedSerials={setFillingSerials}
            />
          </div>
          <div className="flex flex-row justify-between">
            <BackButton text="Back" marginOverride="mb-10" />
            {/* <GoToFillingsSerials text="Go" marginOverride="mt-10" /> */}

          </div>
        </>
      );
      break;
      case 8:
        // setQRCode("")
        // setFillingSerial("")
        // setJobDetails({jobNumber: ""})
        componentBlock = (
          <>
            <JobComplete handleComplete={handleComplete}/>
          </>
        )
    default:
      break;
  }

  return (
    <div className="w-full mt-16 flex flex-col justify-center">
      {componentBlock}
    </div>
  );
}

export default DispenserFillingWrapper;
