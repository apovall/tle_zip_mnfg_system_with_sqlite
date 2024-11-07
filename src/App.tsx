import { useContext } from "react";
import { SystemContext } from "./context/SystemContext";
import JobSelectorWrapper from "./workflows/jobSelector/JobSelectorWrapper";
import TestingWrapper from "./workflows/UnitTesting/TestingWrapper";
import AssemblyWrapper from "./workflows/UnitAssembly/AssemblyWrapper";
import DispenserFillingWrapper from "./workflows/Filling/DispenserFillingWrapper";
import S3FileUpload from "./helpers/S3FileUpload";

import "./App.css";
import SixPackWrapper from "./workflows/Shipping/SixPackWrapper";

function App() {
  const systemContext = useContext(SystemContext);
  let componentBlock

  switch (systemContext.activeJob) {
    case "select":
      componentBlock = (
        <>
          <h1 className="text-center text-3xl mb-16 pt-[120px]">
            What would you like to do?
          </h1>
          <JobSelectorWrapper />
        </>
      )
      break;
    case "test":
      componentBlock = (
        <TestingWrapper />
      )
      break;
    case "assemble":
      componentBlock = (
        <AssemblyWrapper />
      )
      break;
    case "resistor_check":
      componentBlock = (
        <TestingWrapper />
      )
      break;
    case "fill_dispeners":
      componentBlock = (
        <DispenserFillingWrapper />
      )
      break;
    case "6_pack":
      componentBlock = (
        <SixPackWrapper />
      )
      break;
    case "72_pack":
      componentBlock = (
        <TestingWrapper />
      )
      break;
  
    default:
      break;
  }

  return (
    <div className="w-full font-jost overflow-hidden">
      <div className="">

          <img className="" src={`${process.env.NODE_ENV === 'production' ? './images/zip_banner.png' : '/images/zip_banner.png'}`} alt="ZIP Banner" />
          {systemContext.activeJob == "select" && <S3FileUpload />}

        {componentBlock}
      </div>
    </div>
  );
}

export default App;
