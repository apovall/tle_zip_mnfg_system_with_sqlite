import { useContext } from "react";
import { SystemContext } from "../../context/SystemContext";
import { TextInputProps } from "@/types/interfaces";

function TextInput({
  label,
  setInputValues,
  target,
  value,
  autoFocus = false,
  submitOverride = false,
}: TextInputProps) {
  const { pageNumber, setPageNumber } = useContext(SystemContext);

  return (
    <div className="w-1/2 text-right mx-auto my-4 self-center">
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
          onKeyDown={(e) => {
            if (e.key == "Enter" && value && !submitOverride) {
              setPageNumber(pageNumber + 1);
            }
          }}
          onChange={(e) => {
            setInputValues((prev: {[key:string] : any }) => {
              return { ...prev, [target]: e.target.value };
            });
          }}
        />
      </div>
    </div>
  );
}

export default TextInput;
