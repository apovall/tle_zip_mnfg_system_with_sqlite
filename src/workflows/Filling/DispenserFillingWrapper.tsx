import { useState, useContext, useEffect, useRef } from "react";
import { SystemContext } from "../../context/SystemContext";
import NextButton from "../../components/shared/NextButton";
import CancelJobGeneric from "../../components/shared/CancelJobGeneric";
import PackScanning from "../Shipping/PackScanning";
import BackButton from "../../components/shared/BackButton";
import DispenserScanning from "./DispenserScanning";
import TextInput from "../../components/shared/TextInput";
import CompletePackingButton from "../Shipping/CompletePackingButton";
import GoToFillingsSerials from "./GoToFillingsSerials";
import FillingScanning from "./FillingScanning";

import { FillingJobDetails } from "../../types/interfaces";
import JobComplete from "../shared/JobComplete";

function DispenserFillingWrapper() {
  let componentBlock;
  const { pageNumber, setPageNumber } = useContext(SystemContext);
  


  const [qrCode, setQRCode] = useState<string>("");
  const [fillingSerial, setFillingSerial] = useState<string>("");
  const [readComplete, setReadComplete] = useState<boolean>(false);
  const [jobDetails, setJobDetails] = useState<FillingJobDetails>({jobNumber: ""}); //TODO: Turn into just a string

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
            <JobComplete />
          </>
        )

    default:
      break;
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center">
      {componentBlock}
    </div>
  );
}

export default DispenserFillingWrapper;
