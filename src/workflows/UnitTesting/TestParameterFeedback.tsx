import { FaTimes, FaCheck } from "react-icons/fa";

interface TestParameters {
  text: string;
  status: "ok" | "fail" | "testing";
  isInTest: boolean;
}

function TestParameterFeedback({text, status, isInTest}:TestParameters) {

  let icon
  const styling = isInTest ? "" : "text-disabled"

  switch (status) {
    case "ok":
      icon = <FaCheck size={50} color="#35B942"/>
      break;
    case "fail":
      icon = <FaTimes size={50} color="#B93535"/>
      break;
  
    default:
      icon = <></>
      break;
  }



  return (
    <div className='flex flex-row flex-nowrap mb-8'>
      <h1 className={`text-right text-4xl ${styling}`}>{text}:</h1>
      <span className="mx-5">{icon}</span>
    </div>
  )
}

export default TestParameterFeedback