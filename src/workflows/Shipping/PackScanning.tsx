import React, { useEffect, useState } from "react";
import QRCodeBatchInput from "../../components/shared/QRCodeBatchInput";
import Label from "../../components/shared/Label";

interface PackScanningProps {
  packSerial: string | null;
  dispenserDetails: { [key: string]: string[] } | null;
  fillingDetails: string[];
  setDispenserDetails: React.Dispatch<React.SetStateAction<{ [key: string]: string[] } | null>>;
  setReadComplete: React.Dispatch<React.SetStateAction<boolean>>;
  readComplete: boolean;
  packSize: number;
  focus?: React.RefObject<HTMLInputElement>;
}

function PackScanning({
  packSerial,
  dispenserDetails,
  fillingDetails,
  setDispenserDetails,
  setReadComplete,
  readComplete,
  packSize,
  focus,
}: PackScanningProps) {

  const [qrCode, setQRCode] = useState<string | null>("");

  const handleRemove = async (key: string) => {
    if (dispenserDetails == null) {
      return
    } 

    let newDispenserDetails = {...dispenserDetails};
    delete newDispenserDetails[key];
    setDispenserDetails(newDispenserDetails);
    console.log(newDispenserDetails)
  
  };

  useEffect(() => {
    if (readComplete) {
      if (qrCode){
        let newDispenserDetails = {...dispenserDetails};
        newDispenserDetails[qrCode] = fillingDetails;
        setDispenserDetails(newDispenserDetails);
      }
    }
  }, [readComplete]);

  return (
    <>
      <div className="w-1/2 text-left mx-auto my-4 mb-16">
        <h1 className="flex flex-row justify-between py-2 text-black text-xl border-b-2 border-b-main text-center">
          <span>
            Pack: {" "}
            <span className="font-bold">{packSerial}</span>
          </span>
          <span>
            {dispenserDetails !== null ? <span className="font-bold">{Object.keys(dispenserDetails).length}/{packSize}</span>: <span>0/{packSize}</span>}
          </span>
        </h1>
        <div className="">
          <QRCodeBatchInput
            label="Scan or enter serial (enter to submit)"
            setQRString={setQRCode}
            target="qrCode"
            value={qrCode}
            submitOverride={true}
            setReadComplete={setReadComplete}
            focus={focus}
            autoFocus={true}
          />
        </div>
        {dispenserDetails && Object.keys(dispenserDetails).length <= 0 && (
          <h2 className="py-2 text-black text-md font-light text-center">
            Scan or enter serial to get started
          </h2>
        )}
        {dispenserDetails && Object.keys(dispenserDetails).map((code, index) => {
          return (
            <div className="my-4">
              <div className={`flex flex-row justify-between`} key={`div-${index}`}>
                <Label
                  key={`dispenser-${index}`}
                  label={`Dispenser Serial ${index + 1}`}
                  value={code}
                  iconName={"pass"}
                  staticStyling={`my-4 w-full font-semibold text-xl text-main`}
                />
                <button
                  className="self-center text-disabled hover:text-cancel transition-colors"
                  onClick={() => {
                    handleRemove(code)
                  }}
                  key={`remove-${index}`}
                >
                  remove
                </button>
              </div>
              <p className="text-sm text-medium-gray">
                {dispenserDetails[code].map((filling, index) => {
                  return (
                    <span className="px-2" key={`filling-${index}`}>{filling}</span>
                  )
                })}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default PackScanning;
