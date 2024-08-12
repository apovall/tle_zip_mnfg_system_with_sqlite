import { Dispatch, SetStateAction, useContext } from 'react'
import { UnitDetails } from '@/types/interfaces'
import { SystemContext } from "../../context/SystemContext";

interface UnitInputProps {
  label: string;
  setInputValues: Dispatch<SetStateAction<UnitDetails>>;
  target: string;
  value: string | number | undefined;
}

function QRCodeInput({label, setInputValues, target, value}:UnitInputProps) {
  const { pageNumber, setPageNumber } = useContext(SystemContext);

  return (
    <div className='w-1/2 text-right mx-auto my-4 self-center'>
      <div className='flex flex-row justify-cesnter'>
        <h3 className='basis-1/3 text-lg mx-4 self-center font-bold '>{label}</h3>
        <input autoFocus id={target} type={target == "resistorLoaded" ? "number" : "text" } className='basis-2/3 border-2 border-zip-dark rounded-lg p-4 self-center' value={value ?? ""}
        onKeyDown={async (e) => {
          if (e.key == "Enter" && value){
            await new Promise(resolve => setTimeout(() => {
              setPageNumber(pageNumber + 1)
            }, 400));
            // setPageNumber(pageNumber + 1)
          }
        }}
        onChange={(e) => {
          setInputValues((prev) => {
            return {...prev, [target]: e.target.value}
          })
        }} />
      </div>
    </div>
  )
}
export default QRCodeInput