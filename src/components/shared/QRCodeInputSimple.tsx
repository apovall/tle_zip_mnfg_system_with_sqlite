import { Dispatch, SetStateAction, useContext } from 'react'
import { UnitDetails } from '@/types/interfaces'

interface UnitInputProps {
  label: string;
  handleInputChange: React.ChangeEventHandler<HTMLInputElement>;
  handleEnter: React.KeyboardEventHandler<HTMLInputElement>;
  qrCode: string
  focus?: React.RefObject<HTMLInputElement>
}

function QRCodeInputSimple({label, handleInputChange,
  handleEnter,
  qrCode,
  focus,}:UnitInputProps) {

  return (
    <div className='w-1/2 text-right mx-auto my-4 self-center'>
      <div className='flex flex-row justify-cesnter'>
        <h3 className='basis-1/3 text-lg mx-4 self-center font-bold '>{label}</h3>
        <input 
          className='basis-2/3 border-2 border-zip-dark rounded-lg p-4 self-center' 
          type="text" 
          onChange={handleInputChange}
          onKeyUp={handleEnter}
          autoFocus={true}
          value={qrCode}
          ref={focus}/>
      </div>
    </div>
  )
}
export default QRCodeInputSimple