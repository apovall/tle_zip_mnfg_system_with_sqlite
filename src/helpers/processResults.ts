import { RawResults, SetUnitDetails, setWriteCommand, JobDetails } from "@/types/interfaces";

function processResults(results: RawResults, jobDetails:JobDetails, setUnitDetails: SetUnitDetails, setWriteCommand: setWriteCommand) {
  let cleanedResults = {};
  let resCheckResult = "unknown"
  let battCheckResult = "unknown"
  const terminator = "\r\n"

  if (results.results) {
    results.results?.forEach((item) => {
      if (!["< result", ">", ""].includes(item)) {
        let splitResult = item.split(": ");

        if (splitResult[1].includes(" mV")){
          splitResult[1] = splitResult[1].replace(" mV", "");
          if (splitResult[0] == "vcell_unloaded"){
            battCheckResult = checkBattVoltage(parseInt(splitResult[1]))
            setWriteCommand.setWriteCommand("< result" + terminator + `batt_voltage_ok: ${battCheckResult}` + terminator + ">" + terminator)
          }

        }
        if (splitResult[1].includes(" ohms")){
          splitResult[1] = splitResult[1].replace(" ohms", "");
          // Check resistance in here
          resCheckResult = checkResistance(jobDetails["resistorLoaded"], parseInt(splitResult[1]))
          // setWriteCommand.setWriteCommand("< result" + terminator + `resistance_ok: ${resCheckResult}` + terminator + ">" + terminator)
          
        }

        cleanedResults = {...cleanedResults, [splitResult[0]]: splitResult[1] }
      }
    });
    // Update resistance & battery 
    cleanedResults = {...cleanedResults, resistance_ok: resCheckResult, batt_voltage_ok: battCheckResult}
    // // setWriteCmd.setWriteCmd("Test data being written")
    // setWriteCommand.setWriteCommand("< result" + terminator + "resistance_ok: pass" + terminator + ">" + terminator)
    // setWriteCommand.setWriteCommand("< result" + terminator + "batt_voltage_ok: pass" + terminator + ">" + terminator)
    setUnitDetails.setUnitDetails((prev) => {
      return {...prev, ...cleanedResults}
    })
    setTimeout(() => {
      setWriteCommand.setWriteCommand("< result" + terminator + `batt_voltage_ok: ${battCheckResult}` + terminator + ">" + terminator)
    },100)
    setTimeout(() => {
      setWriteCommand.setWriteCommand("< result" + terminator + `resistance_ok: ${resCheckResult}` + terminator + ">" + terminator)
    },100)
  }
}

export default processResults;

function checkResistance(loadedValue:number|undefined, measuredValue:number){
  const threshold = 0.05

  if (loadedValue == undefined){
    return 'unknown'
  }

  const upperRange = loadedValue + (loadedValue * threshold)
  const lowerRange = loadedValue - (loadedValue * threshold)

  console.log('==== in resistance value ======')
  console.log(measuredValue < lowerRange, measuredValue > upperRange)
  if (measuredValue < lowerRange || measuredValue > upperRange){
    return 'fail'
  }
  return 'pass'
}

function checkBattVoltage(measuredCell:number | undefined){
  const vCellThreshold = 1.1
  
  if (measuredCell == undefined){
    return 'unknown'
  }

  if (measuredCell < vCellThreshold){
    return 'fail'
  }
  return 'pass'

}
