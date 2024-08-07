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
import { saveUnitResults } from "../../better-sqlite3"

function TestingWrapper() {

  let componentBlock
  let baseUnitDetails:UnitDetails = {
    batchNumber: null,
    resistorLoaded: null,
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
          <TextInput label="Batch Name / Number" setInputValues={setUnitDetails} target="batchNumber" value={unitDetails["batchNumber"]}/>
          <ResistorSelect label="Resistor Loaded"  setInputValues={setUnitDetails} target="resistorLoaded" value={unitDetails["resistorLoaded"]} />
          <NextButton text="Start tests" isDisabled={unitDetails["batchNumber"] == null || unitDetails["resistorLoaded"] == null} />
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
          <TestFeedbackWrapper details={unitDetails}/>
        </>
      )
      break;
      // if (isConnected ){
      //   setPageNumber(pageNumber+1) // TODO: this is causing crashes.
      // }
      // componentBlock = (
      //   <>
      //     <h1 className='text-center text-3xl mt-16 mb-8'>Attach test jig to ZIP unit</h1>
      //     <h2 className='text-center text-xl '>Press Reset button on tester when ready</h2>
      //     {/* TODO: Tester to be automatically connected when being plugged in */}
      //     {/* Renderer might not be seeing the event, so might need to send it from ipcMain to ipcRenderer */}
      //   </>
      // )
      // break;
    // case 3:
    //   componentBlock = (
    //     <>
    //       <TestFeedbackWrapper details={unitDetails}/>
    //     </>
    //   )
    //   break;
  
    default:
      break;
  }

  useEffect(() => {
    processResults(rawResults, unitDetails, {setUnitDetails}, {setWriteCommand})
  },[rawResults])

  useEffect(() => {
    if (pageNumber == 2){
      setStartConnection(true)
    }
  }, [pageNumber])

  useEffect(() => {
    const finaliseResults = async () => {
      console.log('saving to database')
      saveUnitResults(unitDetails)
      await new Promise(resolve => setTimeout(() => {
        baseUnitDetails = {
          ...baseUnitDetails, 
          resistorLoaded: unitDetails['resistorLoaded'], 
          batchNumber: unitDetails['batchNumber']}
        setUnitDetails(baseUnitDetails)
        setPageNumber(1)
      }, 2500));
    }

    if (unitDetails.result == "pass" || unitDetails.result == "fail"){
      finaliseResults()
    }
    console.log(unitDetails)
  }, [unitDetails])

  return (
    <div className="w-full h-screen flex flex-col justify-center">
      <SerialComms setRawResults={setRawResults} writeCommand={writeCommand} startConnection={startConnection} />
      {componentBlock}
    </div>
  )
}

export default TestingWrapper