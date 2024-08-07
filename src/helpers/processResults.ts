import { RawResults, SetUnitDetails, setWriteCommand, JobDetails, UnitDetails } from "@/types/interfaces";
import { Dispatch, SetStateAction } from 'react'

function processResults(results: RawResults, jobDetails:JobDetails, setUnitDetails: SetUnitDetails, setWriteCommand: setWriteCommand) {
  let cleanedResults = {};
  let resCheckResult = "unknown"
  let battCheckResult = "unknown"
  let action = "flip"
  const terminator = "\r\n"

  if (results.results) {
    results.results?.forEach((item) => {
      if (!["< result", ">", ""].includes(item)) {
        let splitResult = item.split(": ");
        cleanedResults = {...cleanedResults, [splitResult[0]]: splitResult[1] }

        if (splitResult[1] == 'fail'){
          action = 'fail'
        }

        if (splitResult[1].includes(" mV")){
          splitResult[1] = splitResult[1].replace(" mV", "");
          if (splitResult[0] == "vcell_unloaded"){
            battCheckResult = checkBattVoltage(parseInt(splitResult[1]))
            cleanedResults = {...cleanedResults, batt_voltage_ok: battCheckResult }
            // sendResult(setWriteCommand.setWriteCommand, "batt_voltage_ok", battCheckResult)
            setWriteCommand.setWriteCommand("< result" + terminator + `batt_voltage_ok: ${battCheckResult}` + terminator + ">" + terminator) // TODO: Investigate why this fails when done back to back
          }

        }
        if (splitResult[1].includes(" ohms")){
          splitResult[1] = splitResult[1].replace(" ohms", "");
          // Check resistance in here
          resCheckResult = checkResistance(jobDetails["resistorLoaded"], parseInt(splitResult[1]))
          cleanedResults = {...cleanedResults, 'resistance_ok': resCheckResult }
        }

      }
    });

    sendResult(setWriteCommand.setWriteCommand, "resistance_ok", resCheckResult)
    // Update resistance & battery 
    if (action == 'fail' || battCheckResult == 'fail' || resCheckResult == "fail"){
      action = 'fail'
    }
    cleanedResults = {...cleanedResults, resistance_ok: resCheckResult, batt_voltage_ok: battCheckResult, action: action}
    let finalOutcome = finalCheck(cleanedResults)
    cleanedResults = {...cleanedResults, result: finalOutcome}

    console.log("====>",cleanedResults)

    setUnitDetails.setUnitDetails((prev) => {
      return {...prev, ...cleanedResults}
    })
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

function finalCheck(cleanedResults:any) {
  let assessedItems = ["batt_contact_ok",  "batt_voltage_ok",  "tilt_sw_opens",  "tilt_sw_closes",  "resistance_ok"]
  let outcome = 'pass'

  assessedItems.forEach((item) => {
    if (cleanedResults[item] == "unknown"){
      outcome = 'unknown'
    } else if (cleanedResults[item] == "fail"){
      outcome = 'fail'
    }
  })
  return outcome

}

async function sendResult(setWriteCommand:Dispatch<SetStateAction<string>>, target:string, result:string){
  const terminator = "\r\n"
  await new Promise(resolve => setTimeout(() => {
    setWriteCommand("< result" + terminator + `${target}: ${result}` + terminator + ">" + terminator)
  }, 100));
}