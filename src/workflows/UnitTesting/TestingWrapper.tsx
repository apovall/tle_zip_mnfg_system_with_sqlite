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
import { UnitDetails, JobDetails, RawResults } from '@/types/interfaces'
import processResults from '../../helpers/processResults'

function TestingWrapper() {
  let componentBlock
    const terminator = "\r\n"

  const {pageNumber} = useContext(SystemContext);
  const [jobDetails, setJobDetails] = useState<JobDetails>({
    batchNumber: undefined,
    resistorLoaded: undefined,
  })
  const [rawResults, setRawResults] = useState<RawResults>({results: null})
  const [unitDetails, setUnitDetails] = useState<UnitDetails>({
    qrCode: undefined,
    result: null,
    batt_contact_ok: null,
    batt_voltage_ok: null,
    tilt_sw_opens: null,
    tilt_sw_closes: null,
    resistance_ok: null,
    resistance: null,
    vcell_loaded: null,
    vcell_unloaded: null,
  })

  const [writeCommand, setWriteCommand] = useState('')

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
          <QRCodeInput label="PCB QR Code" setInputValues={setUnitDetails} target="qrCode" value={unitDetails["qrCode"]}/>
          <NextButton text="Next" isDisabled={Object.values(unitDetails).includes(undefined)} />
          <BackButton text="Back" />
        </>
      )
      break;
    case 2:
      componentBlock = (
        <>
          <h1 className='text-center text-3xl mt-16 mb-8'>Attach test jig to ZIP unit</h1>
          <h2 className='text-center text-xl '>Press Reset button on tester when ready</h2>
          <p>{writeCommand}</p>
          <SerialComms setRawResults={setRawResults} writeCommand={writeCommand} />
          {/* TODO: Tester to be automatically connected when being plugged in */}
          {/* Renderer might not be seeing the event, so might need to send it from ipcMain to ipcRenderer */}
        </>
      )
      break;
    case 3:
      componentBlock = (
        <>
          <TestFeedbackWrapper details={unitDetails}/>
        </>
      )
      break;
  
    default:
      break;
  }

  useEffect(() => {
    processResults(rawResults, {setUnitDetails}, {setWriteCommand})
  },[rawResults])

  useEffect(() => {
    console.log(writeCommand)
  }, [writeCommand])
  
  function updateCmd1 () {
    setWriteCommand("< result" + terminator + "resistance_ok: pass" + terminator + ">" + terminator)
  }
  function updateCmd2 () {
    setWriteCommand("< result" + terminator + "batt_voltage_ok: pass" + terminator + ">" + terminator)
  }


  return (
    <div className="w-full h-screen flex flex-col justify-center">
      {componentBlock}
      <button onClick={updateCmd1}>Update resistance</button>
      <button onClick={updateCmd2}>Update battery </button>
    </div>
  )
}

export default TestingWrapper