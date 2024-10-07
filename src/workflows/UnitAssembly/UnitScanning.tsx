import React, { useEffect, useState } from "react";
import QRCodeBatchInput from "../../components/shared/QRCodeBatchInput";
import Label from "../../components/shared/Label";
import { BatchCodesProps } from "../../types/interfaces";

interface UnitScanningProps {
  batchCodes: BatchCodesProps;
  setBatchCodes: React.Dispatch<React.SetStateAction<BatchCodesProps>>;
  setReadComplete: React.Dispatch<React.SetStateAction<boolean>>;
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
  readQuantities,
  focus,
}: UnitScanningProps) {
  /* 
    Function to check what unit type has been scanned
      Accepts or rejects it based what's in memory already (so that we can't have duplicate code types)
    Database look up
  */

  const [qrCode, setQRCode] = useState<string | null>("");

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

  const iconLookup = (value: number | null, target: string) => {
    let icon = "unknown";
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

  useEffect(() => {
    if (qrCode) {
      handleBatchCodes(qrCode);
    }
  }, [qrCode]);

  return (
    <div className="">
      <div className="w-1/2 text-left mx-auto my-4 self-center mb-16">
        <Label
          label="PCB Serial"
          value={batchCodes["pcbSerial"] ?? ""}
          iconName={iconLookup(readQuantities.pcbSerial, "pcb")}
          timesUsed={readQuantities.pcbSerial}
        />
        <Label
          label="Dispenser Serial"
          value={batchCodes["dispenserSerial"] ?? ""}
          iconName={iconLookup(readQuantities.dispenserSerial, "dispenser")}
          timesUsed={readQuantities.dispenserSerial}
        />
        {/* <p className={`text-main py-8 ${readQuantities.dispenserSerial !== null && readQuantities.dispenserSerial <= 3 ? "opacity-100" : "opacity-0"}`}>
          Remember: record number of refills on dispenser body
        </p> */}
      </div>

      <div className="w-1/2 mx-auto">
        <QRCodeBatchInput
          label="Scan or enter serial (enter to submit)"
          setQRString={setQRCode}
          target="qrCode"
          value={qrCode}
          submitOverride={true}
          setReadComplete={setReadComplete}
          focus={focus}
        />
      </div>
    </div>
  );
}

export default UnitScanning;
