import { Dispatch, SetStateAction, useContext } from "react";
import { SystemContext } from "../../context/SystemContext";

interface QRReaderProps {
  label: string;
  setQRString: Dispatch<SetStateAction<string | null>>;
  target: string;
  value: string | number | null;
  submitOverride?: boolean;
  setReadComplete?: Dispatch<SetStateAction<boolean>>;
  focus?: React.RefObject<HTMLInputElement>;
  autoFocus?: boolean;
  resetQRString?: boolean;
}

function QRCodeBatchInput({
  label,
  setQRString,
  target,
  value,
  submitOverride = false,
  setReadComplete,
  focus,
  autoFocus=true,
  resetQRString=true
}: QRReaderProps) {
  const { pageNumber, setPageNumber } = useContext(SystemContext);

  return (
    <div className="text-right mx-auto my-4 self-center">
      <div className="flex flex-row justify-center">
        <h3 className="basis-1/3 text-lg mx-4 self-center font-bold ">
          {label}
        </h3>
        <input
          autoFocus={autoFocus}
          id={target}
          type={target == "resistorLoaded" ? "number" : "text"}
          className="basis-2/3 border-2 border-zip-dark rounded-lg p-4 self-center"
          value={value ?? ""}
          ref={focus}
          onKeyDown={async (e) => {
            if (e.key == "Enter" && value && submitOverride == false) {
              await new Promise((resolve) =>
                setTimeout(() => {
                  setPageNumber(pageNumber + 1);
                }, 400)
              );
              // setPageNumber(pageNumber + 1)
            } else if (e.key == "Enter" && value && submitOverride == true) {
              if (setReadComplete !== undefined) {
                console.log("in here, read complete");
                setReadComplete(true);
              }
              if (resetQRString) {
                await new Promise((resolve) => setTimeout(() => {setQRString(null)}, 200));
                setQRString(null);
              }
            }
          }}
          onChange={(e) => {
            if (setReadComplete) {
              setReadComplete(false);
            }
            setQRString(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
export default QRCodeBatchInput;
