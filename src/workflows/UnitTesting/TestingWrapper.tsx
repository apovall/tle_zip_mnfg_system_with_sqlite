import {  useContext, useEffect, useState } from 'react'
import TextInput from "../../components/shared/TextInput"
import ResistorSelect from '../../components/shared/ResistorSelect'
import QRCodeInput from "../../components/shared/QRCodeInput"
import NextButton from "../../components/shared/NextButton"
import BackButton from '../../components/shared/BackButton'
import CancelButton from '../../components/shared/CancelButton';
import CompleteTestButton from '../../components/shared/CompleteTestButton';
import { SystemContext } from '../../context/SystemContext';
import TestFeedbackWrapper from './TestFeedbackWrapper'
import SerialComms from '../../helpers/SerialComms'
import { UnitDetails, RawResults } from '@/types/interfaces'
import processResults from '../../helpers/processResults'
import { saveUnitResults } from "../../better-sqlite3"

function TestingWrapper() {

  let componentBlock
  let baseUnitDetails:UnitDetails = {
    batchNumber: null,
    resistorLoaded: 3600,
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

  const { pageNumber } = useContext(SystemContext);
  const [ rawResults, setRawResults ] = useState<RawResults>({results: null})
  const [ unitDetails, setUnitDetails ] = useState<UnitDetails>(baseUnitDetails)
  const [ testingInProgress, setTestingInProgress ] = useState(true)

  const [ writeCommand, setWriteCommand ] = useState('')
  const [ startConnection, setStartConnection ] = useState(0)
  const [ portConnected, setPortConnected ] = useState<Boolean>(false)

  switch (pageNumber) {
    case 0:
      componentBlock = (
        <>
          <TextInput label="Batch Name / Number" setInputValues={setUnitDetails} target="batchNumber" value={unitDetails["batchNumber"]}/>
          <ResistorSelect label="Resistor Loaded" unitDetails={unitDetails} setInputValues={setUnitDetails} target="resistorLoaded" value={unitDetails["resistorLoaded"]} />
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
          <CompleteTestButton 
            isDisabled={testingInProgress} 
            setTestingInProgress={setTestingInProgress} 
            text='Save & Continue' 
            pageTarget={1} 
            baseUnitDetails={baseUnitDetails}
            setUnitDetails={setUnitDetails}
            />
          <BackButton text="Back" marginOverride='mt-10' />
        </>
      )
      break;
    default:
      break;
  }

  useEffect(() => {
    processResults(rawResults, unitDetails, {setUnitDetails}, {setWriteCommand})
  },[rawResults])

  useEffect(() => {
    if (pageNumber == 1 || pageNumber == 0){
      setTestingInProgress(true)
    }
    if (pageNumber == 2){
      setStartConnection((prev) => {
        return prev + 1
      })
    }
  }, [pageNumber])

  useEffect(() => {
    const finaliseResults = async () => {
      saveUnitResults(unitDetails)
      baseUnitDetails = {
        ...baseUnitDetails, 
        resistorLoaded: unitDetails['resistorLoaded'], 
        batchNumber: unitDetails['batchNumber']}
    }

    if (unitDetails.result == "pass" || unitDetails.result == "fail"){
      finaliseResults()
      setTestingInProgress(false)
    }
  }, [unitDetails])

  return (
    <div className="w-full h-screen flex flex-col justify-center">
      <div className='text-right pb-20 px-4 absolute top-32 right-10'>
        Device Connected: {portConnected ? <span className='text-acceptable-green'>Connected</span> : <span className='text-orange'>Disconnected</span>}
      </div>
      <SerialComms 
        setRawResults={setRawResults} 
        writeCommand={writeCommand} 
        startConnection={startConnection} 
        setPortConnected={setPortConnected}
      />
      {componentBlock}
    </div>
  )
}

export default TestingWrapper