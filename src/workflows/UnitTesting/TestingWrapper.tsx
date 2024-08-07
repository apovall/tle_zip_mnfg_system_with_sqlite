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
// import {initialConnectAndRead, serialWrite} from '../../helpers/SerialComms2'
import { UnitDetails, JobDetails, RawResults } from '@/types/interfaces'
import processResults from '../../helpers/processResults'

function TestingWrapper() {

  let componentBlock
  let baseUnitDetails:UnitDetails = {
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
    action: "hold",
  }

  const {pageNumber, setPageNumber, isConnected} = useContext(SystemContext);
  const [jobDetails, setJobDetails] = useState<JobDetails>({
    batchNumber: undefined,
    resistorLoaded: undefined,
  })
  const [rawResults, setRawResults] = useState<RawResults>({results: null})
  const [unitDetails, setUnitDetails] = useState<UnitDetails>(baseUnitDetails)

  const [writeCommand, setWriteCommand] = useState('')
  const [startConnection, setStartConnection] = useState(false)

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
      if (isConnected ){
        setPageNumber(pageNumber+1)
      }
      componentBlock = (
        <>
          <h1 className='text-center text-3xl mt-16 mb-8'>Attach test jig to ZIP unit</h1>
          <h2 className='text-center text-xl '>Press Reset button on tester when ready</h2>
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
    processResults(rawResults, jobDetails, {setUnitDetails}, {setWriteCommand})
  },[rawResults])

  useEffect(() => {
    if (pageNumber == 2){
      setStartConnection(true)
    }
  }, [pageNumber])

  useEffect(() => {
    if (unitDetails.result == "pass"){
      // save
      // reset
      // go back to page
      console.log('saving to database')
      setUnitDetails(baseUnitDetails)
      setPageNumber(1)
    }
  }, [unitDetails])

  return (
    <div className="w-full h-screen flex flex-col justify-center">
      <SerialComms setRawResults={setRawResults} writeCommand={writeCommand} startConnection={startConnection} />
      {componentBlock}
    </div>
  )
}

export default TestingWrapper