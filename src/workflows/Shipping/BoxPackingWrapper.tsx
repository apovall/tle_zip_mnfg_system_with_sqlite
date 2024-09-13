import { useState, useContext, useEffect, useRef } from "react";
import { SystemContext } from "../../context/SystemContext";
import NextButton from "../../components/shared/NextButton";
import CancelJobGeneric from "../../components/shared/CancelJobGeneric";
import PackScanning from "./PackScanning";
import BackButton from "../../components/shared/BackButton";
import FillingScanning from "./FillingScanning";
import TextInput from "../../components/shared/TextInput";
import CompletePackingButton from "./CompletePackingButton";
import { saveDispenserPackDetails } from "../../better-sqlite3";

interface JobDetailProps {
  packSize: number | null;
  packSerial: string;
}

function BoxPackingWrapper() {
  let componentBlock;
  const { pageNumber, setPageNumber } = useContext(SystemContext);
  const focusButton = useRef<HTMLInputElement>(null)

  const [readComplete, setReadComplete] = useState<boolean>(false);
  const [packSize, setPackSize] = useState<number>(6);
  const [dispenserDetails, setDispenserDetails] = useState<{
    [key: string]: string[];
  } | null>(null);
  const [fillingDetails, setFillingDetails] = useState<string[]>([]);
  const [jobDetails, setJobDetails] = useState<JobDetailProps>({
    packSize: packSize,
    packSerial: "",
  });

  const handleSave = () => {
    // Save to database
    // Clear dispenser Details for next iteration.
    console.log(jobDetails)
    saveDispenserPackDetails({
      ...jobDetails,
      dispenserDetails: JSON.stringify(dispenserDetails),
    });

    setJobDetails({
      packSize: jobDetails.packSize,
      packSerial: jobDetails.packSerial,
    })
    setDispenserDetails(null)

    focusButton.current?.focus() // Refocus on input field for ease of use

  }

  useEffect(() => {
    console.log('here')
    console.log(jobDetails)
    console.log(dispenserDetails)
  },[jobDetails, dispenserDetails])

  switch (pageNumber) {
    case 5:
      componentBlock = (
        <>
          <div className="h-[650px]">
            <TextInput
              label="Pack Box Number"
              setInputValues={setJobDetails}
              target="packSerial"
              value={jobDetails["packSerial"]}
              submitOverride={true}
              autoFocus={true}
            />
            <FillingScanning
              fillingDetails={fillingDetails}
              setFillingDetails={setFillingDetails}
              setReadComplete={setReadComplete}
              readComplete={readComplete}
            />
          </div>
          <NextButton
            text="Next"
            isDisabled={
              jobDetails.packSerial == "" ||
              jobDetails.packSerial.length < 1 ||
              fillingDetails.length < 1
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
          <div className="h-[650px]">
            <PackScanning
              packSerial={jobDetails.packSerial}
              dispenserDetails={dispenserDetails}
              fillingDetails={fillingDetails}
              setDispenserDetails={setDispenserDetails}
              setReadComplete={setReadComplete}
              readComplete={readComplete}
              packSize={packSize}
              focus={focusButton}
            />
          </div>
          <CompletePackingButton 
            text={"Save & Next"}
            isDisabled={
              jobDetails.packSerial == "" ||
              jobDetails.packSerial.length < 1 ||
              dispenserDetails == null ||
              Object.keys(dispenserDetails).length < packSize
            }
            saveResults={handleSave}
          />
          <BackButton text="Back" marginOverride="mt-10" />
        </>
      );
      break;

    default:
      break;
  }

  return (
    <div className="w-full  flex flex-col justify-start mt-40">
      {componentBlock}
    </div>
  );
}

export default BoxPackingWrapper;
