import { Dispatch, SetStateAction } from "react";

interface JobDetails {
  batchNumber: string | undefined;
  resistorLoaded: number | undefined;
}

interface ResistorSelectProps {
  label: string;
  setInputValues: Dispatch<SetStateAction<JobDetails>>;
  target: string;
  value: string | number | undefined;
}

function ResistorSelect({ label, setInputValues, target }: ResistorSelectProps) {
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
              return { ...prev, [target]: e.target.value };
            });
          }}
        >
          <option value="0">0</option>
          <option value="3600">3K6</option>
          <option value="4700">4K7</option>
          <option value="6490">6K49</option>
          <option value="8200">8K2</option>
          <option value="10000">10K</option>
        </select>
      </div>
    </div>
  );
}

export default ResistorSelect;
