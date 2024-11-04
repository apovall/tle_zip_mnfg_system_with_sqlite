import { useEffect } from "react";
import { FaTimes, FaCheck, FaMinus } from "react-icons/fa";

function DispenserDetailDisplay({serial, fills}: {serial: string | null, fills: number | null}) {

  let displayedFillsStyling = "text-acceptable-green" //cancel
  let displayedFills
  let icon = <FaMinus size={25} className="text-zip-dark"/>
  let fillIcons = []

  if (!fills){
    displayedFills = !serial ? '-' : '0 + 1 (new)'
    displayedFillsStyling = !serial ? "text-main" : 'text-acceptable-green'
    icon = !serial ? <FaMinus size={25} className="text-zip-dark"/> : <FaCheck size={25} className="text-acceptable-green" />
  } else if (fills <= 4){
    displayedFills = `${fills} + 1 (new)`
    icon = <FaCheck size={40} className="text-acceptable-green" />
  } else {
    displayedFillsStyling = "text-cancel"
    displayedFills = `${fills} + 1 (new)`
    icon = <FaTimes size={40} className="text-cancel" />
  }

  if (serial == "Invalid serial number"){
    displayedFillsStyling = "text-cancel"
    displayedFills = "-"
    icon = <FaTimes size={40} className="text-cancel" />
  }

  for (let i = 0; i < 4; i++){
    let styling = 'w-[49px] h-[49px] border border-black rounded-md text-black flex flex-col justify-center text-center mx-1'

    if (fills || fills == 0){
      if (i < fills && fills != 0){
        styling += " bg-[#555555]"
      } else {
        styling += " bg-white"
      }
    }
    fillIcons.push(
      <p className={`${styling}`}>
        {i + 1}
      </p>
    )
  }

  return (
    <>
      <div className="flex flex-row justify-center my-8">
        <div className="basis-1/3 text-right">
          <h3 className='font-bold text-lg mx-4'>Dispenser Serial </h3>
          <h3 className='font-bold text-lg mx-4'>Fills </h3>
        </div>
        <div className="basis-1/3 border-r-2 border-medium-gray text-right pr-8 text-lg">
          <p className={`basis-2/3 ${displayedFillsStyling} font-bold`}>{!serial ? "-" : serial }</p>
          <p className={`basis-2/3 ${displayedFillsStyling}`}>{displayedFills}</p>
        </div>
        <div className="basis-1/3 pl-8 flex flex-col justify-center">
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
      
      <div className="flex flex-row justify-start my-8">
        <div className="basis-1/3 text-right">
          <p>Remember to record the</p>
          <p>refill number on the</p>
          <p>dispenser body</p>
        </div>
        <div className="basis-2/3 pl-8 font-roboto text-center text-3xl flex flex-row justify-start ">
        {fills !== null && 
          <div>
            <p className="mb-2" >Refill No.</p>
            <div  className="flex flex-row justify-center" key="icons-display">
            {fillIcons.map((icon, index) => {
              return (
                <>
                  <span key={`fill-icon-${index}`}>{icon}</span>
                </>
                )
              })}
            </div>
          </div>
        }
        </div>
      </div>
    </>
  )
}

export default DispenserDetailDisplay