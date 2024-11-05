import React, { useEffect, useState } from "react";
import QRCodeInputSimple from "../../components/shared/QRCodeInputSimple";
import LabelAssembly from "../../components/shared/LabelAssembly";
import { BatchCodesProps } from "../../types/interfaces";
import DispenserDetailDisplay from "./DispenserDetailDisplay";

interface UnitScanningProps {
  batchCodes: BatchCodesProps;
  setBatchCodes: React.Dispatch<React.SetStateAction<BatchCodesProps>>;
  setReadComplete: React.Dispatch<React.SetStateAction<boolean>>;
  canBeAssembled: [boolean | null, string];
  readQuantities: {
    pcbSerial: number | null;
    dispenserSerial: number | null;
  };
  focus?: React.RefObject<HTMLInputElement>;
}

function UnitScanning({
  batchCodes,
  setBatchCodes,
  setReadComplete,
  canBeAssembled,
  readQuantities,
  focus,
}: UnitScanningProps) {

  const [qrCode, setQRCode] = useState<string>("");

  const handleEnter = (e: React.ChangeEvent<HTMLInputElement> & React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter" && e.target.value) {
      const handleBatchCodes = (qrCode: string) => {
        let type = qrCode[0].toLowerCase();
        if (type == "a" || type == "b") {
          setBatchCodes((prev) => {
            return {...prev, dispenserSerial: qrCode,}
          });
        } else {
          setBatchCodes((prev) => {
            return {...prev, pcbSerial: qrCode,}
          });
        }
      };
      handleBatchCodes(e.target.value)
      setQRCode("")
      setReadComplete(true)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReadComplete(false)
    setQRCode(e.target.value);
  }

  const iconLookup = (canBeAssembled: boolean | null, value: number | null, target: string) => {
    let icon = "unknown";
    if (canBeAssembled == false) {
      return "fail"; // Shortcircuit all other logic
    }
    if (value == null) {
      icon = "unknown";
    } else if (value !== null && target == "pcb") {
      icon = "pass";
    }
    if (value !== null && value <= 3) {
      icon = "pass";
    } else if (value !== null && value >= 4 && target == "dispenser") {
      icon = "fail";
    }
    return icon;
  };

  return (
    <div className="">
      <div className="w-1/2 text-left mx-auto my-4 self-center mb-16">
        <div className="flex flex-row justify-between">
        <div className="basis-3/4">
            <LabelAssembly
              label="PCB Serial"
              value={batchCodes["pcbSerial"] ?? ""}
              iconName={iconLookup(canBeAssembled[0], readQuantities.pcbSerial, "pcb")}
              timesUsed={readQuantities.pcbSerial}
            />
          </div>
          <div className="basis-1/4">
            {canBeAssembled[0] !== null && canBeAssembled[0] == false ? 
              <div className="text-cancel font-medium">
                <p>Unit cannot be assembled: </p>
                <p>{canBeAssembled[1]}</p>
              </div>
            : <></>}
          </div>
        </div>
          


        <div className="flex flex-row justify-between">
          <div className="basis-3/4">
            <LabelAssembly
              label="Dispenser Serial"
              value={batchCodes["dispenserSerial"] ?? ""}
              iconName={iconLookup(null, readQuantities.dispenserSerial, "dispenser")}
              timesUsed={readQuantities.dispenserSerial}
            />
          </div>
          <div className="basis-1/4">
              {readQuantities.dispenserSerial !== null && readQuantities.dispenserSerial + 1 > 4 ? 
                <div className="text-cancel font-medium">
                  <p>Dispenser exceeds number of uses (4)</p>
                </div>
                : <></>}
          </div>
        </div>

        <DispenserDetailDisplay 
          serial={batchCodes.dispenserSerial}
          fills={readQuantities.dispenserSerial}
        />

        {/* <p className={`text-main py-8 ${readQuantities.dispenserSerial !== null && readQuantities.dispenserSerial <= 3 ? "opacity-100" : "opacity-0"}`}>
          Remember: record number of refills on dispenser body
        </p> */}
      </div>

      <div className="mx-auto">
          <QRCodeInputSimple 
            label="Scan or enter serial (enter to submit)"
            handleInputChange={handleInputChange}
            handleEnter={handleEnter}
            qrCode={qrCode}
            focus={focus} 
          />
      </div>
    </div>
  );
}

export default UnitScanning;
