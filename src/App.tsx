import { useContext } from "react";
import { SystemContext } from "./context/SystemContext";
import JobSelectorWrapper from "./workflows/jobSelector/JobSelectorWrapper";
import TestingWrapper from "./workflows/UnitTesting/TestingWrapper";
import AssemblyWrapper from "./workflows/UnitAssembly/AssemblyWrapper";

import "./App.css";

function App() {
  const systemContext = useContext(SystemContext);


  return (
    <div className="w-full">
      <img src="/images/zip_banner.png" alt="ZIP Banner" />

      {systemContext.activeJob == "select" ? (
        <>
          <h1 className="text-center text-3xl my-16">
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
    </div>
  );
}

export default App;
