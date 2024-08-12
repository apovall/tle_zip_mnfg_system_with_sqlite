import { Dispatch, SetStateAction } from "react";
import { UnitDetails } from "@/types/interfaces";

// interface JobDetails {
//   batchNumber: string | undefined;
//   resistorLoaded: number | undefined;
// }

interface ResistorSelectProps {
  label: string;
  setInputValues: Dispatch<SetStateAction<UnitDetails>>;
  unitDetails: UnitDetails;
  target: string;
  value: number | null;
}

function ResistorSelect({ label, setInputValues, target, unitDetails }: ResistorSelectProps) {
  return (
    <div className="w-1/2 text-right mx-auto my-4 self-center">
      <div className="flex flex-row justify-center">
        <h3 className="basis-1/3 text-lg mx-4 self-center font-bold ">
          {label}
        </h3>
        <select
          className="basis-2/3 border-2 border-zip-dark rounded-lg p-4 self-center"
          name="resistorLoaded"
          id={target}
          onChange={(e) => {
            setInputValues((prev) => {
              return { ...prev, [target]: parseInt(e.target.value) };
            });
          }}
        >
          <option value="3600" selected={unitDetails.resistorLoaded?.toString() == `3600` ? true : false}>3.6K</option>
          <option value="4700" selected={unitDetails.resistorLoaded?.toString() == `4700` ? true : false}>4.7K</option>
          <option value="6490" selected={unitDetails.resistorLoaded?.toString() == `6490` ? true : false}>6.49K</option>
          <option value="8200" selected={unitDetails.resistorLoaded?.toString() == `8200` ? true : false}>8.2K</option>
          <option value="10000" selected={unitDetails.resistorLoaded?.toString() == `10000` ? true : false}>10K</option>
          <option value="33000" selected={unitDetails.resistorLoaded?.toString() == `33000` ? true : false}>33K</option>
        </select>
      </div>
    </div>
  );
}

export default ResistorSelect;
