import { Dispatch, SetStateAction } from 'react'

interface JobDetails {
  batchNumber: string | undefined,
  resistorLoaded: number | undefined
}

interface TextInputProps {
  label: string;
  setInputValues:  Dispatch<SetStateAction<JobDetails>>;
  target: string;
  value: string | number | undefined;
}

function TextInput({label, setInputValues, target, value}:TextInputProps) {

  return (
    <div className='w-1/2 text-right mx-auto my-4 self-center'>
      <div className='flex flex-row justify-center'>
        <h3 className='basis-1/3 text-lg mx-4 self-center font-bold '>{label}</h3>
        <input id={target} type={target == "resistorLoaded" ? "number" : "text" } className='basis-2/3 border-2 border-zip-dark rounded-lg p-4 self-center' value={value ?? ""}
        onChange={(e) => {
          setInputValues((prev) => {
            return {...prev, [target]: e.target.value}
          })
        }} />
      </div>

    </div>
  )
}

export default TextInput