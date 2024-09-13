import React, { useState, useEffect } from "react";
import QRCodeBatchInput from "../../components/shared/QRCodeBatchInput";
import Label from "../../components/shared/Label";

interface FillingScanningProps {
  fillingDetails: string[];
  setFillingDetails: React.Dispatch<React.SetStateAction<string[]>>;
  setReadComplete: React.Dispatch<React.SetStateAction<boolean>>;
  readComplete: boolean;
}

function FillingScanning({
  fillingDetails,
  setFillingDetails,
  setReadComplete,
  readComplete
}: FillingScanningProps) {
  const [qrCode, setQRCode] = useState<string | null>("");

  const handleRemove = async (index: number) => {
    if (Object.keys(fillingDetails).length <= 0) {
      return
    } 

    let newFillingDetails = [...fillingDetails];
    newFillingDetails.splice(index, 1)
    setFillingDetails(newFillingDetails);
    console.log(newFillingDetails)
  };

  useEffect(() => {
    if (readComplete) {
      if (qrCode){
        let newFillingDetails = [...fillingDetails];
        newFillingDetails.push(qrCode);
        setFillingDetails(newFillingDetails);
      }
    }
  }, [readComplete]);

  return (
    <>
      <div className=" w-1/2 text-left mx-auto my-4 mb-16">
        <QRCodeBatchInput
          label="Lure or Poison Filling Batch Numbers"
          setQRString={setQRCode}
          target="qrCode"
          value={qrCode}
          submitOverride={true}
          setReadComplete={setReadComplete}
          autoFocus={false}
        />
        {fillingDetails.length <= 0 && (
          <h2 className="py-2 text-black text-md font-light text-center">
            Scan or enter serial to get started. Can enter multiple numbers
          </h2>
        )}
        {fillingDetails.map((filling, index) => {
          return (
            <div
              className={`flex flex-row justify-between`}
              key={`div-${index}`}
            >
              <Label
                key={`dispenser-${index}`}
                label={`Filling Serial #${index + 1}`}
                value={filling}
                iconName={"pass"}
                staticStyling={`my-4 w-full font-semibold text-xl text-main`}
              />
              <button
                className="self-center text-disabled hover:text-cancel transition-colors"
                onClick={() => {
                  handleRemove(index);
                }}
                key={`remove-${index}`}
              >
                remove
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default FillingScanning;
