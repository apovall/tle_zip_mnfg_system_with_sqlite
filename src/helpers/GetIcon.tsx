import React from 'react'
import { FaTimes, FaCheck, FaMinus } from "react-icons/fa";

interface GetIconProps {  
  status: string;
  iconSize?: number;
  alignment?: string;
}

function GetIcon({status, iconSize=40, alignment}: GetIconProps) {

  let icon

  switch (status) {
    case "pass":
      icon = <FaCheck size={iconSize} color="#35B942"/>
      break;
    case "fail":
      icon = <FaTimes size={iconSize} color="#B93535"/>
      break;
    case "unknown":
      icon = <FaMinus className={alignment} size={iconSize} color="#3774a9"/>
      break;
  
    default:
      icon = <></>
      break;
  }

  return (
    <>{icon}</>
  )
}

export default GetIcon