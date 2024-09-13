import { useContext } from "react";
import { SystemContext } from "./context/SystemContext";
import JobSelectorWrapper from "./workflows/jobSelector/JobSelectorWrapper";
import TestingWrapper from "./workflows/UnitTesting/TestingWrapper";
import AssemblyWrapper from "./workflows/UnitAssembly/AssemblyWrapper";
import BoxPackingWrapper from "./workflows/Shipping/BoxPackingWrapper";

import "./App.css";

function App() {
  const systemContext = useContext(SystemContext);
  let componentBlock

  switch (systemContext.activeJob) {
    case "select":
      componentBlock = (
        <>
          <h1 className="text-center text-3xl my-16 pt-[120px]">
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
    case "box_packing":
      componentBlock = (
        <BoxPackingWrapper />
      )
      break;
    case "box_shipping":
      componentBlock = (
        <TestingWrapper />
      )
      break;
  
    default:
      break;
  }

  return (
    <div className="w-full">
      {/* <img src="/images/zip_banner.png" alt="ZIP Banner" /> */}
      <div className="">
        <img className="absolute top-0" src={`${process.env.NODE_ENV === 'production' ? './images/zip_banner.png' : '/images/zip_banner.png'}`} alt="ZIP Banner" />
        {componentBlock}
        {/* {systemContext.activeJob == "select" ? (
          <>
            <h1 className="text-center text-3xl my-16 pt-[120px]">
              What would you like to do?
            </h1>
            <JobSelectorWrapper />
          </>
        ) : (
          <></>
        )}
        {systemContext.activeJob == "test" ? (
          <TestingWrapper />
        ) : (
          <></>
        )}
        {systemContext.activeJob == "assemble" ? (
          <AssemblyWrapper />
        ) : (
          <></>
        )}
        {systemContext.activeJob == "resistor_check" ? (
          <TestingWrapper />
        ) : (
          <></>
        )} */}
      </div>
    </div>
  );
}

export default App;
