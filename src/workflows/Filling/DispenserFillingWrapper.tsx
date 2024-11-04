import { useState, useContext, useEffect, useRef } from "react";
import { SystemContext } from "../../context/SystemContext";
import NextButton from "../../components/shared/NextButton";
import CancelJobGeneric from "../../components/shared/CancelJobGeneric";
import PackScanning from "../Shipping/PackScanning";
import BackButton from "../../components/shared/BackButton";
import FillingScanning from "../Shipping/FillingScanning";
import SingleDispenserFilling from "./SingleDispenserFilling";
import TextInput from "../../components/shared/TextInput";
import CompletePackingButton from "../Shipping/CompletePackingButton";
import GoToFillingsSerials from "./GoToFillingsSerials";

import { FillingJobDetails } from "../../types/interfaces";

function DispenserFillingWrapper() {
  let componentBlock;
  const { pageNumber, setPageNumber } = useContext(SystemContext);
  
  const focusButton = useRef<HTMLInputElement>(null)

  const [qrCode, setQRCode] = useState<string | null>("");
  const [readComplete, setReadComplete] = useState<boolean>(false);
  const [dispenserDetails, setDispenserDetails] = useState<{
    [key: string]: string[];
  } | null>(null);

  const [jobDetails, setJobDetails] = useState<FillingJobDetails>({
    jobNumber: "",
  });

  switch (pageNumber) {
    case 5:
      componentBlock = (
        <>
          <div className="h-[650px] flex flex-col justify-center">
            <TextInput
              label="Job Number"
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
          <div className="h-[650px] flex flex-row justify-center">
            <SingleDispenserFilling 
              jobDetails={jobDetails}
              setQRCode={setQRCode}
              qrCode={qrCode}
              setReadComplete={setReadComplete} 
              readComplete={readComplete}
            />
          </div>
          <div className="flex flex-row justify-between">
            <BackButton text="Back" marginOverride="mt-10" />
            <GoToFillingsSerials text="Go" marginOverride="mt-10" />

          </div>
        </>
      );
      break;

    default:
      break;
  }

  return (
    <div className="w-full flex flex-col justify-start mt-40">
      {componentBlock}
    </div>
  );
}

export default DispenserFillingWrapper;
