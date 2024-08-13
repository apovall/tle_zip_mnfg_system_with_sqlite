import { FaTimes, FaCheck, FaMinus } from "react-icons/fa";
import { TestParameters } from "@/types/interfaces";


function TestParameterFeedback({text, value, status}:TestParameters) {

  let icon
  let displayedValue
  let iconSize = 40

  switch (status) {
    case "pass":
      icon = <FaCheck size={iconSize} color="#35B942"/>
      break;
    case "fail":
      icon = <FaTimes size={iconSize} color="#B93535"/>
      break;
  
    default:
      icon = <></>
      break;
  }

  if (value === 'unknown'){
    displayedValue = <FaMinus className="text-right" size={iconSize} color="#3774a9"/>
  } else {
    displayedValue = value
  }

  return (
    <div className='flex flex-row flex-nowrap justify-between mb-4 ml-4 text-xl sm:text-2xl mb:text-3xl lg:text-4xl h-[60px]'>
      <h1 className={`text-left my-2`}>{text}:</h1>
      <div className="flex flex-col justify-center">
        { value !== null ? <h2 className={`text-right my-2`}>{displayedValue}</h2> : <span className="text-right my-4">{icon}</span>}
      </div>
    </div>
  )
}

export default TestParameterFeedback