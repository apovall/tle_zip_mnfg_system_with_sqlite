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
  const [ startConnection, setStartConnection ] = useState(false)

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
      setStartConnection(true)
    }
  }, [pageNumber])

  useEffect(() => {
    const finaliseResults = async () => {
      console.log('saving to database')
      saveUnitResults(unitDetails)
      baseUnitDetails = {
        ...baseUnitDetails, 
        resistorLoaded: unitDetails['resistorLoaded'], 
        batchNumber: unitDetails['batchNumber']}

      // setPageNumber(1)
      // await new Promise(resolve => setTimeout(() => {
      //   baseUnitDetails = {
      //     ...baseUnitDetails, 
      //     resistorLoaded: unitDetails['resistorLoaded'], 
      //     batchNumber: unitDetails['batchNumber']}
      //   setUnitDetails(baseUnitDetails)
      //   setPageNumber(1)
      // }, 2500));
    }

    if (unitDetails.result == "pass" || unitDetails.result == "fail"){
      finaliseResults()
      setTestingInProgress(false)
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