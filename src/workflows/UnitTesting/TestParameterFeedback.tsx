import { FaTimes, FaCheck, FaMinus } from "react-icons/fa";
import { TestParameters } from "@/types/interfaces";


function TestParameterFeedback({text, value, status}:TestParameters) {

  let icon
  let displayedValue

  switch (status) {
    case "pass":
      icon = <FaCheck size={50} color="#35B942"/>
      break;
    case "fail":
      icon = <FaTimes size={50} color="#B93535"/>
      break;
  
    default:
      icon = <></>
      break;
  }

  if (value === 'unknown'){
    displayedValue = <FaMinus className="text-right" size={50} color="#3774a9"/>
  } else {
    displayedValue = value
  }

  return (
    <div className='flex flex-row flex-nowrap justify-between mb-8'>
      <h1 className={`text-left text-4xl my-4`}>{text}:</h1>
      { value !== null ? <h2 className={`text-right text-4xl`}>{displayedValue}</h2> : <span className="text-right">{icon}</span>}
    </div>
  )
}

export default TestParameterFeedback