import { useEffect, useRef } from "react";
import { FaTimes, FaCheck } from "react-icons/fa";

interface DispenserDetailDisplayProps {
  serials: Set<string>;
  deleteEntry: (dispenserSerial:string) => void;
  unitType?:string;
}

function DispenserDetailDisplay({
  serials, 
  deleteEntry, 
  unitType = "" }: DispenserDetailDisplayProps) {

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current){
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [serials])

  return (
    <>
      <div ref={scrollRef} className="w-1/2 overflow-y-scroll h-[400px] mx-auto mt-8 border-l border-disabled">
        {Array.from(serials).map((serial, index) => {
          let additionalStyling = index % 2 == 0 ? " bg-table-highlight " : ""
          additionalStyling +=  index == serials.size - 1 ? " border-b-2 font-bold " : ""
          return (
            <div key={`dispenser-position-${index}`} className={`flex flex-row justify-between items-center m-2 ${additionalStyling}`}>
              <p className="text-xl font-medium">{unitType} {index + 1}:</p>
              <p className="text-xl text-left basis-1/3">{serial}</p>
              <FaCheck className="text-acceptable-green" size={25}/>
              <button 
                className="text-cancel text-right font-normal hover:font-bold transition-all basis-1/4" 
                onClick={() => {
                deleteEntry(serial)
                }}>
                  remove
              </button>
            </div>
          )
        })}
      </div>
    
    </>
  )
}

export default DispenserDetailDisplay