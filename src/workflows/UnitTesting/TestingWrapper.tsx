import {  useContext, useEffect, useState } from 'react'
import TextInput from "../../components/shared/TextInput"
import ResistorSelect from '../../components/shared/ResistorSelect'
import QRCodeInput from "../../components/shared/QRCodeInput"
import NextButton from "../../components/shared/NextButton"
import BackButton from '../../components/shared/BackButton'
import CancelButton from '../../components/shared/CancelButton';
import { SystemContext } from '../../context/SystemContext';
import TestFeedbackWrapper from './TestFeedbackWrapper'
import SerialComms from '../../helpers/SerialComms'

interface JobDetails {
  batchNumber: string | undefined,
  resistorLoaded: number | undefined
}

interface UnitTestDetails {
  qrCode: string | undefined,
}

function TestingWrapper() {
  let componentBlock

  const {pageNumber} = useContext(SystemContext);
  const [jobDetails, setJobDetails] = useState<JobDetails>({
    "batchNumber": undefined,
    "resistorLoaded": undefined
  })
  const [unitTestDetails, setUnitTestDetails] = useState<UnitTestDetails>({
    "qrCode": undefined,
  })

  switch (pageNumber) {
    case 0:
      componentBlock = (
        <>
          <TextInput label="Batch Name / Number" setInputValues={setJobDetails} target="batchNumber" value={jobDetails["batchNumber"]}/>
          <ResistorSelect label="Resistor Loaded"  setInputValues={setJobDetails} target="resistorLoaded" value={jobDetails["resistorLoaded"]} />
          <NextButton text="Start tests" isDisabled={Object.values(jobDetails).includes(undefined)} />
          <CancelButton text="Cancel Job" />
        </>
      )
      break;
    case 1:
      componentBlock = (
        <>
          <QRCodeInput label="PCB QR Code" setInputValues={setUnitTestDetails} target="qrCode" value={unitTestDetails["qrCode"]}/>
          <NextButton text="Next" isDisabled={Object.values(unitTestDetails).includes(undefined)} />
          <BackButton text="Back" />
        </>
      )
      break;
    case 2:
      componentBlock = (
        <>
         {/* TODO: 
          Await serial commms 
            Update Magpie serial comms to:
              Accept different new line terminators (send command, end command)
            Update the information that's actually displayed
          When it's found, continue on.
         */}
          <h1 className='text-center text-3xl mt-16 mb-8'>Attach test jig to ZIP unit</h1>
          <h2 className='text-center text-xl '>Click Next when tester is attached</h2>
          <button>Connect to comms</button>
          <SerialComms />
          <NextButton text="Start Test" isDisabled={Object.values(unitTestDetails).includes(undefined)} />
          <BackButton text="Back" />
        </>
      )
      break;
    case 3:
      componentBlock = (
        <>
          <TestFeedbackWrapper />
        </>
      )
      break;
  
    default:
      break;
  }

  useEffect(() => {
    console.log(jobDetails)
  },[jobDetails])


  return (
    <div className="w-full h-screen flex flex-col justify-center">
      {componentBlock}
    </div>
  )
}

export default TestingWrapper