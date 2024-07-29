import {  useContext, useState } from 'react'
import TextInput from "../../components/shared/TextInput"
import QRCodeInput from "../../components/shared/QRCodeInput"
import NextButton from "../../components/shared/NextButton"
import BackButton from '../../components/shared/BackButton'
import CancelButton from '../../components/shared/CancelButton';
import { SystemContext } from '../../context/SystemContext';
import TestFeedbackWrapper from './TestFeedbackWrapper'

interface JobDetails {
  staffName: string | undefined,
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
    "staffName": undefined,
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
          <TextInput label="Resistor Value Loaded" setInputValues={setJobDetails} target="resistorLoaded" value={jobDetails["resistorLoaded"]}/>
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
          <h1 className='text-center text-3xl mt-16 mb-8'>Attach test jig to ZIP unit</h1>
          <h2 className='text-center text-xl '>Click Next when tester is attached</h2>
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


  return (
    <div className="w-full h-screen flex flex-col justify-center">
      {componentBlock}
    </div>
  )
}

export default TestingWrapper